import { Scheduler } from "rot-js/lib/index";
import Speed from "rot-js/lib/scheduler/speed";
import { Actor, ActorType } from "../actor/actor";
import { Creature } from "../actor/creature";
import { Player } from "../actor/player";

export class ActorManager {
    private static scheduler: Speed;
    private static actors: Actor[];

    static initialize(): void {
        ActorManager.scheduler = new Scheduler.Speed();
        ActorManager.actors = [];
    }

    static add(actor: Actor, repeat: boolean = true): void {
        ActorManager.scheduler.add(actor, repeat);
        ActorManager.actors.push(actor);
    }

    static next(): Actor {
        return ActorManager.scheduler.next();
    }

    static getActor(type: ActorType): Actor {
        for(let actor of ActorManager.actors) {
            if (actor.type == type) {
                return actor;
            }
        }

        return undefined;
    }
}