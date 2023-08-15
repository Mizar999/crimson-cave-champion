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
            new Weapon({ name: "Dagger", attack: { numberOf: 1, sides: 4 }, shock: { damage: 1, targetArmorClass: 15 } }),
            new Weapon({ name: "Mace", attack: { numberOf: 1, sides: 6 }, shock: { damage: 1, targetArmorClass: 18 } }),
            new Weapon({ name: "Shortsword", attack: { numberOf: 1, sides: 6 }, shock: { damage: 2, targetArmorClass: 15 } }),
            new Weapon({ name: "Club", attack: { numberOf: 1, sides: 4 } }),
            new Weapon({ name: "Warhammer", attack: { numberOf: 1, sides: 8 }, shock: { damage: 1, targetArmorClass: 18 } }),
        ];

        let playerWeapon = new Weapon(this.weapons[RNG.getUniformInt(0, this.weapons.length)]);
        this.player = new Actor({ name: "Player", hitPoints: 15, armorClass: 18, attacks: [playerWeapon.attack], shock: playerWeapon.shock });
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
        let shockDamage = 0;
        let attackRoll = Dice.roll({ numberOf: 1, sides: 20, modifier: attacker.attackBonus });
        if (attackRoll.dice[0] === 20) {
            hit = true;
        } else if (attackRoll.dice[0] !== 1) {
            hit = attackRoll.result >= defender.armorClass;
        }

        if (hit) {
            damage = attacker.attacks.reduce((previous, current) => previous + Dice.roll(current).result, 0) + attacker.damageBonus;
        }

        if (attacker.shock) {
            if (hit && damage < attacker.shock.damage) {
                damage = attacker.shock.damage;
            } else if (attacker.shock.targetArmorClass <= 0 || defender.armorClass <= attacker.shock.targetArmorClass) {
                shockDamage = attacker.shock.damage;
            }
        }

        if (damage) {
            defender.hitPoints -= damage;
            ServiceLocator.getMessageLog().addMessages(`${attacker.name} hit ${defender.name} for ${damage} damage`);
        } else if (shockDamage) {
            defender.hitPoints -= shockDamage;
            ServiceLocator.getMessageLog().addMessages(`${attacker.name} hit ${defender.name}'s armor for ${shockDamage} damage`);
        } else {
            ServiceLocator.getMessageLog().addMessages(`${attacker.name} missed ${defender.name} (${attackRoll.result} vs ${defender.armorClass})`);
        }
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
        this.currentEnemy.attacks = [weapon.attack];
        this.currentEnemy.shock = weapon.shock;
        ServiceLocator.getMessageLog().addMessages(`Enemy ${this.currentEnemy.name} with ${weapon.describe()} appeared!`);
    }
}

// TODO implement player level and enemy hit dice
// TODO implement fray damage: only applies if enemies hit dice are less or equal than player level
class Actor {
    name: string;
    hitPoints: number;
    armorClass: number;
    attackBonus: number;
    damageBonus: number;
    attacks: DiceValue[];
    shock: Shock;

    constructor(params: Partial<Actor> = {}) {
        this.name = params.name || "Unknown actor";
        this.hitPoints = params.hitPoints || 1;
        this.armorClass = params.armorClass || 0;
        this.attackBonus = params.attackBonus || 0;
        this.damageBonus = params.damageBonus || 0;
        this.attacks = params.attacks || [new Weapon().attack];
        this.shock = params.shock || null;
    }
}

class Shock {
    targetArmorClass: number;
    damage: number;
}

class Weapon {
    name: string;
    attack: DiceValue;
    shock: Shock;

    constructor(params: Partial<Weapon> = {}) {
        this.name = params.name || "No Weapon";
        this.attack = params.attack || { numberOf: 1, sides: 2 };
        this.shock = params.shock || null;
    }

    describe(): string {
        let description = `a ${this.name} (${this.attack.numberOf}d${this.attack.sides}`;
        if (this.shock) {
            description += `; ${this.shock.damage}/AC ${this.shock.targetArmorClass}`;
        }
        description += ")";
        return description;
    }
}