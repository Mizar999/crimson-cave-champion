import { Attack } from "../system/attack";
import { Actor } from "../actor/actor";
import { Entity } from "../ui/entity";

export const enum SlotType {
    None,
    MainHand,
    OffHand,
    TwoHand,
    Armor,
    Ring
}

export class Item {
    private name: string;
    private slot: SlotType;
    private attacks: Attack[];
    private armorClass: number;
    private armorClassModifier: number;
    private weight: number;
    private throwRange: number;
    // Use, throw, effect?
}

// TODO implement classes
export class Use {
    prepare: (source: Actor) => boolean; // Item argument?
    onUse: (source) => boolean;
    onAfterUse: () => void;

    use(source: Actor): void {
        if (this.prepare(source)) {
            if (this.onUse(source)) {
                this.onAfterUse();
            }
        }
    }
}

export class Effect { // Status?
    onStartOfTurn: () => void;
    onEndOfTurn: () => void;
}

export class Throw {
    hits: (source: Actor) => Entity[];
    onHit: (source, targets: Entity[]) => void;

    throw(source: Actor) {
        const targets = this.hits(source);
        if (targets) {
            this.onHit(source, targets);
        }
    }   
}

export class Shot { // extends Throw?
    hits: (source: Actor) => Entity[];
    onHit: (source, targets: Entity[]) => void;

    shoot(source: Actor) {
        const targets = this.hits(source);
        if (targets) {
            this.onHit(source, targets);
        }
    }
}