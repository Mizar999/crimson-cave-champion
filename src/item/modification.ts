export type ModificationType = "maxlife" | "strength" | "constitution" | "dexterity" | "wisdom" | "armorclass" | "speed" | "attackbonus";

export class StatValueModification {
    type: ModificationType;
    valueModification: number;
    factorModification: number;

    constructor(params: Partial<StatValueModification> = {}) {
        this.type = params.type || "maxlife";
        this.valueModification = params.valueModification || 0;
        this.factorModification = params.factorModification || 0;
    }
}