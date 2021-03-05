import { BoxShape } from './box-shape';

describe('BoxShape', () => {
    const INITIAL_TOP_LEFT = { x: 0, y: 0 };
    const INITIAL_BOTTOM_RIGHT = { x: 32, y: 32 };

    let shape: BoxShape;

    beforeEach(() => {
        shape = new BoxShape(INITIAL_TOP_LEFT, INITIAL_BOTTOM_RIGHT);
    });

    it('clone should return a shape with the same coordinates', () => {
        const clonedBoxShape = shape.clone() as BoxShape;

        expect(clonedBoxShape.topLeft).toEqual(shape.topLeft);
        expect(clonedBoxShape.bottomRight).toEqual(shape.bottomRight);
    });

    it('width should be right - left', () => {
        expect(shape.width).toEqual(shape.bottomRight.x - shape.topLeft.x);
    });

    it('height should be bottom - top', () => {
        expect(shape.height).toEqual(shape.bottomRight.y - shape.topLeft.y);
    });
});
