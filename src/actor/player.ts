import { Actor } from "./actor";
import { Visual } from "../ui/visual";
import { BodyController, BodyData } from "../body/body-data";
import { DiceValue } from "../util/dice";
import { Command } from "../command/command";
import { Game } from "../game";
import { ActorManager } from "../system/actor-manager";
import { DebugLogCommand } from "../command/debug-log-command";
import { AttackCommand } from "../command/attack-command";
import { ServiceLocator } from "../system/service-locator";
import { Attack } from "../system/attack";

export class Player extends Actor {
    maxHitPoints: number;
    hitPoints: number;
    level: number;
    xp: number;
    strength: number;
    dexterity: number;
    constitution: number;
    wisdom: number;
    attackBonus: number;
    frayDie: DiceValue;
    body: BodyData;

    constructor(params: Partial<Player> = {}) {
        super("Player", (params.visual || new Visual("@", "white")), params.speed, params.point);

        this.maxHitPoints = params.maxHitPoints || 1;
        this.hitPoints = params.hitPoints || this.maxHitPoints;
        this.level = params.level || 1;
        this.xp = params.xp || 0;
        this.strength = params.strength || 0;
        this.dexterity = params.dexterity || 0;
        this.constitution = params.constitution || 0;
        this.wisdom = params.wisdom || 0;
        this.attackBonus = params.attackBonus || 0;
        this.frayDie = params.frayDie || { numberOf: 0, sides: 1 };
        this.body = params.body || new BodyData();
    }
}

export class PlayerController {
    private static player: Player;
    private static command: Command;

    static async takeTurn(game: Game, actor: Player): Promise<Command> {
        this.command = undefined;
        await ServiceLocator.getInputUtility().waitForInput(this.handleInput.bind(this));
        return this.command;
    }

    private static handleInput(event: KeyboardEvent): boolean {
        let creature = ActorManager.getActor((actor) => actor.type == "Creature");

        if (creature) {
            let attacks: Attack[] = BodyController.getAttacks(this.player.body);
            this.command = new AttackCommand(this.player, creature, attacks);
        } else {
            this.command = new DebugLogCommand('Could not find creature!');
        }

        return this.command !== undefined;
    }
}