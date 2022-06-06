import { DiceValue } from "../util/dice";

export class Combat {
    static getDamage(attack: DiceValue): number {
        let damage: number = 0;
        attack.roll().dice.forEach(value => {
            if (value >= 10) {
                damage += 4;
            } else if (value >= 6) {
                damage += 2;
            } else if (value >= 2) {
                damage += 1;
            }
        });
        return damage;
    }
}