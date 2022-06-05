import { Actor, ActorType } from "./actor";
import { Point } from "../util/point";
import { Visual } from "../ui/visual";
import { ServiceLocator } from "../util/service-locator";
import { Dice, DiceResult, DiceValue } from "../util/dice";
import { Command } from "../command/command";
import { DebugLogCommand } from "../command/debug-log-command";
import { Game } from "../game";
import { PlayerStats } from "./player-stats";

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
        player.stats.armorClass = Math.max(9, 9 + player.stats.dexterity.getModifier());
        player.stats.attackBonus = 1;

        player.stats.frayDie.numberOf = 1;
        player.stats.frayDie.sides = 8;

        return player;
    }

    static getDamage(attacks: DiceValue[]): number {
        let damage: number = 0;
        attacks.forEach(attack => {
            attack.roll().dice.forEach(value => {
                if (value >= 10) {
                    damage += 4;
                } else if (value >= 6) {
                    damage += 2;
                } else if (value >= 2) {
                    damage += 1;
                }
            });
        });
        return damage;
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
        let enemyAC: number = 9;
        let diceResult = Dice.roll(1, 20).result;
        let attackResult = diceResult + this.stats.attackBonus + this.stats.strength.getModifier() + enemyAC;
        let message = `${this.describe()} attacks [${diceResult} + ${this.stats.attackBonus} + ${this.stats.strength.getModifier()} + ${enemyAC}] = ${attackResult}`;
        if (diceResult == 1 || (diceResult != 20 && attackResult < 20)) {
            message += ' miss';
        } else {
            let attacks: DiceValue[] = [];
            attacks.push(new DiceValue(1, 2));
            attacks.push(this.stats.frayDie);
            message += `; damage = ${Player.getDamage(attacks)}`;
        }

        this.command = new DebugLogCommand(message);
        return this.command !== undefined;
    }
}