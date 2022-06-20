import { Command } from "../command/command";
import { Game } from "../game";
import { Entity } from "../ui/entity";
import { Visual } from "../ui/visual";
import { Point } from "../util/point";

export type ActorType = "player" | "creature";

export type SavingThrowType = "resist" | "dodge" | "dispel";

export class StatValue {
    baseValue: number;
    modification: number;
    factor: number;

    constructor(params: Partial<StatValue> = {}) {
        this.baseValue = params.baseValue || 0;
        this.modification = params.modification || 0;
        this.factor = params.factor || 1;
    }
}

export class StatValueController {
    static GetValue(value: StatValue) {
        return (value.baseValue + value.modification) * value.factor;
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