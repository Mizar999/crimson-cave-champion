import { Visual } from "../ui/visual";
import { Actor, SavingThrowType } from "../actor/actor";
import { BodyType } from "../body-types/body-type";

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
        this.name = params.name || "unknown breed";
        this.visual = params.visual || new Visual('?', "red", "white");
        this.maxHitDice = params.maxHitDice || 1;
        this.armorClass = params.armorClass || 7;
        this.baseSpeed = params.baseSpeed || Actor.defaultSpeed;
        this.skillBonus = params.skillBonus || 0;
        this.savingThrows = params.savingThrows || [];
        this.body = params.body || new BodyType();
    }
}