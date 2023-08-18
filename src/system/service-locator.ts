import { MessageLog } from "../ui/message-log";
import { InputUtility } from "../util/input-utility";
import { Factory } from "../data/factory";

export class ServiceLocator {
    private static messageLog: MessageLog;
    private static inputUtility: InputUtility;
    private static factory: Factory;

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

    static getFactory(): Factory {
        return ServiceLocator.factory;
    }

    static provideFactory(factory: Factory): void {
        ServiceLocator.factory = factory;
    }
}