import { DiceValue } from "../util/dice";
import { ArmorPeneration } from "./armor-penetration";

export class Weapon {
    name: string;
    attack: DiceValue;
    armorPenetration: ArmorPeneration;

    constructor(params: Partial<Weapon> = {}) {
        this.name = params.name || "No Weapon";
        this.attack = params.attack || { numberOf: 1, sides: 2 };
        this.armorPenetration = params.armorPenetration || null;
    }

    describe(): string {
        let description = `a ${this.name} (${this.attack.numberOf}d${this.attack.sides}`;
        if (this.armorPenetration) {
            description += `; ${this.armorPenetration.damage}/AC ${this.armorPenetration.targetArmorClass}`;
        }
        description += ")";
        return description;
    }
}