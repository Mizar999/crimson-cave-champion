import { DiceValue } from "../util/dice";

export class Attack {
    damage: DiceValue;
    attackBonus: number;
    isFrayDie: Boolean;

    constructor(params: Partial<Attack> = {}) {
        this.damage = params.damage || {numberOf: 0, sides: 1};
        this.attackBonus = params.attackBonus || 0;
        this.isFrayDie = params.isFrayDie || false;
    }
}