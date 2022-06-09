export class Point {
    constructor(public x: number, public y: number) { }
}

export class PointUtil {
    static toKey(point: Point): string {
        return point.x + "," + point.y;
    }

    static equals(left: Point, right: Point): boolean {
        return left.x == right.x && left.y == right.y;
    }

    static plus(left: Point, right: Point): Point {
        left.x += right.x;
        left.y += right.y;
        return left;
    }

    static minus(left: Point, right: Point): Point {
        left.x -= right.x;
        left.y -= right.y;
        return left;
    }

    static toString(point: Point): string {
        return `[${point.x}, ${point.y}]`;
    }

    static fromKey(key: string): Point {
        let parts = key.split(",");
        return { x: parseInt(parts[0]), y: parseInt(parts[1]) };
    }
}