import { Game } from "../game";

export class Command {
    execute(game: Game): Promise<CommandResult> {
        return this.success();
    }

    success(): Promise<CommandResult> {
        return Promise.resolve(new CommandResult(CommandResultType.Success));
    }

    fail(reason?: string): Promise<CommandResult> {
        return Promise.resolve(new CommandResult(CommandResultType.Failure, reason));
    }

    wait(reason?: string): Promise<CommandResult> {
        return Promise.resolve(new CommandResult(CommandResultType.Wait, reason));
    }

    alternate(game: Game, command: Command): Promise<CommandResult> {
        return command.execute(game);
    }
}

export const enum CommandResultType {
    Success,
    Failure,
    Wait
}

export class CommandResult {
    constructor(public readonly result: CommandResultType, public readonly message?: string) { }
}
