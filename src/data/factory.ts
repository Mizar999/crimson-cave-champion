import { Actor } from "./actor";
import { Weapon } from "./weapon";

export class Factory {
    private actors: Actor[];
    private weapons: Weapon[];

    initialize(): void {
        this.actors = [
            new Actor({ name: "Player", hitPoints: 15, armorClass: 12, overpowerDamage: { numberOf: 1, sides: 4 } }),
            new Actor({ name: "Human", hitPoints: 8, armorClass: 10 })
        ];

        this.weapons = [
            new Weapon(),
            new Weapon({ name: "Dagger", attack: { numberOf: 1, sides: 4 }, armorPenetration: { damage: 1, targetArmorClass: 15 } }),
            new Weapon({ name: "Mace", attack: { numberOf: 1, sides: 6 }, armorPenetration: { damage: 1, targetArmorClass: 18 } }),
            new Weapon({ name: "Shortsword", attack: { numberOf: 1, sides: 6 }, armorPenetration: { damage: 2, targetArmorClass: 15 } }),
            new Weapon({ name: "Club", attack: { numberOf: 1, sides: 4 } }),
            new Weapon({ name: "Warhammer", attack: { numberOf: 1, sides: 8 }, armorPenetration: { damage: 1, targetArmorClass: 18 } }),
        ];
    }

    createActor(name: string): Actor {
        let actor = this.actors.find(value => value.name === name);
        if (actor !== undefined) {
            return new Actor(actor);
        }
        return new Actor();
    }

    createWeapon(name: string): Weapon {
        let weapon = this.weapons.find(value => value.name === name);
        if (weapon !== undefined) {
            return new Weapon(weapon);
        }
        return new Weapon();
    }
}