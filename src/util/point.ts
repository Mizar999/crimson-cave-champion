export class Point {
    constructor(public x: number, public y: number) { }

    toKey(): string {
        return this.x + "," + this.y;
    }

    equals(point: Point): boolean {
        return this.x == point.x && this.y == point.y;
    }

    plus(point: Point): Point {
        this.x += point.x;
        this.y += point.y;
        return this;
    }

    minus(point: Point): Point {
        this.x -= point.x;
        this.y -= point.y;
        return this;
    }

    toString(): string {
        return `[${this.x}, ${this.y}]`;
    }

    static fromKey(key: string): Point {
        let parts = key.split(",");
        return new Point(parseInt(parts[0]), parseInt(parts[1]));
    }
}