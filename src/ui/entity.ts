import {Visual} from "./visual";

export type BlockType = "BlocksNone" | "BlocksMovement";

export class Entity {
    constructor(public readonly visual: Visual, public blocks: BlockType = "BlocksNone") { }
}