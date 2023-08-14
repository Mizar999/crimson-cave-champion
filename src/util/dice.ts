import { RNG } from "rot-js/lib/index";

export class DiceResult {
    constructor(public readonly result: number, public readonly sides: number, public readonly modifier: number, public readonly dice: ReadonlyArray<number>) { }
}

export class Dice {
    static roll(data: DiceValue): DiceResult {
        const sides = Math.max(data.sides, 1);
        const modifier = data.modifier || 0;
        let dice = Array<number>(data.numberOf).fill(0).map(() => RNG.getUniformInt(1, sides));
        return new DiceResult(dice.reduce((previous, current) => previous + current) + modifier, sides, modifier, dice);
    }
}

export class DiceValue {
    numberOf: number;
    sides: number;
    modifier?: number;
}