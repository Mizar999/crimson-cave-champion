import { Actor, ActorType, SavingThrowType } from "./actor";
import { Point } from "../util/point";
import { Visual } from "../ui/visual";
import { ServiceLocator } from "../util/service-locator";
import { Dice, DiceResult, DiceValue } from "../util/dice";
import { Command } from "../command/command";
import { DebugLogCommand } from "../command/debug-log-command";
import { Game } from "../game";
import { SystemManager } from "../system/system-manager";
import { PlayerStats } from "./player-stats";
import { Attack } from "../system/attack";

export class Player extends Actor {
    stats: PlayerStats;
    private command: Command;

    constructor(position: Point) {
        super(ActorType.Player, new Visual("@", "white"));
        this.position = position;
        this.stats = new PlayerStats();
    }

    static createPlayer(): Player {
        let player: Player = new Player(new Point(0, 0));
        let attributes: number[] = [];

        for (let i = 0; i < 4; ++i) {
            attributes.push(this.resultWithoutLowest(Dice.roll(4, 6)));
        }

        if (Math.max.apply(null, attributes) < 16) {
            attributes[attributes.indexOf(Math.min.apply(null, attributes))] = 16;
        }

        player.stats.strength.value = attributes[0];
        player.stats.dexterity.value = attributes[1];
        player.stats.constitution.value = attributes[2];
        player.stats.wisdom.value = attributes[3];

        player.stats.maxHitPoints = 8 + player.stats.constitution.getModifier();
        player.stats.hitPoints = player.stats.maxHitPoints;
        player.stats.armorClass = Math.min(9, 9 - player.stats.dexterity.getModifier());
        player.stats.attackBonus = 1;

        player.stats.frayDie.numberOf = 1;
        player.stats.frayDie.sides = 8;

        return player;
    }

    private static resultWithoutLowest(result: DiceResult): number {
        let temp: number[] = result.dice.slice();
        temp.splice(temp.indexOf(Math.min.apply(null, temp)), 1);
        let length = temp.length;
        let returnValue = 0;
        while (length--) {
            returnValue += temp[length];
        }
        return returnValue;
    }

    async takeTurn(game: Game): Promise<Command> {
        this.command = undefined;
        await ServiceLocator.getInputUtility().waitForInput(this.handleInput.bind(this));
        return this.command;
    }

    private handleInput(event: KeyboardEvent): boolean {
        let attacks: Attack[] = [];

        let attack = new Attack();
        attack.damage.numberOf = 1;
        attack.damage.sides = 10;
        attack.attackBonus = this.stats.attackBonus + this.stats.strength.getModifier();
        attacks.push(attack);

        attack = new Attack();
        attack.damage = this.stats.frayDie;
        attack.hitsAlways = true;
        attacks.push(attack);
        
        let message = SystemManager.attack(this, this, attacks);
        this.command = new DebugLogCommand(message);
        return this.command !== undefined;
    }
}