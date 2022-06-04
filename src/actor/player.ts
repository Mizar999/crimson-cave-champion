import { Actor, ActorType } from "./actor";
import { Point } from "../util/point";
import { Visual } from "../ui/visual";
import { ServiceLocator } from "../util/service-locator";
import { Command } from "../command/command";
import { DebugLogCommand } from "../command/debug-log-command";
import { Game } from "../game";

export class Player extends Actor {
    private command: Command;

    constructor(position: Point) {
        super(ActorType.Player, new Visual("@", "white"));
        this.position = position;
    }

    async takeTurn(game: Game): Promise<Command> {
        this.command = undefined;
        await ServiceLocator.getInputUtility().waitForInput(this.handleInput.bind(this));
        return this.command;
    }

    private handleInput(event: KeyboardEvent): boolean {
        this.command = new DebugLogCommand(event.key);
        return this.command !== undefined;
    }
}