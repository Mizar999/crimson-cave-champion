import { Visual } from "../ui/visual";
import { Actor, SavingThrowType } from "../actor/actor";
import { BodyType } from "./body-types/body-type";

export class Breed {
    name: string;
    visual: Visual;
    maxHitDice: number;
    armorClass: number;
    baseSpeed: number;
    skillBonus: number;
    savingThrows: SavingThrowType[];
    body: BodyType;

    constructor(params: any = {}) {
        let parent: any = {};
        if (params.parent) {
            parent = params.parent;
        }

        this.name = params.name || parent.name || "unknown breed";
        this.visual = params.visual || parent.visual || new Visual('?', "red", "white");
        this.maxHitDice = params.maxHitDice || parent.maxHitDice || 1;
        this.armorClass = params.armorClass || parent.armorClass || 7;
        this.baseSpeed = params.baseSpeed || parent.baseSpeed || Actor.defaultSpeed;
        this.skillBonus = params.skillBonus || parent.skillBonus || 0;
        this.savingThrows = params.savingThrows || parent.savingThrows || [];
        this.body = params.body || parent.body || new BodyType();
    }
}