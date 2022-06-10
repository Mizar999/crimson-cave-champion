import { SystemManager } from "../system/system-manager";
import { Player, PlayerController } from "./player";
import { Creature } from "./creature";
import { Attack } from "../system/attack";
import { BodyData } from "../body/body-data";

export class ActorFactory {
    static createPlayer(): Player {
        let attributes: number[] = SystemManager.getAttributes(4);
        const player = new Player({
            strength: attributes[0],
            dexterity: attributes[1],
            constitution: attributes[2],
            wisdom: attributes[3],
            maxHitPoints: 8 + PlayerController.getAttributeModifier(attributes[2]),
            attackBonus: 1,
            frayDie: { numberOf: 1, sides: 8 },
            body: new BodyData({
                naturalAttacks: [{ weight: 1, attacks: [new Attack({ damage: { numberOf: 1, sides: 2 } })] }]
            })
        });

        return player;
    }

    static createCreature(): Creature {
        const attack = new Attack({ damage: { numberOf: 1, sides: 6 }, attackBonus: 6 });

        return new Creature({
            name: "Kappa",
            maxHitDice: 6,
            body: new BodyData({
                armorClass: 5,
                naturalAttacks: [{ weight: 1, attacks: [attack, attack] }]
            })
        });
    }
}