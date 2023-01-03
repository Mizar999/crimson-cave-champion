import { Actor, ActorController, StatValue, StatValueController } from "./actor";
import { Visual } from "../ui/visual";
import { BodyController, BodyData } from "../body/body-data";
import { Command } from "../command/command";
import { Game } from "../game";
import { ActorManager } from "../system/actor-manager";
import { DebugLogCommand } from "../command/debug-log-command";
import { AttackCommand } from "../command/attack-command";
import { ServiceLocator } from "../system/service-locator";
import { Attack } from "../system/attack";
import { ItemController } from "../item/item";

export class Player extends Actor {
    maxHitPoints: StatValue;
    hitPoints: number;
    level: number;
    xp: number;
    strength: StatValue;
    dexterity: StatValue;
    constitution: StatValue;
    wisdom: StatValue;
    attackBonus: StatValue;
    body: BodyData;

    constructor(params: Partial<Player> = {}) {
        super("player", (params.visual || new Visual("@", "white")), params.speed, params.point);

        this.maxHitPoints = params.maxHitPoints || new StatValue({ baseValue: 1 });
        this.hitPoints = params.hitPoints || StatValueController.GetValue(this.maxHitPoints);
        this.level = params.level || 1;
        this.xp = params.xp || 0;
        this.strength = params.strength || new StatValue({ baseValue: 0 });
        this.dexterity = params.dexterity || new StatValue({ baseValue: 0 });
        this.constitution = params.constitution || new StatValue({ baseValue: 0 });
        this.wisdom = params.wisdom || new StatValue({ baseValue: 0 });
        this.attackBonus = params.attackBonus || new StatValue({ baseValue: 0 });
        this.body = params.body || new BodyData();
    }
}

export class PlayerController extends ActorController {
    private command: Command;

    constructor(public player: Player) {
        super();
    }

    async takeTurn(game: Game): Promise<Command> {
        this.command = undefined;
        await ServiceLocator.getInputUtility().waitForInput(this.handleInput.bind(this));
        return this.command;
    }

    getActor(): Actor {
        return this.player;
    }

    getSpeed(): number {
        return StatValueController.GetValue(this.player.speed);
    }

    getArmorClass(): number {
        let armorClass = BodyController.getArmorClass(this.player.body);

        if (armorClass === undefined) {
            armorClass = this.player.body.armorClass;
        }

        if (armorClass === undefined) {
            armorClass = 9;
        }

        return Math.min(9, armorClass + BodyController.getArmorClassModifier(this.player.body) - PlayerController.getAttributeModifier(this.player.dexterity));
    }

    reapplyModifications() {
        // TODO
        this.resetModifications();
        ItemController.getEquipmentModifications(this.player.body.equipment).forEach(modification => {
            switch (modification.type) {
                case "maxlife":
                    this.player.maxHitPoints.modification += modification.valueModification;
                    this.player.maxHitPoints.factor += modification.factorModification;
                    break;
                case "strength":
                    this.player.strength.modification += modification.valueModification;
                    this.player.strength.factor += modification.factorModification;
                    break;
                case "constitution":
                    this.player.constitution.modification += modification.valueModification;
                    this.player.constitution.factor += modification.factorModification;
                    break;
                case "dexterity":
                    this.player.dexterity.modification += modification.valueModification;
                    this.player.dexterity.factor += modification.factorModification;
                    break;
                case "wisdom":
                    this.player.wisdom.modification += modification.valueModification;
                    this.player.wisdom.factor += modification.factorModification;
                    break;
                // case "armorclass": // TODO
                //     this.player.maxHitPoints.modification += modification.valueModification;
                //     this.player.maxHitPoints.factor += modification.factorModification;
                //     break;
                case "speed":
                    this.player.speed.modification += modification.valueModification;
                    this.player.speed.factor += modification.factorModification;
                    break;
                case "attackbonus":
                    this.player.attackBonus.modification += modification.valueModification;
                    this.player.attackBonus.factor += modification.factorModification;
                    break;
            }
        });
    }

    resetModifications() {
        this.player.maxHitPoints.modification = 0;
        this.player.maxHitPoints.factor = 1;
        this.player.strength.modification = 0;
        this.player.strength.factor = 1;
        this.player.dexterity.modification = 0;
        this.player.dexterity.factor = 1;
        this.player.constitution.modification = 0;
        this.player.constitution.factor = 1;
        this.player.wisdom.modification = 0;
        this.player.wisdom.factor = 1;
        this.player.attackBonus.modification = 0;
        this.player.attackBonus.factor = 1;
        this.player.speed.modification = 0;
        this.player.speed.factor = 1;
    }

    describe(): string {
        return this.player.constructor.name;
    }

    static getAttributeModifier(attribute: StatValue): number {
        const value = StatValueController.GetValue(attribute);

        if (value <= 3) {
            return -3;
        } else if (value <= 5) {
            return -2;
        } else if (value <= 8) {
            return -1;
        } else if (value >= 18) {
            return 3;
        } else if (value >= 16) {
            return 2;
        } else if (value >= 13) {
            return 1;
        }

        return 0;
    }

    private handleInput(event: KeyboardEvent): boolean {
        let creature = ActorManager.getActor((actor) => actor.type == "creature");

        if (creature) {
            let attacks: Attack[] = BodyController.getAttacks(this.player.body);
            this.command = new AttackCommand(this.player, creature, attacks);
        } else {
            this.command = new DebugLogCommand('Could not find creature!');
        }

        return this.command !== undefined;
    }
}