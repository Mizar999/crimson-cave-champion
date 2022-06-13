import { RNG } from "rot-js";

import { Attack } from "../system/attack";
import { ItemController, Item, Shield, Armor } from "../item/item";

export type EquipmentType = "hand" | "finger" | "body" | "neck";

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

export const HumanoidEquipment: Equipment[] = [
    { type: "hand", items: [], maximum: 2 },
    { type: "finger", items: [], maximum: 2 },
    { type: "body", items: [], maximum: 1 },
    { type: "neck", items: [], maximum: 1 }
];

export class BodyController {
    static getAttacks(body: BodyData): Attack[] {
        const result: Attack[] = [];

        if (body.equipment && body.equipment.length > 0) {
            const equipment = body.equipment.find(value => value.type == "hand");
            if (equipment) {
                let item = equipment.items.find(item => item.type == "weapon");
                if (item) {
                    result.push(...ItemController.getAttacks(item));
                }
            }
        }

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

    static getArmorClass(body: BodyData): number | undefined {
        let armorClass = undefined;

        const equipment = body.equipment.find(value => value.type == "body");
        if (equipment) {
            equipment.items.forEach(value => {
                let armor = <Armor>value;
                if (armor.armorClass !== undefined) {
                    if (armorClass === undefined) {
                        armorClass = armor.armorClass;
                    } else {
                        armorClass = Math.min(armorClass, armor.armorClass);
                    }
                }
            });
        }

        return armorClass;
    }

    static getArmorClassModifier(body: BodyData): number {
        let armorClassModifier = 0;

        const equipment = body.equipment.find(value => value.type == "hand");
        if (equipment) {
            equipment.items.forEach(value => {
                if (value.type == "shield") {
                    let shield = <Shield>value;
                    armorClassModifier = Math.min(armorClassModifier, shield.armorClassModifier);
                }
            });
        }

        return armorClassModifier;
    }

    static equip(body: BodyData, item: Item): boolean {
        let equipped = false;
        let equipmentType: EquipmentType;

        switch (item.type) {
            case "weapon":
            case "shield":
                equipmentType = "hand";
                break;
            case "armor":
                equipmentType = "body";
                break;
            case "ring":
                equipmentType = "finger";
                break;
            case "amulet":
                equipmentType = "neck";
                break;
            default:
                return equipped;
        }

        const equipment = body.equipment.find(value => value.type == equipmentType);
        if (equipment) {
            const remainingSlots = equipment.items.reduce<number>((previous, current) => previous - (current.flags.indexOf("twohanded") > -1 ? 2 : 1), equipment.maximum);
            const isTwoHanded = item.flags.indexOf("twohanded") > -1;
            if ((isTwoHanded && remainingSlots >= 2) || (!isTwoHanded && remainingSlots > 0)) {
                equipment.items.push(item);
                equipped = true;
            }
        }

        return equipped;
    }
}