import { Visual } from "../ui/visual";

export class Breed {
    name: string;
    visual: Visual;
    maxHitDice: number;
    armorClass: number;
    move: number;
    skillBonus: number;

    constructor(params: any = {}) {
        let parent: any = {};
        if (params.parent) {
            parent = params.parent;
        }

        this.name = params.name || parent.name || "unknown breed";
        this.visual = params.visual || parent.visual || new Visual('?', "red", "white");
        this.maxHitDice = params.maxHitDice || parent.maxHitDice || 1;
        this.armorClass = params.armorClass || parent.armorClass || 7;
        this.move = params.move || parent.move || 1;
        this.skillBonus = params.skillBonus || parent.skillBonus || 0;
    }
}