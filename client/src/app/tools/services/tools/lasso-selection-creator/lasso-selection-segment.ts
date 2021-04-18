import { Vec2 } from '@app/app/classes/vec2';
import * as Constants from './lasso-selection-creator.constants';

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
        const areParallel = this.slope === other.slope;
        if (areParallel) return this.evaluateColinearIntersection(this, other);

        const isOtherVertical = Math.abs(other.firstVertex.x - other.secondVertex.x) <= Constants.EPSILON;
        if (isOtherVertical) return this.evaluateVerticalIntersection(other, this);

        const intersectX = (other.intercept - this.intercept) / (this.slope - other.slope);
        const intersectsInThisSegment = this.isPointInSegmentHorizontally({ x: intersectX } as Vec2, this);
        const intersectsInOtherSegment = this.isPointInSegmentHorizontally({ x: intersectX } as Vec2, other);

        return intersectsInThisSegment && intersectsInOtherSegment;
    }

    private isPointInSegmentHorizontally(point: Vec2, segment: LassoSelectionSegment): boolean {
        return point.x > segment.topLeft.x + Constants.EPSILON && point.x < segment.bottomRight.x - Constants.EPSILON;
    }

    private evaluateColinearIntersection(firstSegment: LassoSelectionSegment, secondSegment: LassoSelectionSegment): boolean {
        const haveSameIntercept = firstSegment.intercept === secondSegment.intercept;
        const thisOverlapsOther =
            this.isPointInSegmentHorizontally(firstSegment.topLeft, secondSegment) ||
            this.isPointInSegmentHorizontally(firstSegment.bottomRight, secondSegment);
        const otherOverlapsThis =
            this.isPointInSegmentHorizontally(secondSegment.topLeft, firstSegment) ||
            this.isPointInSegmentHorizontally(secondSegment.bottomRight, firstSegment);

        return haveSameIntercept && (thisOverlapsOther || otherOverlapsThis);
    }

    private evaluateVerticalIntersection(vertical: LassoSelectionSegment, other: LassoSelectionSegment): boolean {
        const x = vertical.firstVertex.x;
        const y = x * other.slope + other.intercept;
        const intersectsX = x > other.topLeft.x + Constants.EPSILON && x < other.bottomRight.x - Constants.EPSILON;
        const intersectsY = y > vertical.topLeft.y + Constants.EPSILON && y < vertical.bottomRight.y - Constants.EPSILON;
        return intersectsX && intersectsY;
    }
}
