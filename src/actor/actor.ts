import { Command } from "../command/command";
import { Game } from "../game";
import { Entity } from "../ui/entity";
import { Visual } from "../ui/visual";
import { Point } from "../util/point";
import { Player, PlayerController } from "./player";

export type ActorType = "Player" | "Creature";

export type SavingThrowType = "Resist" | "Dodge" | "Dispel";

export abstract class Actor extends Entity {
    constructor(public type: ActorType, public visual: Visual, public speed: number = ActorController.defaultSpeed, public point: Point = { x: 0, y: 0 }) {
        super(visual, "BlocksMovement");
    }
}

export class ActorController {
    static readonly defaultSpeed: number = 10;

    constructor(public actor: Actor) { }

    getSpeed(): number {
        return this.actor.speed;
    }

    getArmorClass(): number {
        switch (this.actor.type) {
            case "Player":
                const player = <Player>this.actor;
                let armorClass = player.body.armorClass;
                if (!armorClass) {
                    armorClass = 9;
                }

                return Math.min(9, armorClass - player.body.armorClassModifier - ActorController.getAttributeModifier(player.dexterity));
        }
    }

    async takeTurn(game: Game): Promise<Command> {
        switch (this.actor.type) {
            case "Player":
                return PlayerController.takeTurn(game, <Player>this.actor);
        }
    }

    describe(): string {
        switch (this.actor.type) {
            case "Player":
                return this.actor.constructor.name;
        }
    }

    static getAttributeModifier(attribute: number): number {
        if (attribute <= 3) {
            return -3;
        } else if (attribute <= 5) {
            return -2;
        } else if (attribute <= 8) {
            return -1;
        } else if (attribute >= 18) {
            return 3;
        } else if (attribute >= 16) {
            return 2;
        } else if (attribute >= 13) {
            return 1;
        }

        return 0;
    }
}