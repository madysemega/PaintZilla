import { Vec2 } from '@app/app/classes/vec2';

export class LassoSelectionSegmentBounds {
    constructor(public topLeft: Vec2, public bottomRight: Vec2) {}

    pointIntersects(point: Vec2): boolean {
        const intersectsHorizontally = point.x >= this.topLeft.x && point.x <= this.bottomRight.x;
        const intersectsVertically = point.y >= this.topLeft.y && point.y <= this.bottomRight.y;

        return intersectsHorizontally && intersectsVertically;
    }

    intersects(other: LassoSelectionSegmentBounds): boolean {
        const topLeft = other.topLeft;
        const bottomRight = other.bottomRight;
        const topRight = {
            x: bottomRight.x,
            y: topLeft.y,
        };
        const bottomLeft = {
            x: topLeft.x,
            y: bottomRight.y,
        };

        const intersectsLeft = this.pointIntersects(topLeft) || this.pointIntersects(bottomLeft);
        const intersectsRight = this.pointIntersects(topRight) || this.pointIntersects(bottomRight);

        return intersectsLeft || intersectsRight;
    }
}
