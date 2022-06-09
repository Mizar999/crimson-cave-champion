import { Attack } from "../system/attack";

export class BodyType {
    getAttacks(): Attack[] {
        return [];
    }

    getArmorClass(): number {
        return undefined;
    }

    getArmorClassModifier(): number {
        return 0;
    }
}