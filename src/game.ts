import { ServiceLocator } from "./system/service-locator";
import { MessageLog } from "./ui/message-log";
import { InputUtility } from "./util/input-utility";
import { Dice } from "./util/dice";
import { Actor } from "./data/actor";
import { Weapon } from "./data/weapon";
import { RNG } from "rot-js";
import { Factory } from "./data/factory";

export class Game {
    private exitGame: boolean;
    private player: Actor;
    private currentEnemy: Actor;
    private enemies: string[];
    private weapons: string[];

    constructor() {
        this.initialize();
        this.mainLoop();
    }

    private initialize(): void {
        let maxMessages = 25;
        ServiceLocator.provideMessageLog(new MessageLog(document.getElementById("messages"), maxMessages));
        ServiceLocator.getMessageLog().addMessages(...Array(maxMessages).fill("&nbsp;"));
        ServiceLocator.provideInputUtility(new InputUtility());
        ServiceLocator.provideFactory(new Factory());
        ServiceLocator.getFactory().initialize();

        this.weapons = ["", "Dagger", "Mace", "Shortsword", "Club", "Warhammer"];
        this.enemies = ["Human"];

        let playerWeapon = this.getRandomWeapon();
        this.player = ServiceLocator.getFactory().createActor("Player");
        ServiceLocator.getMessageLog().addMessages(`${this.player.name} found ${playerWeapon.describe()}`);

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
            defender.hitPoints -= (damage + overpowerDamage);
            message = `${attacker.name} hit ${defender.name} for ${damage}`;
            if (overpowerDamage > 0) {
                message += " + " + overpowerDamage;
            }
            message += " damage";
        } else if (armorPenetrationDamage) {
            defender.hitPoints -= (armorPenetrationDamage + overpowerDamage);
            message = `${attacker.name} hit ${defender.name}'s armor for ${armorPenetrationDamage}`;
            if (overpowerDamage > 0) {
                message += " + " + overpowerDamage;
            }
            message += " damage";
        } else if (overpowerDamage) {
            defender.hitPoints -= overpowerDamage;
            message = `${attacker.name} hit ${defender.name} for ${overpowerDamage} overpower damage`;
        } else {
            message = `${attacker.name} missed ${defender.name} (${attackRoll.result} vs ${defender.armorClass})`;
        }
        ServiceLocator.getMessageLog().addMessages(message);
    }

    private getRandomEnemy(): Actor {
        return ServiceLocator.getFactory().createActor(RNG.getItem<string>(this.enemies));
    }

    private getRandomWeapon(): Weapon {
        return ServiceLocator.getFactory().createWeapon(RNG.getItem<string>(this.weapons));
    }

    private nextEnemy(): void {
        this.currentEnemy = this.getRandomEnemy();
        let weapon = this.getRandomWeapon();
        this.currentEnemy.attack = weapon.attack;
        this.currentEnemy.armorPenetration = weapon.armorPenetration;
        ServiceLocator.getMessageLog().addMessages(`Enemy ${this.currentEnemy.name} with ${weapon.describe()} appeared!`);
    }
}
