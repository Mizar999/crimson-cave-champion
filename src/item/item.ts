import { Attack } from "../system/attack";

export const enum SlotType {
    None,
    MainHand,
    OffHand,
    TwoHand,
    Armor,
    Ring
}

export class Item {
    private name: string;
    private slot: SlotType;
    private attacks: Attack[];
    private armorClass: number;
    private armorClassModifier: number;
    private weight: number;
    // private effect: Effect; // TODO implement effects
}