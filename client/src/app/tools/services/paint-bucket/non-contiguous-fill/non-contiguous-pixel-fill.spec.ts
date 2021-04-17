import { Vec2 } from '@app/app/classes/vec2';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { NonContiguousPixelFill } from '@app/tools/services/paint-bucket/non-contiguous-fill/non-contiguous-pixel-fill';
// tslint:disable:no-string-literal
export const HEIGHT = 10;
export const WIDTH = 10;
export const COLOUR_STUB = new Colour();
export const TOLERANCE = 10;
describe('NonContiguousPixelFill', () => {
    let floodFill: NonContiguousPixelFill;
    let imageData: ImageData;
    beforeEach(() => {
        floodFill = new NonContiguousPixelFill();
        imageData = new ImageData(WIDTH, HEIGHT);
        floodFill['height'] = HEIGHT;
        floodFill['width'] = WIDTH;
    });

    it('fill(): should not call setPixel if provided pixel is not valid', () => {
        spyOn(floodFill, 'initializeAttributes').and.callThrough();
        spyOn(floodFill, 'isValidPixel').and.returnValue(false);
        const setStub = spyOn(floodFill, 'setPixel').and.stub();
        floodFill.fill(imageData, {} as Vec2, COLOUR_STUB, TOLERANCE);
        expect(setStub).not.toHaveBeenCalled();
    });

    it('fill(): should call initialize attributes', () => {
        const initializeStub = spyOn(floodFill, 'initializeAttributes').and.stub();
        spyOn(floodFill, 'isValidPixel').and.returnValue(true);
        spyOn(floodFill, 'setPixel').and.callFake(() => {
            return;
        });
        floodFill.fill(imageData, { x: 0, y: 0 }, COLOUR_STUB, TOLERANCE);
        expect(initializeStub).toHaveBeenCalled();
    });
});
