import { RNG } from "rot-js/lib/index";

export class DiceResult {
    constructor(public readonly result: number, public readonly sides: number, public readonly modifier: number, public readonly dice: ReadonlyArray<number>) { }
}

export class Dice {
    static roll(data: DiceValue): DiceResult {
        data.sides = Math.max(data.sides, 1);
        let sum = 0;
        let dice: number[] = [];
        while (data.numberOf > 0) {
            dice.push(RNG.getUniformInt(1, data.sides));
            sum += dice[dice.length - 1];
            --data.numberOf;
        }
        return new DiceResult(sum + data.modifier, data.sides, data.modifier, dice);
    }
}

export class DiceValue {
    numberOf: number;
    sides: number;
    modifier?: number;
}