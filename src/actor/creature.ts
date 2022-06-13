import { AttackCommand } from "../command/attack-command";
import { DebugLogCommand } from "../command/debug-log-command";
import { Command } from "../command/command";
import { Game } from "../game";
import { ActorManager } from "../system/actor-manager";
import { Actor, ActorController, SavingThrowType } from "./actor";
import { BodyController, BodyData } from "../body/body-data";
import { Visual } from "../ui/visual";

export class Creature extends Actor {
    name: string;
    maxHitDice: number;
    hitDice: number;
    skillBonus: number;
    savingThrows: SavingThrowType[];
    body: BodyData;

    constructor(params: Partial<Creature> = {}) {
        super("creature", (params.visual || new Visual("?", "red", "white")), params.speed, params.point);

        this.name = params.name || "Unknown Creature";
        this.maxHitDice = params.maxHitDice || 1;
        this.hitDice = params.hitDice || this.maxHitDice;
        this.skillBonus = params.skillBonus || 0;
        this.savingThrows = params.savingThrows || [];
        this.body = params.body || new BodyData();
    }
}

export class CreatureController extends ActorController {
    constructor(public creature: Creature) {
        super();
    }

    async takeTurn(game: Game): Promise<Command> {
        // TODO add AI
        let player = ActorManager.getActor((actor) => actor.type == "player");
        if (player) {
            return new AttackCommand(this.creature, player, BodyController.getAttacks(this.creature.body));
        }
        return new DebugLogCommand('Could not find player!');
    }

    getActor(): Actor {
        return this.creature;
    }

    getArmorClass(): number {
        let armorClass = BodyController.getArmorClass(this.creature.body);

        if (armorClass === undefined) {
            armorClass = this.creature.body.armorClass;
        }

        return (armorClass || 0) + BodyController.getArmorClassModifier(this.creature.body) + this.creature.body.armorClassModifier;
    }

    getSpeed(): number {
        return this.creature.speed;
    }

    describe(): string {
        return this.creature.name;
    }
}