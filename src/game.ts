import { ServiceLocator } from "./system/service-locator";
import { MessageLog } from "./ui/message-log";
import { InputUtility } from "./util/input-utility";
import { Dice, DiceResult, DiceValue } from "./util/dice";
import { RNG } from "rot-js";

export class Game {
    private exitGame: boolean;
    private player: Actor;
    private enemies: Actor[];
    private currentEnemy: Actor;
    private enemyIndex: number;
    private weapons: Weapon[];

    constructor() {
        this.initialize();
        this.mainLoop();
    }

    private initialize(): void {
        let maxMessages = 15;
        ServiceLocator.provideMessageLog(new MessageLog(document.getElementById("messages"), maxMessages));
        ServiceLocator.getMessageLog().addMessages(...Array(maxMessages).fill("&nbsp;"));
        ServiceLocator.provideInputUtility(new InputUtility());

        this.weapons = [
            new Weapon(),
            new Weapon({ name: "Dagger", attack: { numberOf: 1, sides: 4 }, armorPenetration: { damage: 1, targetArmorClass: 15 } }),
            new Weapon({ name: "Mace", attack: { numberOf: 1, sides: 6 }, armorPenetration: { damage: 1, targetArmorClass: 18 } }),
            new Weapon({ name: "Shortsword", attack: { numberOf: 1, sides: 6 }, armorPenetration: { damage: 2, targetArmorClass: 15 } }),
            new Weapon({ name: "Club", attack: { numberOf: 1, sides: 4 } }),
            new Weapon({ name: "Warhammer", attack: { numberOf: 1, sides: 8 }, armorPenetration: { damage: 1, targetArmorClass: 18 } }),
        ];

        let playerWeapon = new Weapon(this.weapons[RNG.getUniformInt(0, this.weapons.length)]);
        this.player = new Actor({ name: "Player", hitPoints: 15, armorClass: 12, attack: playerWeapon.attack, armorPenetration: playerWeapon.armorPenetration, overpowerDamage: {numberOf: 1, sides: 4} });
        ServiceLocator.getMessageLog().addMessages(`${this.player.name} found ${playerWeapon.describe()}`);

        this.enemies = [
            new Actor({ name: "Human", hitPoints: 8, armorClass: 10 })
        ];
        this.nextEnemy();
    }

    private async mainLoop(): Promise<void> {
        while (!this.exitGame) {
            await ServiceLocator.getInputUtility().waitForInput(this.handleInput.bind(this));
        }
        ServiceLocator.getMessageLog().addMessages("Game ended!");
    }

    private handleInput(event: KeyboardEvent): boolean {
        if (event.key === "Escape") {
            this.exitGame = true;
        } else {
            this.handleAttack();
        }

        return true;
    }

    private handleAttack(): void {
        this.attack(this.player, this.currentEnemy);
        if (this.currentEnemy.hitPoints <= 0) {
            this.nextEnemy();
            return;
        }

        this.attack(this.currentEnemy, this.player);
        if (this.player.hitPoints <= 0) {
            this.exitGame = true;
        }
    }

    private attack(attacker: Actor, defender: Actor): void {
        let hit = false;
        let damage = 0;
        let armorPenetrationDamage = 0;
        let overpowerDamage = 0;
        let attackRoll = Dice.roll({ numberOf: 1, sides: 20, modifier: attacker.attackBonus });
        if (attackRoll.dice[0] === 20) {
            hit = true;
        } else if (attackRoll.dice[0] !== 1) {
            hit = attackRoll.result >= defender.armorClass;
        }

        if (hit) {
            damage = Dice.roll(attacker.attack).result + attacker.damageBonus;
        }

        if (attacker.armorPenetration && (attacker.armorPenetration.targetArmorClass <= 0 || defender.armorClass <= attacker.armorPenetration.targetArmorClass)) {
            if (hit && damage < attacker.armorPenetration.damage) {
                damage = attacker.armorPenetration.damage;
            } else {
                armorPenetrationDamage = attacker.armorPenetration.damage + attacker.damageBonus;
            }
        }

        if (attacker.overpowerDamage && defender.level <= attacker.level) {
            overpowerDamage = Dice.roll(attacker.overpowerDamage).result;
        }

        let message: string;
        if (damage) {
            damage += overpowerDamage;
            defender.hitPoints -= damage;
            message = `${attacker.name} hit ${defender.name} for ${damage}`;
            if (overpowerDamage > 0) {
                message += " + " + overpowerDamage;
            }
            message += " damage";
        } else if (armorPenetrationDamage) {
            armorPenetrationDamage += overpowerDamage;
            defender.hitPoints -= armorPenetrationDamage;
            message = `${attacker.name} hit ${defender.name}'s armor for ${armorPenetrationDamage}`;
            if (overpowerDamage > 0) {
                message += " + " + overpowerDamage;
            }
            message += " damage";
        } else if (overpowerDamage) {
            defender.hitPoints -= overpowerDamage;
            message = `${attacker.name} missed ${defender.name} but deals ${overpowerDamage} damage anyway`;
        } else {
            message = `${attacker.name} missed ${defender.name} (${attackRoll.result} vs ${defender.armorClass})`;
        }
        ServiceLocator.getMessageLog().addMessages(message);
    }

    private nextEnemy(): void {
        if (this.enemyIndex === undefined) {
            this.enemyIndex = 0;
        } else {
            this.enemyIndex++;
            if (this.enemyIndex >= this.enemies.length) {
                this.enemyIndex = 0;
            }
        }
        this.currentEnemy = new Actor(this.enemies[this.enemyIndex]);
        let weapon = new Weapon(this.weapons[RNG.getUniformInt(0, this.weapons.length)]);
        this.currentEnemy.attack = weapon.attack;
        this.currentEnemy.armorPenetration = weapon.armorPenetration;
        ServiceLocator.getMessageLog().addMessages(`Enemy ${this.currentEnemy.name} with ${weapon.describe()} appeared!`);
    }
}

// TODO add speed to implement turn order and multiple attacks per round
class Actor {
    name: string;
    hitPoints: number;
    level: number;
    armorClass: number;
    attackBonus: number;
    damageBonus: number;
    overpowerDamage: DiceValue;
    attack: DiceValue;
    armorPenetration: ArmorPeneration;

    constructor(params: Partial<Actor> = {}) {
        this.name = params.name || "Unknown actor";
        this.hitPoints = params.hitPoints || 1;
        this.level = params.level || 1;
        this.armorClass = params.armorClass || 0;
        this.attackBonus = params.attackBonus || 0;
        this.damageBonus = params.damageBonus || 0;
        this.overpowerDamage = params.overpowerDamage || null;
        this.attack = params.attack || new Weapon().attack;
        this.armorPenetration = params.armorPenetration || null;
    }
}

class ArmorPeneration {
    targetArmorClass: number;
    damage: number;
}

class Weapon {
    name: string;
    attack: DiceValue;
    armorPenetration: ArmorPeneration;

    constructor(params: Partial<Weapon> = {}) {
        this.name = params.name || "No Weapon";
        this.attack = params.attack || { numberOf: 1, sides: 2 };
        this.armorPenetration = params.armorPenetration || null;
    }

    describe(): string {
        let description = `a ${this.name} (${this.attack.numberOf}d${this.attack.sides}`;
        if (this.armorPenetration) {
            description += `; ${this.armorPenetration.damage}/AC ${this.armorPenetration.targetArmorClass}`;
        }
        description += ")";
        return description;
    }
}