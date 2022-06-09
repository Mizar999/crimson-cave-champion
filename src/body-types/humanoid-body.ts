import { Attack } from "../system/attack";
import { DiceValue } from "../util/dice";
import { BodyType } from "./body-type";

export class HumanoidBody extends BodyType {
    private attacks: Attack[];
    
    constructor() {
        super();

        this.attacks = [];

        let attack = new Attack();
        attack.damage = {numberOf: 1, sides: 2};
        attack.isFrayDie = false;
        this.attacks.push(attack);
    }

    getAttacks(): Attack[] {
        return [...this.attacks];
    }
}