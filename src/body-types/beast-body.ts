import { RNG } from "rot-js/lib/index";

import { Attack } from "../system/attack";
import { BodyType } from "./body-type";

export class BeastBody extends BodyType {
    private data: { [key: number]: number };

    constructor(private readonly weights?: { weight: number, attacks: Attack[] }[]) {
        super();

        if (!this.weights) {
            this.weights = [];
        }

        this.data = this.weights.reduce((previous, current, index) => ({
            ...previous,
            [index]: current.weight
        }), {});
    }

    getAttacks(): Attack[] {
        if (this.weights) {
            let index = RNG.getWeightedValue(this.data);
            return [...this.weights[index].attacks];
        }
        return [];
    }
}