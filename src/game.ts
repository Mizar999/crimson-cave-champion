import { ServiceLocator } from "./system/service-locator";
import { MessageLog } from "./ui/message-log";
import { InputUtility } from "./util/input-utility";
import { Dice, DiceResult, DiceValue } from "./util/dice";

export class Game {
    private exitGame: boolean;

    constructor() {
        this.initialize();
        this.mainLoop();
    }

    private initialize(): void {
        let maxMessages = 15;
        ServiceLocator.provideMessageLog(new MessageLog(document.getElementById("messages"), maxMessages));
        ServiceLocator.getMessageLog().addMessages(...Array(maxMessages).fill("&nbsp;"));

        ServiceLocator.provideInputUtility(new InputUtility());
    }

    private async mainLoop(): Promise<void> {
        while (!this.exitGame) {
            await ServiceLocator.getInputUtility().waitForInput(this.handleInput.bind(this));
        }
    }

    private handleInput(event: KeyboardEvent): boolean {
        if (event.key === "Escape") {
            this.exitGame = true;
            ServiceLocator.getMessageLog().addMessages("Game ended!");
        } else {
            ServiceLocator.getMessageLog().addMessages(JSON.stringify(Dice.roll({numberOf: 10, sides: 6})));
        }

        return true;
    }
}