import { Attack } from "../system/attack";
import { DiceValue } from "../util/dice";
import { BodyType } from "./body-type";

export class HumanoidBody extends BodyType {
    private attacks: Attack[];

    constructor() {
        super();
        this.attacks = [new Attack({ damage: { numberOf: 1, sides: 2 } })];
    }

    getAttacks(): Attack[] {
        return [...this.attacks];
    }
}