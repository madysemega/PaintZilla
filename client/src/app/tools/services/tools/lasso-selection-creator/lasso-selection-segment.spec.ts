import { LassoSelectionSegment } from './lasso-selection-segment';
import { LassoSelectionSegmentBounds } from './lasso-selection-segment-bounds';

describe('LassoSelectionSegment', () => {
    const DEFAULT_FIRST_VERTEX = { x: 6, y: 3 };
    const DEFAULT_SECOND_VERTEX = { x: 3, y: 6 };

    let segment: LassoSelectionSegment;

    beforeEach(() => {
        segment = new LassoSelectionSegment(DEFAULT_FIRST_VERTEX, DEFAULT_SECOND_VERTEX);
    });

    it('For vertices: { (0, 0), (3, 3) }, slope should be 1', () => {
        const EXPECTED_SLOPE = 1;
        const FIRST_VERTEX = { x: 0, y: 0 };
        const SECOND_VERTEX = { x: 3, y: 3 };

        segment.firstVertex = FIRST_VERTEX;
        segment.secondVertex = SECOND_VERTEX;

        expect(segment.slope).toEqual(EXPECTED_SLOPE);
    });

    it('For vertices: { (3, 3), (0, 0) }, slope should be 1', () => {
        const EXPECTED_SLOPE = 1;
        const FIRST_VERTEX = { x: 3, y: 3 };
        const SECOND_VERTEX = { x: 0, y: 0 };

        segment.firstVertex = FIRST_VERTEX;
        segment.secondVertex = SECOND_VERTEX;

        expect(segment.slope).toEqual(EXPECTED_SLOPE);
    });

    it('For vertices: { (0, 3), (3, 0) }, slope should be -1', () => {
        const EXPECTED_SLOPE = -1;
        const FIRST_VERTEX = { x: 0, y: 3 };
        const SECOND_VERTEX = { x: 3, y: 0 };

        segment.firstVertex = FIRST_VERTEX;
        segment.secondVertex = SECOND_VERTEX;

        expect(segment.slope).toEqual(EXPECTED_SLOPE);
    });

    it('For vertices: { (3, 0), (0, 3) }, slope should be -1', () => {
        const EXPECTED_SLOPE = -1;
        const FIRST_VERTEX = { x: 3, y: 0 };
        const SECOND_VERTEX = { x: 0, y: 3 };

        segment.firstVertex = FIRST_VERTEX;
        segment.secondVertex = SECOND_VERTEX;

        expect(segment.slope).toEqual(EXPECTED_SLOPE);
    });

    it('For vertices: { (0, 0), (6, 3) }, slope should be 0.5', () => {
        const EXPECTED_SLOPE = 0.5;
        const FIRST_VERTEX = { x: 0, y: 0 };
        const SECOND_VERTEX = { x: 6, y: 3 };

        segment.firstVertex = FIRST_VERTEX;
        segment.secondVertex = SECOND_VERTEX;

        expect(segment.slope).toEqual(EXPECTED_SLOPE);
    });

    it('For vertices: { (0, 0), (3, 6) }, slope should be 2', () => {
        const EXPECTED_SLOPE = 2;
        const FIRST_VERTEX = { x: 0, y: 0 };
        const SECOND_VERTEX = { x: 3, y: 6 };

        segment.firstVertex = FIRST_VERTEX;
        segment.secondVertex = SECOND_VERTEX;

        expect(segment.slope).toEqual(EXPECTED_SLOPE);
    });

    it('For vertices: { (0, 0), (3, 3) }, intercept should be 0', () => {
        const EXPECTED_INTERCEPT = 0;
        const FIRST_VERTEX = { x: 0, y: 0 };
        const SECOND_VERTEX = { x: 3, y: 3 };

        segment.firstVertex = FIRST_VERTEX;
        segment.secondVertex = SECOND_VERTEX;

        expect(segment.intercept).toEqual(EXPECTED_INTERCEPT);
    });

    it('For vertices: { (3, 3), (0, 0) }, intercept should be 0', () => {
        const EXPECTED_INTERCEPT = 0;
        const FIRST_VERTEX = { x: 3, y: 3 };
        const SECOND_VERTEX = { x: 0, y: 0 };

        segment.firstVertex = FIRST_VERTEX;
        segment.secondVertex = SECOND_VERTEX;

        expect(segment.intercept).toEqual(EXPECTED_INTERCEPT);
    });

    it('For vertices: { (0, 3), (3, 0) }, intercept should be 3', () => {
        const EXPECTED_INTERCEPT = 3;
        const FIRST_VERTEX = { x: 0, y: 3 };
        const SECOND_VERTEX = { x: 3, y: 0 };

        segment.firstVertex = FIRST_VERTEX;
        segment.secondVertex = SECOND_VERTEX;

        expect(segment.intercept).toEqual(EXPECTED_INTERCEPT);
    });

    it('For vertices: { (3, 0), (0, 3) }, intercept should be 3', () => {
        const EXPECTED_INTERCEPT = 3;
        const FIRST_VERTEX = { x: 3, y: 0 };
        const SECOND_VERTEX = { x: 0, y: 3 };

        segment.firstVertex = FIRST_VERTEX;
        segment.secondVertex = SECOND_VERTEX;

        expect(segment.intercept).toEqual(EXPECTED_INTERCEPT);
    });

    it('For vertices: { (0, 0), (6, 3) }, intercept should be 0', () => {
        const EXPECTED_INTERCEPT = 0;
        const FIRST_VERTEX = { x: 0, y: 0 };
        const SECOND_VERTEX = { x: 6, y: 3 };

        segment.firstVertex = FIRST_VERTEX;
        segment.secondVertex = SECOND_VERTEX;

        expect(segment.intercept).toEqual(EXPECTED_INTERCEPT);
    });

    it('For vertices: { (0, 0), (3, 6) }, intercept should be 0', () => {
        const EXPECTED_INTERCEPT = 0;
        const FIRST_VERTEX = { x: 0, y: 0 };
        const SECOND_VERTEX = { x: 3, y: 6 };

        segment.firstVertex = FIRST_VERTEX;
        segment.secondVertex = SECOND_VERTEX;

        expect(segment.intercept).toEqual(EXPECTED_INTERCEPT);
    });

    it('For vertices: { (0, 0), (3, 6) }, top-left should be (0, 0) and bottom-right should be (3, 6)', () => {
        const FIRST_VERTEX = { x: 0, y: 0 };
        const SECOND_VERTEX = { x: 3, y: 6 };
        const EXPECTED_TOP_LEFT = { x: 0, y: 0 };
        const EXPECTED_BOTTOM_RIGHT = { x: 3, y: 6 };

        segment.firstVertex = FIRST_VERTEX;
        segment.secondVertex = SECOND_VERTEX;

        expect(segment.topLeft).toEqual(EXPECTED_TOP_LEFT);
        expect(segment.bottomRight).toEqual(EXPECTED_BOTTOM_RIGHT);
    });

    it('For vertices: { (3, 6), (0, 0) }, top-left should be (0, 0) and bottom-right should be (3, 6)', () => {
        const FIRST_VERTEX = { x: 3, y: 6 };
        const SECOND_VERTEX = { x: 0, y: 0 };
        const EXPECTED_TOP_LEFT = { x: 0, y: 0 };
        const EXPECTED_BOTTOM_RIGHT = { x: 3, y: 6 };

        segment.firstVertex = FIRST_VERTEX;
        segment.secondVertex = SECOND_VERTEX;

        expect(segment.topLeft).toEqual(EXPECTED_TOP_LEFT);
        expect(segment.bottomRight).toEqual(EXPECTED_BOTTOM_RIGHT);
    });

    it('For vertices: { (3, 0), (0, 6) }, top-left should be (0, 0) and bottom-right should be (3, 6)', () => {
        const FIRST_VERTEX = { x: 3, y: 0 };
        const SECOND_VERTEX = { x: 0, y: 6 };
        const EXPECTED_TOP_LEFT = { x: 0, y: 0 };
        const EXPECTED_BOTTOM_RIGHT = { x: 3, y: 6 };

        segment.firstVertex = FIRST_VERTEX;
        segment.secondVertex = SECOND_VERTEX;

        expect(segment.topLeft).toEqual(EXPECTED_TOP_LEFT);
        expect(segment.bottomRight).toEqual(EXPECTED_BOTTOM_RIGHT);
    });

    it('For vertices: { (0, 6), (3, 0) }, top-left should be (0, 0) and bottom-right should be (3, 6)', () => {
        const FIRST_VERTEX = { x: 0, y: 6 };
        const SECOND_VERTEX = { x: 3, y: 0 };
        const EXPECTED_TOP_LEFT = { x: 0, y: 0 };
        const EXPECTED_BOTTOM_RIGHT = { x: 3, y: 6 };

        segment.firstVertex = FIRST_VERTEX;
        segment.secondVertex = SECOND_VERTEX;

        expect(segment.topLeft).toEqual(EXPECTED_TOP_LEFT);
        expect(segment.bottomRight).toEqual(EXPECTED_BOTTOM_RIGHT);
    });

    it('Segments { (0, 0), (6, 0) } and { (0, 1), (6, 1) } should not intersect', () => {
        const firstVertex = new LassoSelectionSegmentBounds({ x: 0, y: 0 }, { x: 6, y: 0 });
        const secondVertex = new LassoSelectionSegmentBounds({ x: 0, y: 1 }, { x: 6, y: 1 });

        expect(firstVertex.intersects(secondVertex)).toBeFalse();
    });

    it('Segments { (0, 0), (6, 0) } and { (3, 1), (3, -1) } should intersect', () => {
        const firstVertex = new LassoSelectionSegmentBounds({ x: 0, y: 0 }, { x: 6, y: 0 });
        const secondVertex = new LassoSelectionSegmentBounds({ x: 3, y: 1 }, { x: 3, y: -1 });

        expect(firstVertex.intersects(secondVertex)).toBeTrue();
    });

    it('Segments { (0, 0), (6, 0) } and { (0, 1), (6, -1) } should intersect', () => {
        const firstVertex = new LassoSelectionSegmentBounds({ x: 0, y: 0 }, { x: 6, y: 0 });
        const secondVertex = new LassoSelectionSegmentBounds({ x: 3, y: 1 }, { x: 3, y: -1 });

        expect(firstVertex.intersects(secondVertex)).toBeTrue();
    });

    it('Segments { (0, 0), (6, 0) } and { (6, 1), (0, -1) } should intersect', () => {
        const firstVertex = new LassoSelectionSegmentBounds({ x: 0, y: 0 }, { x: 6, y: 0 });
        const secondVertex = new LassoSelectionSegmentBounds({ x: 3, y: 1 }, { x: 3, y: -1 });

        expect(firstVertex.intersects(secondVertex)).toBeTrue();
    });

    it('Segments { (0, 0), (6, 0) } and { (12, 1), (12, -1) } should not intersect', () => {
        const firstVertex = new LassoSelectionSegmentBounds({ x: 0, y: 0 }, { x: 6, y: 0 });
        const secondVertex = new LassoSelectionSegmentBounds({ x: 3, y: 1 }, { x: 3, y: -1 });

        expect(firstVertex.intersects(secondVertex)).toBeFalse();
    });
});
