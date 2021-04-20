import { LassoSelectionSegment } from './lasso-selection-segment';

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
        const firstSegment = new LassoSelectionSegment({ x: 0, y: 0 }, { x: 6, y: 0 });
        const secondSegment = new LassoSelectionSegment({ x: 0, y: 1 }, { x: 6, y: 1 });

        expect(firstSegment.intersects(secondSegment)).toBeFalse();
    });

    it('Segments { (0, 0), (6, 0) } and { (3, 1), (3, -1) } should intersect', () => {
        const firstSegment = new LassoSelectionSegment({ x: 0, y: 0 }, { x: 6, y: 0 });
        const secondSegment = new LassoSelectionSegment({ x: 3, y: 1 }, { x: 3, y: -1 });

        expect(firstSegment.intersects(secondSegment)).toBeTrue();
    });

    it('Segments { (0, 0), (6, 0) } and { (0, 1), (6, -1) } should intersect', () => {
        const firstSegment = new LassoSelectionSegment({ x: 0, y: 0 }, { x: 6, y: 0 });
        const secondSegment = new LassoSelectionSegment({ x: 3, y: 1 }, { x: 3, y: -1 });

        expect(firstSegment.intersects(secondSegment)).toBeTrue();
    });

    it('Segments { (0, 0), (6, 0) } and { (6, 1), (0, -1) } should intersect', () => {
        const firstSegment = new LassoSelectionSegment({ x: 0, y: 0 }, { x: 6, y: 0 });
        const secondSegment = new LassoSelectionSegment({ x: 3, y: 1 }, { x: 3, y: -1 });

        expect(firstSegment.intersects(secondSegment)).toBeTrue();
    });

    it('Segments { (3, 3), (6, 12) } and { (12, 5), (1, 6) } should intersect', () => {
        const firstSegment = new LassoSelectionSegment({ x: 3, y: 3 }, { x: 6, y: 12 });
        const secondSegment = new LassoSelectionSegment({ x: 12, y: 5 }, { x: 1, y: 6 });

        expect(firstSegment.intersects(secondSegment)).toBeTrue();
    });

    it('Segments { (0, 0), (0, 6) } and { (1, 0), (1, 6) } should not intersect', () => {
        const firstSegment = new LassoSelectionSegment({ x: 0, y: 0 }, { x: 0, y: 6 });
        const secondSegment = new LassoSelectionSegment({ x: 1, y: 0 }, { x: 1, y: 6 });

        expect(firstSegment.intersects(secondSegment)).toBeFalse();
    });

    it('Segments { (0, 0), (6, 0) } and { (3, 0), (9, 0) } should intersect', () => {
        const firstSegment = new LassoSelectionSegment({ x: 0, y: 0 }, { x: 6, y: 0 });
        const secondSegment = new LassoSelectionSegment({ x: 3, y: 0 }, { x: 9, y: 0 });

        expect(firstSegment.intersects(secondSegment)).toBeTrue();
    });

    it('Segments { (3, 3), (6, 9) } and { (3, 2), (6, 8) } should not intersect', () => {
        const firstSegment = new LassoSelectionSegment({ x: 3, y: 3 }, { x: 6, y: 9 });
        const secondSegment = new LassoSelectionSegment({ x: 3, y: 2 }, { x: 6, y: 8 });

        expect(firstSegment.intersects(secondSegment)).toBeFalse();
    });

    it('Segments { (3, 3), (6, 9) } and { (12, 2), (15, 8) } should not intersect', () => {
        const firstSegment = new LassoSelectionSegment({ x: 3, y: 3 }, { x: 6, y: 9 });
        const secondSegment = new LassoSelectionSegment({ x: 12, y: 2 }, { x: 15, y: 8 });

        expect(firstSegment.intersects(secondSegment)).toBeFalse();
    });

    it('Segments { (3, 3), (6, 9) } and { (12, 2), (15, 8) } should not intersect', () => {
        const firstSegment = new LassoSelectionSegment({ x: 3, y: 3 }, { x: 6, y: 9 });
        const secondSegment = new LassoSelectionSegment({ x: 2, y: 2 }, { x: 5, y: 8 });

        expect(firstSegment.intersects(secondSegment)).toBeFalse();
    });

    it('Segments { (30, 30), (60, 90) } and { (3, 3), (6, 9) } should not intersect', () => {
        const firstSegment = new LassoSelectionSegment({ x: 30, y: 30 }, { x: 60, y: 90 });
        const secondSegment = new LassoSelectionSegment({ x: 3, y: 3 }, { x: 6, y: 9 });

        expect(firstSegment.intersects(secondSegment)).toBeFalse();
    });

    it('Segments { (0, 0), (1, 1) } and { (10, 10), (11, 11) } should not intersect', () => {
        const firstSegment = new LassoSelectionSegment({ x: 0, y: 0 }, { x: 1, y: 1 });
        const secondSegment = new LassoSelectionSegment({ x: 10, y: 10 }, { x: 11, y: 11 });

        expect(firstSegment.intersects(secondSegment)).toBeFalse();
    });

    it('Segments { (5, 10), (5, -10) } and { (0, 0), (10, 0) } should intersect', () => {
        const firstSegment = new LassoSelectionSegment({ x: 5, y: 10 }, { x: 5, y: -10 });
        const secondSegment = new LassoSelectionSegment({ x: 0, y: 0 }, { x: 10, y: 0 });

        expect(firstSegment.intersects(secondSegment)).toBeTrue();
    });
});
