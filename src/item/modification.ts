export type ModificationType = "maxlife" | "life" | "strength" | "constitution" | "dexterity" | "wisdom" | "armorclass" | "speed" | "atackbonus";

export class StatValueModification {
    type: ModificationType;
    valueModification: number;
    factorModification: number;

    constructor(params: Partial<StatValueModification> = {}) {
        this.type = params.type || "life";
        this.valueModification = params.valueModification || 0;
        this.factorModification = params.factorModification || 0;
    }
}