import { Scheduler } from "rot-js/lib/index";
import Simple from "rot-js/lib/scheduler/simple";

import { MessageLog } from "./ui/messsage-log";
import { ServiceLocator } from "./util/service-locator";
import { InputUtility } from "./util/input-utility";
import { Player } from "./actor/player";
import { Point } from "./util/point";
import { Actor } from "./actor/actor";
import { Command, CommandResult, CommandResultType } from "./command/command";

export class Game {
    private messageLog: MessageLog;
    private scheduler: Simple;

    constructor() {
        this.initialize();
        this.mainLoop();
    }

    getMessageLog(): MessageLog {
        return this.messageLog;
    }

    private initialize(): void {
        let maxMessages = 5;
        this.messageLog = new MessageLog(document.getElementById("messages"), maxMessages);
        this.messageLog.addMessages(...Array(maxMessages).fill("&nbsp;"));

        ServiceLocator.provideInputUtility(new InputUtility());

        this.scheduler = new Scheduler.Simple();
        this.scheduler.add(new Player(new Point(0, 0)), true);
    }

    private async mainLoop(): Promise<void> {
        let actor: Actor;
        let command: Command;
        let commandResult: CommandResult;
        
        while (true) {
            if (!commandResult || commandResult.result != CommandResultType.Wait) {
                actor = this.scheduler.next();
                if (!actor) {
                    break;
                }
            }

            command = await actor.takeTurn(this);
            commandResult = await command.execute(this);
            if (commandResult.result != CommandResultType.Success && commandResult.message) {
                this.messageLog.addMessages(commandResult.message);
            }
        }
    }

    private async debugInputHandling(): Promise<void> {
        await ServiceLocator.getInputUtility().waitForInput(this.handleInput.bind(this));
    }

    private handleInput(event: KeyboardEvent): boolean {
        this.messageLog.addMessages(event.key);
        return true;
    }
}