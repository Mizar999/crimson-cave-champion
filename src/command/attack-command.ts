import { Actor } from "../actor/actor";
import { Game } from "../game";
import { Attack } from "../system/attack";
import { SystemManager } from "../system/system-manager";
import { Command, CommandResult } from "./command";

export class AttackCommand extends Command {
    constructor(private attacker: Actor, private blocker: Actor, private attacks: Attack[]) {
        super();
    }

    execute(game: Game): Promise<CommandResult> {
        console.log(this.attacks);
        SystemManager.attack(this.attacker, this.blocker, this.attacks);
        return this.finished();
    }
}