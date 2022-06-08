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
import { RNG } from "rot-js";

export class Player extends Actor {
    speed: number;
    stats: PlayerStats;
    private command: Command;

    constructor(position: Point) {
        super(ActorType.Player, new Visual("@", "white"));
        this.position = position;
        this.speed = Actor.defaultSpeed;
        this.stats = new PlayerStats();
    }

    static createPlayer(): Player {
        let player: Player = new Player(new Point(0, 0));
        let attributes: number[] = SystemManager.getAttributes(4);

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

    getSpeed(): number {
        return this.speed;
    }

    async takeTurn(game: Game): Promise<Command> {
        this.command = undefined;
        await ServiceLocator.getInputUtility().waitForInput(this.handleInput.bind(this));
        return this.command;
    }

    onBeforeTurn(game: Game): void {
        game.getMessageLog().addMessages(`${this.describe()} ${this.stats.hitPoints}/${this.stats.maxHitPoints} AC ${this.stats.armorClass} STR ${this.stats.strength.value}(${this.stats.strength.getModifier()}) DEX ${this.stats.dexterity.value}(${this.stats.dexterity.getModifier()}) CON ${this.stats.constitution.value}(${this.stats.constitution.getModifier()}) WIS ${this.stats.wisdom.value}(${this.stats.wisdom.getModifier()})`);
    }

    private handleInput(event: KeyboardEvent): boolean {
        let attacks: Attack[] = [];

        let attack = new Attack();
        attack.damage.numberOf = 2;
        attack.damage.sides = 10;
        attack.damage.modifier = 2;
        attack.attackBonus = this.stats.attackBonus + this.stats.strength.getModifier();
        attacks.push(attack);

        attack = new Attack();
        attack.damage = this.stats.frayDie;
        attack.isFrayDie = true;
        attacks.push(attack);
        
        let message = SystemManager.attack(this, this, attacks);
        this.command = new DebugLogCommand(message);
        return this.command !== undefined;
    }
}