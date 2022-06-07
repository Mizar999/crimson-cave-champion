import { Actor, ActorType, SavingThrowType } from "../actor/actor";
import { Creature } from "../actor/creature";
import { Player } from "../actor/player";
import { Dice, DiceValue } from "../util/dice";
import { Attack } from "./attack";

export class SystemManager {
    static attack(attacker: Actor, target: Actor, attacks: Attack[]): string {
        let life: number;
        let targetLevel: number;
        switch (target.type) {
            case ActorType.Player:
                let stats = (<Player>target).stats;
                life = stats.hitPoints;
                targetLevel = stats.level;
                break;
            case ActorType.Creature:
                let creature = <Creature>target;
                life = creature.hitDice;
                targetLevel = creature.breed.maxHitDice;
                break;
        }

        if (life <= 0) {
            return `${target.describe()} is already defeated`;
        }

        let attackResult: { hit: boolean, diceResult: number, attackRoll: number, damage: number }[] = [];

        attacks.forEach(attack => {
            let nextResult = { hit: false, diceResult: 0, attackRoll: 0, damage: 0 };
            let hit = false;

            if (attack.isFrayDie && attacker.type === ActorType.Player) {
                hit = (<Player>attacker).stats.level > targetLevel;
            }

            if (!hit) {
                let diceResult = Dice.roll(1, 20).result;
                nextResult.diceResult = diceResult;

                hit = diceResult >= 20;
                if (!hit && diceResult > 1) {
                    let armorClass = 0;
                    switch (target.type) {
                        case ActorType.Player:
                            armorClass = (<Player>target).stats.armorClass;
                            break;
                        case ActorType.Creature:
                            armorClass = (<Creature>target).breed.armorClass;
                            break;
                    }
                    let attackRoll = (diceResult + attack.attackBonus + armorClass);
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
                    case ActorType.Player:
                        (<Player>target).stats.hitPoints = life;
                        break;
                    case ActorType.Creature:
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
        result = `${attacker.describe()} attacks ${target.describe()} for ${totalDamage} damage [${result}]`;
        return result;
    }

    static getDamage(attack: DiceValue): number {
        let damage = 0;
        let modifier = attack.modifier;
        let rolls = attack.roll().dice.slice().sort((a, b) => b - a); // Sort in descending order
        let length = rolls.length;

        rolls.forEach((value, index) => {
            // Damge modifier is only applied to a single die
            if (modifier > 0) {
                if ((value < 10 && value + modifier >= 10) || (value < 6 && value + modifier >= 6) || (value < 2 && value + modifier >= 2) || (index === length - 1)) {
                    value += modifier;
                    modifier = 0;
                }
            }

            if (value >= 10) {
                damage += 4;
            } else if (value >= 6) {
                damage += 2;
            } else if (value >= 2) {
                damage += 1;
            }
        });
        return damage;
    }

    static savingThrow(source: Actor, target: Actor, savingThrowType: SavingThrowType): boolean {
        let diceResult = Dice.roll(2, 8).result;
        if (diceResult <= 2) {
            return false;
        } else if (diceResult >= 16) {
            return true;
        }

        // TODO Traps
        let difficulty = 9;
        switch (source.type) {
            case ActorType.Player:
                difficulty += (<Player>source).stats.level;
                break;
            case ActorType.Creature:
                difficulty += (<Creature>source).hitDice;
                break;
        }

        let modifier = 0;
        switch (target.type) {
            case ActorType.Player:
                let player = <Player>target;
                switch (savingThrowType) {
                    case SavingThrowType.Resist:
                        modifier += player.stats.constitution.getModifier();
                    case SavingThrowType.Dodge:
                        modifier += player.stats.dexterity.getModifier();
                    case SavingThrowType.Dispel:
                        modifier += player.stats.wisdom.getModifier();
                }
                break;
            case ActorType.Creature:
                let creature = <Creature>target;
                if (creature.breed.savingThrows.indexOf(savingThrowType) > -1) {
                    modifier += creature.breed.skillBonus;
                }
                break;
        }

        return (diceResult + modifier) >= difficulty;
    }
}