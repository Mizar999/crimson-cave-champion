import { RNG } from "rot-js/lib/index";

export class DiceResult {
    constructor(public readonly result: number, public readonly sides: number, public readonly modifier: number, public readonly dice: ReadonlyArray<number>) { }
}

export class Dice {
    static roll(numberOf: number, sides: number, modifier: number = 0): DiceResult {
        sides = Math.max(sides, 1);
        let sum = 0;
        let dice: number[] = [];
        while (numberOf > 0) {
            dice.push(RNG.getUniformInt(1, sides));
            sum += dice[dice.length - 1];
            --numberOf;
        }
        return new DiceResult(sum + modifier, sides, modifier, dice);
    }
}

export class DiceValue {
    constructor(public numberOf: number, public sides: number, public modifier: number = 0) {
    }

    roll(): DiceResult {
        return Dice.roll(this.numberOf, this.sides, this.modifier);
    }
}