import { Command } from "../command/command";
import { Game } from "../game";
import { Entity } from "../ui/entity";
import { Visual } from "../ui/visual";
import { Point } from "../util/point";

export type ActorType = "Player" | "Creature";

export type SavingThrowType = "Resist" | "Dodge" | "Dispel";

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

    abstract getSpeed(): number;

    abstract getArmorClass(): number;

    abstract describe(): string;
}