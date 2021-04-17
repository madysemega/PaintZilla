import { Vec2 } from '@app/app/classes/vec2';
import { LassoSelectionSegmentBounds } from './lasso-selection-segment-bounds';

export class LassoSelectionSegment {
    constructor(public firstVertex: Vec2, public secondVertex: Vec2) {}

    get slope(): number {
        return (this.secondVertex.y - this.firstVertex.y) / (this.secondVertex.x - this.firstVertex.x);
    }

    get intercept(): number {
        return this.firstVertex.y - this.firstVertex.x * this.slope;
    }

    get topLeft(): Vec2 {
        return {
            x: Math.min(this.firstVertex.x, this.secondVertex.x),
            y: Math.min(this.firstVertex.y, this.secondVertex.y),
        };
    }

    get bottomRight(): Vec2 {
        return {
            x: Math.max(this.firstVertex.x, this.secondVertex.x),
            y: Math.max(this.firstVertex.y, this.secondVertex.y),
        };
    }

    intersects(other: LassoSelectionSegment): boolean {
        const thisBounds = new LassoSelectionSegmentBounds(this.topLeft, this.bottomRight);
        const otherBounds = new LassoSelectionSegmentBounds(other.topLeft, other.bottomRight);

        if (!thisBounds.intersects(otherBounds)) return false;

        const intersectX = (other.intercept - this.intercept) / (this.slope - other.slope);
        const intersectY = this.slope * intersectX + this.intercept;
        const intersect = {
            x: intersectX,
            y: intersectY,
        };

        return thisBounds.pointIntersects(intersect) && otherBounds.pointIntersects(intersect);
    }
}
