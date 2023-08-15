import { DiceValue } from "../util/dice";
import { ArmorPeneration } from "./armor-penetration";
import { Weapon } from "./weapon";

// TODO implement speed for turn order and multiple attacks per round
export class Actor {
    name: string;
    hitPoints: number;
    level: number;
    speed: number;
    armorClass: number;
    attackBonus: number;
    damageBonus: number;
    overpowerDamage: DiceValue;
    attack: DiceValue;
    armorPenetration: ArmorPeneration;

    constructor(params: Partial<Actor> = {}) {
        let defaultWeapon = new Weapon();
        this.name = params.name || "Unknown actor";
        this.hitPoints = params.hitPoints || 1;
        this.level = params.level || 1;
        this.speed = params.speed || 10;
        this.armorClass = params.armorClass || 0;
        this.attackBonus = params.attackBonus || 0;
        this.damageBonus = params.damageBonus || 0;
        this.overpowerDamage = params.overpowerDamage || null;
        this.attack = params.attack || defaultWeapon.attack;
        this.armorPenetration = params.armorPenetration || defaultWeapon.armorPenetration;
    }
}