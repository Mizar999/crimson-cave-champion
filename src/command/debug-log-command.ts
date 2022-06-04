import { Game } from "../game";
import { Command, CommandResult } from "./command";

export class DebugLogCommand extends Command {
    constructor(private message: string) {
        super();
    }

    execute(game: Game): Promise<CommandResult> {
        game.getMessageLog().addMessages(this.message);
        return this.success();
    }
}