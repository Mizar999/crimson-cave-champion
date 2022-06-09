import { DiceValue } from "../util/dice";

export class Attack {
    damage: DiceValue;
    attackBonus: number;
    isFrayDie: Boolean;

    constructor() {
        this.damage = {numberOf: 0, sides: 1};
        this.attackBonus = 0;
        this.isFrayDie = false;
    }
}