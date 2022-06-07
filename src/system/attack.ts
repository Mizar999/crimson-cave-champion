import { Dice, DiceValue } from "../util/dice";

export class Attack {
    damage: DiceValue;
    attackBonus: number;
    isFrayDie: Boolean;

    constructor() {
        this.damage = new DiceValue(0, 1);
        this.attackBonus = 0;
        this.isFrayDie = false;
    }
}