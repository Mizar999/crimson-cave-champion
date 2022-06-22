import { Actor } from "../actor/actor";
import { Creature } from "../actor/creature";
import { Player } from "../actor/player";
import { Equipment } from "../body/body-data";
import { Attack } from "../system/attack";
import { Cloner } from "../util/Cloner";
import { Effect } from "./effect";
import { StatValueModification } from "./modification";

export type ItemType = "weapon" | "armor" | "shield" | "ring" | "amulet" | "potion" | "scroll";

export type ItemFlag = "throwable" | "usable" | "twohanded" | "cursed";

export class Item {
    // Use, throw, effect?
    constructor(public type: ItemType, public name: string, public flags: ItemFlag[] = []) { }
}

export class Weapon extends Item {
    constructor(name: string, public attacks: Attack[] = [], public onAttackEffects: Effect[] = [], public modifications: StatValueModification[] = [], flags: ItemFlag[] = [],) {
        super("weapon", name, flags);
    }
}

export class Armor extends Item {
    constructor(name: string, public armorClass: number = undefined, public modifications: StatValueModification[] = [], flags: ItemFlag[] = []) {
        super("armor", name, flags);
    }
}

export class Shield extends Item {
    // TODO Replace armorClassModifier with modifications
    constructor(name: string, public armorClassModifier: number = 0, public modifications: StatValueModification[] = [], flags: ItemFlag[] = []) {
        super("shield", name, flags);
    }
}

export class ItemController {
    static describe(item: Item): string {
        return item.name;
    }

    static getAttacks(item: Item): Attack[] {
        switch (item.type) {
            case "weapon":
                return (<Weapon>item).attacks;
            default:
                return [];
        }
    }

    static getEquipmentModifications(equipment: Equipment[]): StatValueModification[] {
        return equipment.reduce<StatValueModification[]>((previous, current) => {
            current.items.forEach(item => {
                switch (item.type) {
                    case "weapon":
                        previous.push(...Cloner.clone<StatValueModification[]>((<Weapon>item).modifications)); // TODO Test if value really can't be changed
                        break;
                    case "armor":
                        previous.push(...Cloner.clone<StatValueModification[]>((<Armor>item).modifications));
                        break;
                    case "shield":
                        previous.push(...Cloner.clone<StatValueModification[]>((<Shield>item).modifications));
                        break;
                }
            });

            return previous;
        }, []);
    }

    static getArmorClass(item: Item): number | undefined {
        switch (item.type) {
            case "armor":
                return (<Armor>item).armorClass;
            default:
                return undefined;
        }
    }

    static getArmorClassModifier(item: Item): number {
        switch (item.type) {
            case "shield":
                return (<Shield>item).armorClassModifier;
            default:
                return undefined;
        }
    }

    static use(item: Item): void { }

    static throw(item: Item): void { }
}

// TODO implement classes
// export class Use {
//     prepare: (source: Actor) => boolean; // Item argument?
//     onUse: (source) => boolean;
//     onAfterUse: () => void;

//     use(source: Actor): void {
//         if (this.prepare(source)) {
//             if (this.onUse(source)) {
//                 this.onAfterUse();
//             }
//         }
//     }
// }

// export class Effect { // Status?
//     onStartOfTurn: () => void;
//     onEndOfTurn: () => void;
// }

// export class Throw {
//     hits: (source: Actor) => Entity[];
//     onHit: (source, targets: Entity[]) => void;

//     throw(source: Actor) {
//         const targets = this.hits(source);
//         if (targets) {
//             this.onHit(source, targets);
//         }
//     }
// }

// export class Shot { // extends Throw?
//     hits: (source: Actor) => Entity[];
//     onHit: (source, targets: Entity[]) => void;

//     shoot(source: Actor) {
//         const targets = this.hits(source);
//         if (targets) {
//             this.onHit(source, targets);
//         }
//     }
// }