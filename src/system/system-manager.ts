import { Actor, ActorType, SavingThrowType } from "../actor/actor";
import { Creature } from "../actor/creature";
import { Player } from "../actor/player";
import { Dice, DiceValue } from "../util/dice";

export class SystemManager {
    static getDamage(attack: DiceValue): number {
        let damage: number = 0;
        attack.roll().dice.forEach(value => {
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