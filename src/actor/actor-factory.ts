import { SystemManager } from "../system/system-manager";
import { ServiceLocator } from "../system/service-locator";
import { Player } from "./player";
import { Point } from "../util/point";
import { Creature } from "./creature";
import { Breed } from "./breed";
import { BodyType } from "../body-types/body-type";
import { BeastBody } from "../body-types/beast-body";
import { Attack } from "../system/attack";
import { DiceValue } from "../util/dice";

export class ActorFactory {
    static createPlayer(): Player {
        let player: Player = new Player(new Point(0, 0));
        let attributes: number[] = SystemManager.getAttributes(4);

        player.stats.strength.value = attributes[0];
        player.stats.dexterity.value = attributes[1];
        player.stats.constitution.value = attributes[2];
        player.stats.wisdom.value = attributes[3];

        player.stats.maxHitPoints = 8 + player.stats.constitution.getModifier();
        player.stats.hitPoints = player.stats.maxHitPoints;
        player.stats.attackBonus = 1;

        player.stats.frayDie.numberOf = 1;
        player.stats.frayDie.sides = 8;

        ServiceLocator.getMessageLog().addMessages(`${player.describe()} ${player.stats.hitPoints}/${player.stats.maxHitPoints} AC ${player.getArmorClass()} STR ${player.stats.strength.value}(${player.stats.strength.getModifier()}) DEX ${player.stats.dexterity.value}(${player.stats.dexterity.getModifier()}) CON ${player.stats.constitution.value}(${player.stats.constitution.getModifier()}) WIS ${player.stats.wisdom.value}(${player.stats.wisdom.getModifier()})`);

        return player;
    }

    static createCreature(): Creature {
        const attack = new Attack({damage: {numberOf: 1, sides: 6}, attackBonus: 6});

        let breed: Breed = new Breed({
            name: "Kappa",
            maxHitDice: 6,
            armorClass: 5,
            body: new BeastBody([{ weight: 1, attacks: [attack, attack] }])
        });
        return new Creature(new Point(0, 0), breed);
    }
}