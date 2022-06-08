import { Scheduler } from "rot-js/lib/index";
import Speed from "rot-js/lib/scheduler/speed";

import { MessageLog } from "./ui/messsage-log";
import { ServiceLocator } from "./system/service-locator";
import { ActorFactory } from "./actor/actor-factory";
import { InputUtility } from "./util/input-utility";
import { Actor } from "./actor/actor";
import { Command, CommandResult } from "./command/command";
import { ActorManager } from "./system/actor-manager";

export class Game {
    constructor() {
        this.initialize();
        this.mainLoop();
    }

    private initialize(): void {
        ServiceLocator.provideInputUtility(new InputUtility());

        let maxMessages = 15;
        ServiceLocator.provideMessageLog(new MessageLog(document.getElementById("messages"), maxMessages));
        ServiceLocator.getMessageLog().addMessages(...Array(maxMessages).fill("&nbsp;"));

        ActorManager.initialize();
        ActorManager.add(ActorFactory.createPlayer());
        ActorManager.add(ActorFactory.createCreature());
    }

    private async mainLoop(): Promise<void> {
        let actor: Actor;
        let command: Command;
        let commandResult: CommandResult;

        while (true) {
            if (!commandResult || commandResult.finished) {
                if (actor) {
                    actor.onAfterTurn(this);
                }

                actor = ActorManager.next();

                if (!actor) {
                    break;
                }
                actor.onBeforeTurn(this);
            }

            command = await actor.takeTurn(this);
            commandResult = await command.execute(this);
            if (commandResult.message) {
                ServiceLocator.getMessageLog().addMessages(commandResult.message);
            }
        }
    }
}