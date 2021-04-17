import { LassoSelectionSegmentBounds } from './lasso-selection-segment-bounds';

describe('LassoSelectionSegmentBounds', () => {
    const TOP_LEFT = {
        x: 3,
        y: 6,
    };
    const BOTTOM_RIGHT = {
        x: 7,
        y: 12,
    };

    let bounds: LassoSelectionSegmentBounds;

    beforeEach(() => {
        bounds = new LassoSelectionSegmentBounds(TOP_LEFT, BOTTOM_RIGHT);
    });

    it('If point is inside bounds, it intersects', () => {
        const POINT = { x: 5, y: 7 };
        expect(bounds.pointIntersects(POINT)).toBeTrue();
    });

    it('If point is outside bounds, it does not intersect', () => {
        const POINT = { x: 120, y: 240 };
        expect(bounds.pointIntersects(POINT)).toBeFalse();
    });

    it('If one corner of bounds is in inside of other bounds, they intersect', () => {
        const OTHER_TOP_LEFT = { x: 5, y: 7 };
        const OTHER_BOTTOM_RIGHT = { x: 2048, y: 4096 };
        const otherBounds = new LassoSelectionSegmentBounds(OTHER_TOP_LEFT, OTHER_BOTTOM_RIGHT);

        expect(bounds.intersects(otherBounds)).toBeTrue();
    });

    it('If no corner of bounds is in inside of other bounds, they do not intersect', () => {
        const OTHER_TOP_LEFT = { x: 120, y: 240 };
        const OTHER_BOTTOM_RIGHT = { x: 2048, y: 4096 };
        const otherBounds = new LassoSelectionSegmentBounds(OTHER_TOP_LEFT, OTHER_BOTTOM_RIGHT);

        expect(bounds.intersects(otherBounds)).toBeFalse();
    });
});
