import { Actor } from "./actor";
import { Weapon } from './weapon';

export type ItemType = Weapon;

export type ItemTypeId = "weapon";

export class Factory {
    private actors: Actor[];
    private weapons: Weapon[];

    initialize(): void {
        this.actors = [
            new Actor({ name: "Player", hitPoints: 15, armorClass: 12, overpowerDamage: { numberOf: 1, sides: 4 } }),
            new Actor({ name: "Human", hitPoints: 8, armorClass: 10 }),
            new Actor({ name: "Cave Slave", hitPoints: 7, armorClass: 13, attackBonus: 2 }),
            new Actor({ name: "Warrior", hitPoints: 9, armorClass: 13, attackBonus: 1, damageBonus: 1 }),
            new Actor({ name: "Great Warrior", hitPoints: 14, armorClass: 14, attackBonus: 3, damageBonus: 1 }),
        ];

        this.weapons = [
            new Weapon(),
            new Weapon({ name: "Dagger", attack: { numberOf: 1, sides: 4 }, armorPenetration: { damage: 1, targetArmorClass: 15 } }),
            new Weapon({ name: "Mace", attack: { numberOf: 1, sides: 6 }, armorPenetration: { damage: 1, targetArmorClass: 18 } }),
            new Weapon({ name: "Shortsword", attack: { numberOf: 1, sides: 6 }, armorPenetration: { damage: 2, targetArmorClass: 15 } }),
            new Weapon({ name: "Club", attack: { numberOf: 1, sides: 4 } }),
            new Weapon({ name: "Warhammer", attack: { numberOf: 1, sides: 8 }, armorPenetration: { damage: 1, targetArmorClass: 18 } }),
            new Weapon({ name: "Spear", attack: { numberOf: 1, sides: 6 }, armorPenetration: { damage: 2, targetArmorClass: 13 } }),
            new Weapon({ name: "Staff", attack: { numberOf: 1, sides: 6 }, armorPenetration: { damage: 1, targetArmorClass: 13 } }),
        ];
    }

    createFromTypeId(type: "actor" | ItemTypeId, id: string): Actor | ItemType {
        switch (type) {
            case "actor":
                return this.createActor(id);
            case "weapon":
                return this.createWeapon(id);
        }
    }

    createActor(name: string): Actor {
        return new Actor(this.createType<Actor>(this.actors, (actor) => actor.name === name));
    }

    createWeapon(name: string): Weapon {
        return new Weapon(this.createType<Weapon>(this.weapons, (weapon) => weapon.name === name));
    }

    private createType<T extends Actor | ItemType>(data: Array<T>, predicate: (value: T) => boolean): T {
        return data.find(predicate);
    }
}