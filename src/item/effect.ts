export type EffectType = "lifechange" | "regeneration";

export class Effect {
    constructor(public type: EffectType, public duration: number) { }
}

export class LifeChangeEffect extends Effect {
    amount: number;

    constructor(params: Partial<LifeChangeEffect> = {}) {
        super("lifechange", 1);
        this.amount = params.amount || 1;
    }
}

export class RegenerationEffect extends Effect {
    amount: number;

    constructor(params: Partial<LifeChangeEffect> = {}) {
        super("lifechange", (params.duration || 1));
        this.amount = params.amount || 1;
    }
}