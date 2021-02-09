export interface Vec2 {
    x: number;
    y: number;
}

export class VectorOperations {
    sub(v1: Vec2, v2: Vec2): Vec2 {
        return { x: v1.x - v2.x, y: v1.y - v2.y };
    }
}
