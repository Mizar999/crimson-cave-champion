import { Visual } from "../ui/visual";
import { SavingThrowType } from "../actor/actor";

export class Breed {
    name: string;
    visual: Visual;
    maxHitDice: number;
    armorClass: number;
    actions: number;
    skillBonus: number;
    savingThrows: SavingThrowType[];

    constructor(params: any = {}) {
        let parent: any = {};
        if (params.parent) {
            parent = params.parent;
        }

        this.name = params.name || parent.name || "unknown breed";
        this.visual = params.visual || parent.visual || new Visual('?', "red", "white");
        this.maxHitDice = params.maxHitDice || parent.maxHitDice || 1;
        this.armorClass = params.armorClass || parent.armorClass || 7;
        this.actions = params.actions || parent.actions || 1;
        this.skillBonus = params.skillBonus || parent.skillBonus || 0;
        this.savingThrows = params.savingThrows || parent.savingThrows || [];
    }
}