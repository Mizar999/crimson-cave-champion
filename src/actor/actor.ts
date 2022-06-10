import { Entity } from "../ui/entity";
import { Visual } from "../ui/visual";
import { Point } from "../util/point";
import { Command } from "../command/command";
import { Game } from "../game";

export const enum ActorType {
    Player,
    Creature
}

export const enum SavingThrowType {
    Resist,
    Dodge,
    Dispel
}

export abstract class Actor extends Entity {
    position: Point;
    static readonly defaultSpeed: number = 10;

    constructor(public readonly type: ActorType, visual: Visual) {
        super(visual, "BlocksMovement");
    }

    takeTurn(game: Game): Promise<Command> {
        return Promise.resolve(new Command());
    }

    onBeforeTurn(game: Game): void {
    }

    onAfterTurn(game: Game): void {
    }

    abstract getArmorClass(): number;

    getSpeed(): number {
        return Actor.defaultSpeed;
    }

    describe(): string {
        return this.constructor.name;
    }
}