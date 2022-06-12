import { RNG } from "rot-js";
import { Actor, ActorController, SavingThrowType } from "../actor/actor";
import { Creature, CreatureController } from "../actor/creature";
import { Player, PlayerController } from "../actor/player";
import { Dice, DiceResult, DiceValue } from "../util/dice";
import { Attack } from "./attack";
import { ServiceLocator } from "./service-locator";

export class SystemManager {
    private static attackDice: DiceValue = {numberOf: 1, sides: 20};
    private static savingThrowDice: DiceValue = {numberOf: 2, sides: 8};
    private static attributeDice: DiceValue = {numberOf: 4, sides: 6};

    static attack(attacker: Actor, target: Actor, attacks: Attack[]): void {
        let life: number;
        let targetLevel: number;
        let targetController: ActorController;
        switch (target.type) {
            case "Player":
                let player = <Player>target;
                life = player.hitPoints;
                targetLevel = player.level;
                targetController = new PlayerController(player);
                break;
            case "Creature":
                let creature = <Creature>target;
                life = creature.hitDice;
                targetLevel = creature.maxHitDice;
                targetController = new CreatureController(creature);
                break;
        }

        if (life <= 0) {
            ServiceLocator.getMessageLog().addMessages(`${targetController.describe()} is already defeated`);
            return;
        }

        let attackResult: { hit: boolean, diceResult: number, attackRoll: number, damage: number }[] = [];

        attacks.forEach(attack => {
            let nextResult = { hit: false, diceResult: 0, attackRoll: 0, damage: 0 };
            let hit = false;
            
            if (attack.isFrayDie) {
                if (attacker.type === "Player" && targetLevel) {
                    hit = (<Player>attacker).level >= targetLevel;
                }
            } else {
                let diceResult = Dice.roll(this.attackDice).result;
                nextResult.diceResult = diceResult;

                hit = diceResult >= 20;
                if (!hit && diceResult > 1) {
                    let attackRoll = (diceResult + attack.attackBonus + targetController.getArmorClass());
                    nextResult.attackRoll = attackRoll;
                    hit = attackRoll >= 20;
                }
            }

            if (hit) {
                let damage = this.getDamage(attack.damage);
                nextResult.hit = true;
                nextResult.damage = damage;

                life -= damage;
                if (life < 0) {
                    life = 0;
                }

                switch (target.type) {
                    case "Player":
                        (<Player>target).hitPoints = life;
                        break;
                    case "Creature":
                        (<Creature>target).hitDice = life;
                        break;
                }
            }

            attackResult.push(nextResult);
            if (life <= 0) {
                return;
            }
        });

        let totalDamage = 0;
        let result: string = "";
        attackResult.forEach(element => {
            totalDamage += element.damage;

            if (result) {
                result += '; ';
            }

            if (element.diceResult == 1) {
                result += '1!';
            } else if (element.diceResult == 20) {
                result += '20!';
            } else {
                result += element.attackRoll.toString();
            }

            if (element.hit) {
                result += `/${element.damage}`;
            } else {
                result += '/miss';
            }
        });

        let prefix: string;
        if (attacker.type == "Player") {
            prefix = `You attack ${targetController.describe()}`;
        } else {

            prefix = `${new CreatureController(<Creature>attacker).describe()} attacks you`;
        }

        ServiceLocator.getMessageLog().addMessages(`${prefix} for ${totalDamage} damage [${result}]`);
    }

    static getDamage(attack: DiceValue): number {
        let rolls = [...Dice.roll(attack).dice];

        if (attack.modifier) {
            const differences = rolls.map(value => this.convertToDamage(value + attack.modifier) - this.convertToDamage(value));
            const index = differences.indexOf(Math.max(...differences));
            rolls[index] += attack.modifier;
        }

        return rolls.reduce((previous, current) => this.convertToDamage(current) + previous, 0);
    }

    private static convertToDamage(value: number): number {
        if (value >= 10) {
            return 4;
        } else if (value >= 6) {
            return 2;
        } else if (value >= 2) {
            return 1;
        }
        return 0;
    }

    static savingThrow(source: Actor, target: Actor, savingThrowType: SavingThrowType): boolean {
        let diceResult = Dice.roll(this.savingThrowDice).result;
        if (diceResult <= 2) {
            return false;
        } else if (diceResult >= 16) {
            return true;
        }

        // TODO Traps
        let difficulty = 9;
        switch (source.type) {
            case "Player":
                difficulty += (<Player>source).level;
                break;
            case "Creature":
                difficulty += (<Creature>source).hitDice;
                break;
        }

        let modifier = 0;
        switch (target.type) {
            case "Player":
                let player = <Player>target;
                switch (savingThrowType) {
                    case "Resist":
                        modifier += PlayerController.getAttributeModifier(player.constitution);
                    case "Dodge":
                        modifier += PlayerController.getAttributeModifier(player.dexterity);
                    case "Dispel":
                        modifier += PlayerController.getAttributeModifier(player.wisdom);
                }
                break;
            case "Creature":
                let creature = <Creature>target;
                if (creature.savingThrows.indexOf(savingThrowType) > -1) {
                    modifier += creature.skillBonus;
                }
                break;
        }

        return (diceResult + modifier) >= difficulty;
    }

    static getAttributes(quantity: number): number[] {
        let result: number[];
        let maxTries = 10;
        let attribute: number;
        let maxModifier: number;

        do {
            maxModifier = 0;
            result = [];
            --maxTries;

            for (let i = 0; i < quantity; ++i) {
                attribute = this.resultWithoutLowest(Dice.roll(this.attributeDice));
                maxModifier += PlayerController.getAttributeModifier(attribute);
                result.push(attribute);
            }
        } while (maxTries > 0 && maxModifier < 0);

        if (Math.max(...result) < 16) {
            let indices: number[] = [];
            let lowestValue = Math.min(...result);

            result.forEach((value, index) => {
                if (value == lowestValue) {
                    indices.push(index);
                }
            });

            result[indices.sort(() => 0.5 - RNG.getUniform())[0]] = 16;
        }

        return result;
    }

    static resultWithoutLowest(result: DiceResult): number {
        let temp: number[] = result.dice.slice();
        temp.splice(temp.indexOf(Math.min(...temp)), 1);
        let length = temp.length;
        let returnValue = 0;
        while (length--) {
            returnValue += temp[length];
        }
        return returnValue;
    }
}