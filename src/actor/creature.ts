import { AttackCommand } from "../command/attack-command";
import { DebugLogCommand } from "../command/debug-log-command";
import { Command } from "../command/command";
import { Game } from "../game";
import { ActorManager } from "../system/actor-manager";
import { Point } from "../util/point";
import { Actor, ActorType } from "./actor";
import { Breed } from "./breed";
import { BodyController } from "../body/body-data";

export class Creature extends Actor {
    hitDice: number;
    speed: number;

    constructor(position: Point, public breed: Breed) {
        super("Creature", breed.visual);
        this.position = position;
        this.hitDice = breed.maxHitDice;
        this.speed = breed.baseSpeed;
    }

    async takeTurn(game: Game): Promise<Command> {
        // TODO add AI
        let player = ActorManager.getActor((actor) => actor.type == "Player");
        if (player) {
            return new AttackCommand(this, player, BodyController.getAttacks(this.breed.body));
        }
        return new DebugLogCommand('Could not find player!');
    }

    getArmorClass(): number {
        return (this.breed.body.armorClass || 0) + this.breed.body.armorClassModifier;
    }

    getSpeed(): number {
        return this.speed;
    }

    describe(): string {
        return this.breed.name;
    }
}