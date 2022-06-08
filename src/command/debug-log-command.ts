import { Game } from "../game";
import { ServiceLocator } from "../system/service-locator";
import { Command, CommandResult } from "./command";

export class DebugLogCommand extends Command {
    constructor(private message: string) {
        super();
    }

    execute(game: Game): Promise<CommandResult> {
        ServiceLocator.getMessageLog().addMessages(this.message);
        return this.finished();
    }
}