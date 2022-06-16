import { DiceValue } from "../util/dice";

export type AttackFlag = "fraydie" | "alwayshits";

export class Attack {
    damage: DiceValue;
    attackBonus: number;
    flags: AttackFlag[];

    constructor(params: Partial<Attack> = {}) {
        this.damage = params.damage || {numberOf: 0, sides: 1};
        this.attackBonus = params.attackBonus || 0;
        this.flags = params.flags || [];
    }
}