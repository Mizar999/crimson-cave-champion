import { RNG } from "rot-js";

import { Attack } from "../system/attack";
import { Item } from "../item/item";

export type EquipmentType = "hand" | "finger" | "Body" | "neck";

export class BodyData {
    armorClass: number | undefined;
    armorClassModifier: number;
    equipment: { type: EquipmentType, items: Item[], maximum: number }[];
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
    static getAttacks(body: BodyData): Attack[] {
        const result: Attack[] = [];

        if (result.length == 0 && body.naturalAttacks && body.naturalAttacks.length > 0) {
            const data = body.naturalAttacks.reduce((previous, current, index) => ({
                ...previous,
                [index]: current.weight
            }), {});

            result.push(...body.naturalAttacks[RNG.getWeightedValue(data)].attacks);
        }

        if (body.additionalAttacks) {
            result.push(...body.additionalAttacks);
        }

        return result;
    }
}