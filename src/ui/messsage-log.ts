export class MessageLog {
    constructor(private node: HTMLElement, private maxMessages: number) { }

    addMessages(...messages: string[]): void {
        let element: any;
        for (let message of messages) {
            element = document.createElement("div");
            element.innerHTML = message;
            this.node.insertBefore(element, this.node.firstChild);
        }

        while (this.node.childNodes.length > this.maxMessages) {
            this.node.removeChild(this.node.lastChild);
        }
    }

    clear(): void {
        while (this.node.childNodes.length > 0) {
            this.node.removeChild(this.node.lastChild);
        }
    }
}