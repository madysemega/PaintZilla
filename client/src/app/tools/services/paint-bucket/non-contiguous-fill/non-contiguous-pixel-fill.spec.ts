import { Vec2 } from '@app/app/classes/vec2';
import { NonContiguousPixelFill } from '@app/tools/services/paint-bucket/non-contiguous-fill/non-contiguous-pixel-fill';
import * as Constants from '@app/tools/services/paint-bucket/paint-bucket.constants';
// tslint:disable:no-string-literal
describe('NonContiguousPixelFill', () => {
    let floodFill: NonContiguousPixelFill;
    let imageData: ImageData;
    beforeEach(() => {
        floodFill = new NonContiguousPixelFill();
        imageData = new ImageData(Constants.WIDTH, Constants.HEIGHT);
        floodFill['height'] = Constants.HEIGHT;
        floodFill['width'] = Constants.WIDTH;
    });

    it('fill(): should not call setPixel if provided pixel is not valid', () => {
        spyOn(floodFill, 'initializeAttributes').and.callThrough();
        spyOn(floodFill, 'isValidPixel').and.returnValue(false);
        const setStub = spyOn(floodFill, 'setPixel').and.stub();
        floodFill.fill({
            imageData,
            onClickCoords: { x: 0, y: 0 } as Vec2,
            fillColour: Constants.BLACK,
            tolerance: Constants.TOLERANCE,
        });
        expect(setStub).not.toHaveBeenCalled();
    });

    it('fill(): should call initialize attributes', () => {
        const initializeStub = spyOn(floodFill, 'initializeAttributes').and.stub();
        spyOn(floodFill, 'isValidPixel').and.returnValue(true);
        spyOn(floodFill, 'setPixel').and.callFake(() => {
            return;
        });
        floodFill.fill({
            imageData,
            onClickCoords: { x: 0, y: 0 } as Vec2,
            fillColour: Constants.BLACK,
            tolerance: Constants.TOLERANCE,
        });
        expect(initializeStub).toHaveBeenCalled();
    });
});
