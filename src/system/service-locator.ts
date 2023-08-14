import { MessageLog } from "../ui/message-log";
import { InputUtility } from "../util/input-utility";

export class ServiceLocator {
    private static messageLog: MessageLog;
    private static inputUtility: InputUtility;

    static getMessageLog(): MessageLog {
        return ServiceLocator.messageLog;
    }

    static provideMessageLog(messageLog: MessageLog): void {
        ServiceLocator.messageLog = messageLog;
    }

    static getInputUtility(): InputUtility {
        return ServiceLocator.inputUtility;
    }

    static provideInputUtility(inputUtility: InputUtility): void {
        ServiceLocator.inputUtility = inputUtility;
    }
}