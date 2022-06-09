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
import { HumanoidBody } from "../body-types/humanoid-body";
import { DebugLogCommand } from "../command/debug-log-command";

export class Player extends Actor {
    speed: number;
    stats: PlayerStats;
    body: HumanoidBody;

    private command: Command;
    private playerAttacks: Attack[];

    constructor(position: Point) {
        super(ActorType.Player, new Visual("@", "white"));
        this.position = position;
        this.speed = Actor.defaultSpeed;
        this.stats = new PlayerStats();
        this.body = new HumanoidBody();

        this.playerAttacks = [];

        let attack = new Attack();
        attack.damage = this.stats.frayDie;
        attack.isFrayDie = true;
        this.playerAttacks.push(attack);
    }

    getArmorClass(): number {
        let armorClass = this.body.getArmorClass();
        if (!armorClass) {
            armorClass = 9;
        }

        return Math.min(9, armorClass - this.body.getArmorClassModifier() - this.stats.dexterity.getModifier());
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
            let attacks: Attack[] = this.body.getAttacks();
            attacks.push(...this.playerAttacks);
            this.command = new AttackCommand(this, creature, attacks);
        } else {
            this.command = new DebugLogCommand('Could not find creature!');
        }

        return this.command !== undefined;
    }
}