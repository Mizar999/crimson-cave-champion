export class InputUtility {
    private processInputCallback: (event: KeyboardEvent) => any;
    private resolve: (value?: any) => void;

    waitForInput(handleInput: (event: KeyboardEvent) => boolean): Promise<any> {
        return new Promise(resolve => {
            if (this.processInputCallback !== undefined) {
                this.stopProcessing();
            }

            this.resolve = resolve;
            this.processInputCallback = (event: KeyboardEvent) => this.processInput(event, handleInput);
            window.addEventListener("keydown", this.processInputCallback);
        });
    }

    private processInput(event: KeyboardEvent, handleInput: (event: KeyboardEvent) => boolean): void {
        if (handleInput(event)) {
            this.stopProcessing();
        }
    }

    private stopProcessing(): void {
        window.removeEventListener("keydown", this.processInputCallback);
        this.processInputCallback = undefined;
        this.resolve();
    }
}