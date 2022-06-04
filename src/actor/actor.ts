import { Entity } from "../ui/entity";
import { Visual } from "../ui/visual";
import { BlockType } from "../ui/map/block-type";
import { Point } from "../util/point";
import { Command } from "../command/command";
import { Game } from "../game";

export const enum ActorType {
    Player,
    Creature
}

export abstract class Actor extends Entity {
    position: Point;

    constructor(public readonly type: ActorType, visual: Visual) {
        super(visual, BlockType.BlocksMovement);
    }

    takeTurn(game: Game): Promise<Command> {
        return Promise.resolve(new Command());
    }

    describe(): string {
        return this.constructor.name;
    }
}