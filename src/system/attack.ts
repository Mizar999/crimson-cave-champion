import { Dice, DiceValue } from "../util/dice";

export class Attack {
    damage: DiceValue;
    attackBonus: number;
    damageBonus: number;
    hitsAlways: Boolean;

    constructor() {
        this.damage = new DiceValue(0, 1);
        this.attackBonus = 0;
        this.damageBonus = 0;
        this.hitsAlways = false;
    }
}