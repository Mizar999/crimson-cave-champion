import { Command } from "../command/command";
import { Game } from "../game";
import { Entity } from "../ui/entity";
import { Visual } from "../ui/visual";
import { Point } from "../util/point";

export type ActorType = "player" | "creature";

export type SavingThrowType = "resist" | "dodge" | "dispel";

export class StatValue {
    baseMaxValue: number;
    maxValueModification: number;
    maxValueFactor: number;
    baseCurrentValue: number;
    currentValueModification: number;
    currentValueFactor: number;

    constructor(params: Partial<StatValue> = {}) {
        this.baseMaxValue = params.baseMaxValue || 0;
        this.maxValueModification = params.maxValueModification || 0;
        this.maxValueFactor = params.maxValueFactor || 0;
        this.baseCurrentValue = params.baseCurrentValue || 0;
        this.currentValueModification = params.currentValueModification || 0;
        this.currentValueFactor = params.currentValueFactor || 0;
    }
}

export abstract class Actor extends Entity {
    constructor(public type: ActorType, public visual: Visual, public speed: number = ActorController.defaultSpeed, public point: Point = { x: 0, y: 0 }) {
        super(visual, "BlocksMovement");
    }
}

export abstract class ActorController {
    static readonly defaultSpeed: number = 10;

    async takeTurn(game: Game): Promise<Command> {
        return new Command();
    }

    onBeforeTurn(game: Game): void { }

    onAfterTurn(game: Game): void { }

    abstract getActor(): Actor;

    abstract getSpeed(): number;

    abstract getArmorClass(): number;

    abstract describe(): string;
}