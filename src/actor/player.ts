import { Actor, ActorType } from "./actor";
import { Point } from "../util/point";
import { Visual } from "../ui/visual";
import { ServiceLocator } from "../system/service-locator";
import { Command } from "../command/command";
import { AttackCommand } from "../command/attack-command";
import { Game } from "../game";
import { PlayerStats } from "./player-stats";
import { Attack } from "../system/attack";
import { ActorManager } from "../system/actor-manager";
import { DebugLogCommand } from "../command/debug-log-command";
import { BodyController, BodyData } from "../body/body-data";

export class Player extends Actor {
    speed: number;
    stats: PlayerStats;
    body: BodyData;

    private command: Command;

    constructor(position: Point) {
        super(ActorType.Player, new Visual("@", "white"));
        this.position = position;
        this.speed = Actor.defaultSpeed;
        this.stats = new PlayerStats();
        this.body = new BodyData({
            equipment: [
                {type: "Hand", items: [], maximum: 2},
                {type: "Finger", items: [], maximum: 2},
                {type: "Body", items: [], maximum: 1},
                {type: "Neck", items: [], maximum: 1}
            ],
            naturalAttacks: [{weight: 1, attacks: [new Attack({damage: {numberOf: 1, sides: 2}})]}],
            additionalAttacks: [new Attack({damage: this.stats.frayDie, isFrayDie: true})]
        });
    }

    getArmorClass(): number {
        let armorClass = this.body.armorClass;
        if (!armorClass) {
            armorClass = 9;
        }

        return Math.min(9, armorClass - this.body.armorClassModifier - this.stats.dexterity.getModifier());
    }

    getSpeed(): number {
        return this.speed;
    }

    async takeTurn(game: Game): Promise<Command> {
        this.command = undefined;
        await ServiceLocator.getInputUtility().waitForInput(this.handleInput.bind(this));
        return this.command;
    }

    private handleInput(event: KeyboardEvent): boolean {
        let creature = ActorManager.getActor((actor) => actor.type == ActorType.Creature);

        if (creature) {
            let attacks: Attack[] = BodyController.getAttacks(this.body);
            this.command = new AttackCommand(this, creature, attacks);
        } else {
            this.command = new DebugLogCommand('Could not find creature!');
        }

        return this.command !== undefined;
    }
}