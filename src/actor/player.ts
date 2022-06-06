import { Actor, ActorType, SavingThrowType } from "./actor";
import { Point } from "../util/point";
import { Visual } from "../ui/visual";
import { ServiceLocator } from "../util/service-locator";
import { Dice, DiceResult, DiceValue } from "../util/dice";
import { Command } from "../command/command";
import { DebugLogCommand } from "../command/debug-log-command";
import { Game } from "../game";
import { Combat } from "../system/combat";
import { PlayerStats } from "./player-stats";

export class Player extends Actor {
    stats: PlayerStats;
    private command: Command;

    constructor(position: Point) {
        super(ActorType.Player, new Visual("@", "white"));
        this.position = position;
        this.stats = new PlayerStats();
    }

    savingThrow(source: Actor, savingThrowtype: SavingThrowType): boolean {
        let diceResult = Dice.roll(2, 8).result;
        if (diceResult <= 2) {
            return false;
        } else if (diceResult >= 16) {
            return true;
        }

        let difficulty = 9;
        switch(source.type) {
            case ActorType.Player:
                difficulty += (<Player>source).stats.level;
            // TODO Creature, Trap
        }

        let modifier = this.stats.level;
        switch(savingThrowtype) {
            case SavingThrowType.Resist:
                modifier += this.stats.constitution.getModifier();
            case SavingThrowType.Dodge:
                modifier += this.stats.dexterity.getModifier();
            case SavingThrowType.Dispel:
                modifier += this.stats.wisdom.getModifier();
        }

        return (diceResult + modifier) >= difficulty;
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
            message += `; damage = ${Combat.getDamage(new DiceValue(1, 2)) + Combat.getDamage(this.stats.frayDie)}`;
        }

        this.command = new DebugLogCommand(message);
        return this.command !== undefined;
    }
}