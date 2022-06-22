import { DiceValue } from "../util/dice";

export type EffectType = "lifechange";

export class Effect {
    constructor(public type: EffectType, public duration: number) { }
}

export class LifeChangeEffect extends Effect {
    amount: DiceValue;
    delay: number;
    currentDelay: number;

    constructor(params: Partial<LifeChangeEffect> = {}) {
        super("lifechange", (params.duration || 1));
        this.amount = params.amount || {numberOf: 0, sides: 1};
        this.delay = params.delay || 0;
        this.currentDelay = params.currentDelay || this.delay;
    }
}