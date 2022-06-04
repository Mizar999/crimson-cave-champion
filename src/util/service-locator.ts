import { InputUtility } from "./input-utility";

export class ServiceLocator {
    private static inputUtility: InputUtility;

    static getInputUtility(): InputUtility {
        return ServiceLocator.inputUtility;
    }

    static provideInputUtility(inputUtility: InputUtility): void {
        ServiceLocator.inputUtility = inputUtility;
    }
}