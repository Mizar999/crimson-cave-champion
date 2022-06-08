import { MessageLog } from "../ui/messsage-log";
import { InputUtility } from "../util/input-utility";

export class ServiceLocator {
    private static inputUtility: InputUtility;
    private static messageLog: MessageLog;

    static getInputUtility(): InputUtility {
        return ServiceLocator.inputUtility;
    }

    static provideInputUtility(inputUtility: InputUtility): void {
        ServiceLocator.inputUtility = inputUtility;
    }

    static getMessageLog(): MessageLog {
        return ServiceLocator.messageLog;
    }

    static provideMessageLog(messageLog: MessageLog): void {
        ServiceLocator.messageLog = messageLog;
    }
}