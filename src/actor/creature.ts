import { Point } from "../util/point";
import { Actor, ActorType } from "./actor";
import {Breed} from "./breed";

export class Creature extends Actor {
    hitDice: number;

    constructor(position: Point, public breed: Breed) {
        super(ActorType.Creature, breed.visual);
        this.position = position;
        this.hitDice = breed.maxHitDice;
    }
}