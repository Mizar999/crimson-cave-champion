import { Attack } from "../../system/attack";
import { DiceValue } from "../../util/dice";
import { BodyType } from "./body-type";

export class HumanBody extends BodyType {
    getAttacks(): Attack[] {
        let attacks = [];
        
        let attack = new Attack();
        attack.damage = new DiceValue(1, 2);
        attack.isFrayDie = false;
        attacks.push(attack);
        
        return attacks;
    }
}