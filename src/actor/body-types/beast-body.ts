import { RNG } from "rot-js/lib/index";

import { Attack } from "../../system/attack";
import { BodyType } from "./body-type";

export class BeastBody extends BodyType {
    constructor(private readonly attacks: Map<string, Attack[]>, private readonly weights: {}) {
        super();
    }

    getAttacks(): Attack[] {
        let key = RNG.getWeightedValue(this.weights);
        if (this.attacks.has(key)) {
            return this.attacks.get(key).slice();
        }
    }
}