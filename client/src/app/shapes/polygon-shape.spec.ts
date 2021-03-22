import { PolygonShape } from './polygon-shape';

describe('PolygonShape', () => {
    const INITIAL_TOP_LEFT = { x: 0, y: 0 };
    const INITIAL_BOTTOM_RIGHT = { x: 32, y: 32 };
    const INITIAL_NUMBER_SIDES = 3;
    const CONTOUR_WIDTH = 6;

    let shape: PolygonShape;

    beforeEach(() => {
        shape = new PolygonShape(INITIAL_TOP_LEFT, INITIAL_BOTTOM_RIGHT, INITIAL_NUMBER_SIDES, CONTOUR_WIDTH);
    });
    it('clone should return a shape with the same coordinates', () => {
        const clonedPolyShape = shape.clone() as PolygonShape;

        expect(clonedPolyShape.topLeft).toEqual(shape.topLeft);
        expect(clonedPolyShape.bottomRight).toEqual(shape.bottomRight);
        expect(clonedPolyShape.numberSides).toEqual(shape.numberSides);
    });
});
