import { RNG } from "rot-js";

import { Attack } from "../system/attack";
import { Item, ItemController } from "../item/item";

export type EquipmentType = "hand" | "finger" | "Body" | "neck";

export class Equipment {
    constructor(public type: EquipmentType, public items: Item[] = [], public maximum: number = 1) { }
}

export class BodyData {
    armorClass: number | undefined;
    armorClassModifier: number;
    equipment: Equipment[];
    naturalAttacks: { weight: number, attacks: Attack[] }[];
    additionalAttacks: Attack[];

    constructor(params: Partial<BodyData> = {}) {
        this.armorClass = params.armorClass || undefined;
        this.armorClassModifier = params.armorClassModifier || 0;
        this.equipment = params.equipment || [];
        this.naturalAttacks = params.naturalAttacks || [];
        this.additionalAttacks = params.additionalAttacks || [];
    }
}

export class BodyController {
    constructor(public body: BodyData) { }

    getAttacks(): Attack[] {
        const result: Attack[] = [];

        if (this.body.equipment && this.body.equipment.length > 0) {
            const equipment = this.body.equipment.find(value => value.type == "hand");
            if (equipment) {
                let item = equipment.items.find(item => item.type == "weapon");
                if (item) {
                    result.push(...ItemController.getAttacks(item));
                }
            }
        }

        if (result.length == 0 && this.body.naturalAttacks && this.body.naturalAttacks.length > 0) {
            const data = this.body.naturalAttacks.reduce((previous, current, index) => ({
                ...previous,
                [index]: current.weight
            }), {});

            result.push(...this.body.naturalAttacks[RNG.getWeightedValue(data)].attacks);
        }

        if (this.body.additionalAttacks) {
            result.push(...this.body.additionalAttacks);
        }

        return result;
    }
}