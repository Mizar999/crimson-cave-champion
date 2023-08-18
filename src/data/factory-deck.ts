import { RNG } from 'rot-js/lib/index';
import { ItemType, ItemTypeId } from './factory';
import { ServiceLocator } from '../system/service-locator';
import { Actor } from './actor';

export class FactoryDeckManager {
    private decks: { levels: number[], deck: FactoryDeck }[] = [];

    addDeck(levels: number[], deck: FactoryDeck): void {
        if (deck != null && !deck.isEmpty()) {
            this.decks.push({ levels, deck });
        }
    }

    drawActor(level: number): Actor {
        let deck = RNG.getItem<FactoryDeck>(this.decks.filter((value) => value.levels.includes(level) && value.deck.type === 'actor').map((value) => value.deck));
        let actor = deck?.draw() as Actor;
        if (deck?.isEmpty) {
            this.decks = this.decks.filter((value) => !value.deck.isEmpty());
        }
        return actor;
    }
}

export class FactoryDeck {
    constructor(public type: "actor" | ItemTypeId, private ids: string[]) {
        if (ids != null) {
            this.ids = RNG.shuffle<string>(ids);
        }
    }

    isEmpty(): boolean {
        return this.ids == null || this.ids.length == 0;
    }

    draw(): Actor | ItemType {
        return ServiceLocator.getFactory().createFromTypeId(this.type, this.ids.shift()!.toString());
    }

    add(newIds: string[]) {
        this.ids.push(...newIds);
    }
}