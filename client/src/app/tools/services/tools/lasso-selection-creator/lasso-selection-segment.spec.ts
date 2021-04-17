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
});
