import { Game } from "../game";

export class Command {
    execute(game: Game): Promise<CommandResult> {
        return this.finished();
    }

    finished(reason?: string): Promise<CommandResult> {
        return Promise.resolve(new CommandResult(true, reason));
    }

    again(reason?: string): Promise<CommandResult> {
        return Promise.resolve(new CommandResult(false, reason));
    }

    alternate(game: Game, command: Command): Promise<CommandResult> {
        return command.execute(game);
    }
}

export class CommandResult {
    constructor(public readonly finished: boolean, public readonly message?: string) { }
}
