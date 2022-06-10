import { Visual } from "../ui/visual";
import { Actor, SavingThrowType } from "../actor/actor";
import { BodyData } from "../body/body-data";

export class Breed {
    name: string;
    visual: Visual;
    maxHitDice: number;
    baseSpeed: number;
    skillBonus: number;
    savingThrows: SavingThrowType[];
    body: BodyData;

    constructor(params: any = {}) {
        this.name = params.name || "unknown breed";
        this.visual = params.visual || new Visual('?', "red", "white");
        this.maxHitDice = params.maxHitDice || 1;
        this.baseSpeed = params.baseSpeed || Actor.defaultSpeed;
        this.skillBonus = params.skillBonus || 0;
        this.savingThrows = params.savingThrows || [];
        this.body = params.body || new BodyData();
    }
}