import { SystemManager } from "../system/system-manager";
import { Player, PlayerController } from "./player";
import { Creature, CreatureController } from "./creature";
import { Attack } from "../system/attack";
import { BodyData } from "../body/body-data";

export class ActorFactory {
    static createPlayer(): PlayerController {
        let attributes: number[] = SystemManager.getAttributes(4);
        const player = new Player({
            strength: attributes[0],
            dexterity: attributes[1],
            constitution: attributes[2],
            wisdom: attributes[3],
            maxHitPoints: 8 + PlayerController.getAttributeModifier(attributes[2]),
            attackBonus: 1,
            body: new BodyData({
                naturalAttacks: [{ weight: 1, attacks: [new Attack({ damage: { numberOf: 1, sides: 2 } })] }],
                additionalAttacks: [new Attack({ damage: { numberOf: 1, sides: 8 }, isFrayDie: true })]
            })
        });

        return new PlayerController(player);
    }

    static createCreature(): CreatureController {
        const attack = new Attack({ damage: { numberOf: 1, sides: 6 }, attackBonus: 6 });
        const creature = new Creature({
            name: "Kappa",
            maxHitDice: 6,
            body: new BodyData({
                armorClass: 5,
                naturalAttacks: [{ weight: 1, attacks: [attack, attack] }]
            })
        });
        return new CreatureController(creature);
    }
}