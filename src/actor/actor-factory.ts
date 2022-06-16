import { SystemManager } from "../system/system-manager";
import { Player, PlayerController } from "./player";
import { Creature, CreatureController } from "./creature";
import { Attack } from "../system/attack";
import { BodyController, BodyData, Equipment, HumanoidEquipment } from "../body/body-data";
import { ServiceLocator } from "../system/service-locator";
import { Armor, Shield, Weapon } from "../item/item";
import {Cloner} from "../util/Cloner";

export class ActorFactory {
    static createPlayer(): PlayerController {
        const attributes: number[] = SystemManager.getAttributes(4);

        const player = new Player({
            strength: attributes[0],
            dexterity: attributes[1],
            constitution: attributes[2],
            wisdom: attributes[3],
            maxHitPoints: 8 + PlayerController.getAttributeModifier(attributes[2]),
            attackBonus: 1,
            body: new BodyData({
                equipment: Cloner.clone(HumanoidEquipment),
                naturalAttacks: [{ weight: 1, attacks: [new Attack({ damage: { numberOf: 1, sides: 2 } })] }],
                additionalAttacks: [new Attack({ damage: { numberOf: 1, sides: 8 }, flags: ["fraydie"] })]
            })
        });

        BodyController.equip(player.body, this.createWeapon());
        BodyController.equip(player.body, this.createArmor());
        BodyController.equip(player.body, this.createShield());

        const controller = new PlayerController(player);
        ServiceLocator.getMessageLog().addMessages(`HP ${player.hitPoints}/${player.maxHitPoints} AC ${controller.getArmorClass()} STR ${player.strength}(${PlayerController.getAttributeModifier(player.strength)}) DEX ${player.dexterity}(${PlayerController.getAttributeModifier(player.dexterity)}) CON ${player.constitution}(${PlayerController.getAttributeModifier(player.constitution)}) WIS ${player.wisdom}(${PlayerController.getAttributeModifier(player.wisdom)})`);
        return controller;
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

    static createWeapon(): Weapon {
        return new Weapon("Sword", [new Attack({ damage: { numberOf: 1, sides: 8 } })]);
    }

    static createArmor(): Armor {
        return new Armor("Scale Armor", 6);
    }

    static createShield(): Shield {
        return new Shield("Buckler", -1);
    }
}