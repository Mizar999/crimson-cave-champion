import { Actor, ActorController } from "./actor";
import { Visual } from "../ui/visual";
import { BodyController, BodyData } from "../body/body-data";
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
    body: BodyData;

    constructor(params: Partial<Player> = {}) {
        super("player", (params.visual || new Visual("@", "white")), params.speed, params.point);

        this.maxHitPoints = params.maxHitPoints || 1;
        this.hitPoints = params.hitPoints || this.maxHitPoints;
        this.level = params.level || 1;
        this.xp = params.xp || 0;
        this.strength = params.strength || 0;
        this.dexterity = params.dexterity || 0;
        this.constitution = params.constitution || 0;
        this.wisdom = params.wisdom || 0;
        this.attackBonus = params.attackBonus || 0;
        this.body = params.body || new BodyData();
    }
}

export class PlayerController extends ActorController {
    private command: Command;

    constructor(public player: Player) {
        super();
    }

    async takeTurn(game: Game): Promise<Command> {
        this.command = undefined;
        await ServiceLocator.getInputUtility().waitForInput(this.handleInput.bind(this));
        return this.command;
    }

    getActor(): Actor {
        return this.player;
    }

    getSpeed(): number {
        return this.player.speed;
    }

    getArmorClass(): number {
        let armorClass = BodyController.getArmorClass(this.player.body);

        if (armorClass === undefined) {
            armorClass = this.player.body.armorClass;
        }

        if (armorClass === undefined) {
            armorClass = 9;
        }

        return Math.min(9, armorClass + BodyController.getArmorClassModifier(this.player.body) - PlayerController.getAttributeModifier(this.player.dexterity));
    }

    describe(): string {
        return this.player.constructor.name;
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

    private handleInput(event: KeyboardEvent): boolean {
        let creature = ActorManager.getActor((actor) => actor.type == "creature");

        if (creature) {
            let attacks: Attack[] = BodyController.getAttacks(this.player.body);
            this.command = new AttackCommand(this.player, creature, attacks);
        } else {
            this.command = new DebugLogCommand('Could not find creature!');
        }

        return this.command !== undefined;
    }
}