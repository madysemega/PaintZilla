import { PixelShape } from './pixel-shape';

describe('PixelShape', () => {
    let shape: PixelShape;
    beforeEach(() => {
        shape = new PixelShape([]);
    });

    it('should create', () => {
        expect(shape).toBeTruthy();
    });

    it('clear(): should clear the array', () => {
        const expected = [0, 1, 2];
        shape.pixels = expected;
        expect(shape.pixels).toEqual(expected);
        shape.clear();
        expect(shape.pixels).toEqual([]);
    });

    it('clone(): should return same pixels[] as original', () => {
        const expected = [0, 1, 2];
        shape.pixels = expected;
        const clone = shape.clone();
        expect((clone as PixelShape).pixels).toEqual(expected);
    });
});
