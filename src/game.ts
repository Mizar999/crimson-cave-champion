import { MessageLog } from "./ui/messsage-log";
import { ServiceLocator } from "./system/service-locator";
import { ActorFactory } from "./actor/actor-factory";
import { InputUtility } from "./util/input-utility";
import { ActorController } from "./actor/actor";
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
        let actorController: ActorController;
        let command: Command;
        let commandResult: CommandResult;

        while (true) {
            if (!commandResult || commandResult.finished) {
                if (actorController) {
                    actorController.onAfterTurn(this);
                }

                actorController = ActorManager.next();

                if (!actorController) {
                    break;
                }
                actorController.onBeforeTurn(this);
            }

            command = await actorController.takeTurn(this);
            commandResult = await command.execute(this);
            if (commandResult.message) {
                ServiceLocator.getMessageLog().addMessages(commandResult.message);
            }
        }
    }
}