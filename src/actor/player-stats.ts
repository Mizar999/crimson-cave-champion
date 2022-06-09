import { DiceValue } from "../util/dice";

export class PlayerStats {
    strength: Attribute;
    dexterity: Attribute;
    constitution: Attribute;
    wisdom: Attribute;

    level: number;
    xp: number;

    attackBonus: number;
    hitPoints: number;
    frayDie: DiceValue;

    constructor(public maxHitPoints: number = 0) {
        this.hitPoints = maxHitPoints;
        this.level = 1;

        this.strength = new Attribute();
        this.dexterity = new Attribute();
        this.constitution = new Attribute();
        this.wisdom = new Attribute();

        this.frayDie = {numberOf: 0, sides: 1};
    }
}

export class Attribute {
    value: number;

    getModifier(): number {
        if (this.value <= 3) {
            return -3;
        } else if (this.value <= 5) {
            return -2;
        } else if (this.value <= 8) {
            return -1;
        } else if (this.value >= 18) {
            return 3;
        } else if (this.value >= 16) {
            return 2;
        } else if (this.value >= 13) {
            return 1;
        }

        return 0;
    }
}