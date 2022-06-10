import { Scheduler } from "rot-js/lib/index";
import Speed from "rot-js/lib/scheduler/speed";
import { Actor, ActorController, ActorType } from "../actor/actor";

export class ActorManager {
    private static scheduler: Speed;
    private static actorControllers: ActorController[];

    static initialize(): void {
        ActorManager.scheduler = new Scheduler.Speed();
        ActorManager.actorControllers = [];
    }

    static add(controller: ActorController, repeat: boolean = true): void {
        ActorManager.scheduler.add(controller, repeat);
        ActorManager.actorControllers.push(controller);
    }

    static next(): Actor {
        return ActorManager.scheduler.next();
    }

    static getActor(filter: (actor: Actor) => boolean): Actor {
        for(let controller of ActorManager.actorControllers) {
            if (filter(controller.actor)) {
                return controller.actor;
            }
        }

        return undefined;
    }

    static getActors(filter: (actor: Actor) => boolean): Actor[] {
        let result: Actor[] = [];
        for(let controller of ActorManager.actorControllers) {
            if (filter(controller.actor)) {
                result.push(controller.actor);
            }
        }

        return result;
    }
}