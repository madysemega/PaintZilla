import { Vec2 } from '@app/app/classes/vec2';
import * as Constants from '@app/tools/services/paint-bucket/paint-bucket.constants';
import { FloodFill } from './flood-fill';

export class FloodFillMock extends FloodFill {
    fill(parameters: Constants.fillParameters): number[] {
        return [];
    }
}

// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
describe('FloodFill', () => {
    let floodFill: FloodFillMock;
    let dataStub: Uint8ClampedArray;
    let imageDataStub: ImageData;
    let onClickStub: Vec2;
    beforeEach(() => {
        dataStub = new Uint8ClampedArray(Constants.LENGTH);
        for (let i = 0; i < 4; i++) {
            dataStub[i] = Constants.MAX_RGBA;
        }
        imageDataStub = new ImageData(dataStub, Constants.WIDTH, Constants.HEIGHT);
        floodFill = new FloodFillMock();
        onClickStub = { x: 0, y: 0 };
    });

    it('should create', () => {
        expect(floodFill).toBeTruthy();
    });

    it('fill(): should return empty array', () => {
        expect(
            floodFill.fill({
                imageData: imageDataStub,
                onClickCoords: {} as Vec2,
                fillColour: Constants.COLOUR_STUB,
                tolerance: Constants.TOLERANCE,
            }),
        ).toEqual([]);
    });

    it('initializeAttributes(): should set attributes', () => {
        const expectedPixels = imageDataStub.data;
        const expectedHeight = imageDataStub.height;
        const expectedWidth = imageDataStub.width;
        const expectedReplacementColour = Constants.COLOUR_STUB;
        const expectedTolerance = Constants.TOLERANCE / Constants.TO_PERCENTAGE;
        spyOn(floodFill, 'getColourAtPixel').and.returnValue(expectedReplacementColour);
        floodFill.initializeAttributes({
            imageData: imageDataStub,
            onClickCoords: onClickStub,
            fillColour: Constants.COLOUR_STUB,
            tolerance: Constants.TOLERANCE,
        });
        expect(floodFill['pixels']).toEqual(expectedPixels);
        expect(floodFill['width']).toEqual(expectedWidth);
        expect(floodFill['height']).toEqual(expectedHeight);
        expect(floodFill['replacementColour']).toEqual(expectedReplacementColour);
        expect(floodFill['replacedColour']).toEqual(expectedReplacementColour);
        expect(floodFill['tolerance']).toEqual(expectedTolerance);
        floodFill['visited'].forEach((array: boolean[]) => {
            array.forEach((pixel: boolean) => {
                expect(pixel).toBeFalse();
            });
        });
    });

    it('colorMatch(): should return true if colors match', () => {
        spyOn(floodFill, 'getColourAtPixel').and.returnValue(Constants.BLACK);
        floodFill.initializeAttributes({ imageData: imageDataStub, onClickCoords: {} as Vec2, fillColour: Constants.BLACK, tolerance: 0 });
        const actualValue = floodFill.colorMatch(0, 0, Constants.BLACK);
        expect(actualValue).toBeTrue();
    });

    it("colorMatch(): should return false if colors don't match", () => {
        spyOn(floodFill, 'getColourAtPixel').and.returnValue(Constants.BLACK);
        floodFill.initializeAttributes({ imageData: imageDataStub, onClickCoords: {} as Vec2, fillColour: Constants.BLACK, tolerance: 0 });
        const actualValue = floodFill.colorMatch(0, 0, Constants.WHITE);
        expect(actualValue).toBeFalse();
    });

    it('getColourAtPixel(): should return a colour with correct attributes', () => {
        floodFill.initializeAttributes({
            imageData: imageDataStub,
            onClickCoords: {} as Vec2,
            fillColour: Constants.BLACK,
            tolerance: Constants.TOLERANCE,
        });
        const colour = floodFill.getColourAtPixel(0);
        expect(colour.getRed()).toEqual(Constants.MAX_RGBA);
        expect(colour.getGreen()).toEqual(Constants.MAX_RGBA);
        expect(colour.getBlue()).toEqual(Constants.MAX_RGBA);
        expect(colour.getAlpha()).toEqual(1);
    });

    it('setPixel(): should set specified pixel with replacementColour', () => {
        floodFill.initializeAttributes({
            imageData: imageDataStub,
            onClickCoords: {} as Vec2,
            fillColour: Constants.BLACK,
            tolerance: Constants.TOLERANCE,
        });
        floodFill.setPixel(0, 0);
        const expectedRGB = 0;
        const expectedAlpha = Constants.MAX_RGBA;
        for (let i = 0; i < 3; i++) {
            expect(floodFill['pixels'][i]).toEqual(expectedRGB);
        }
        expect(floodFill['pixels'][3]).toEqual(expectedAlpha);
    });

    it('inside(): should return true if (x, y) is in bound', () => {
        floodFill['width'] = Constants.WIDTH;
        floodFill['height'] = Constants.HEIGHT;
        const actual = floodFill.inside(3, 0);
        expect(actual).toBeFalse();
    });

    it('inside(): should be false if (x, y) is out of bound', () => {
        floodFill['width'] = Constants.WIDTH;
        floodFill['height'] = Constants.HEIGHT;
        const actual = floodFill.inside(0, 0);
        expect(actual).toBeTrue();
    });

    it('isValidPixel(): should return true if all properties are true', () => {
        spyOn(floodFill, 'inside').and.returnValue(true);
        spyOn(floodFill, 'colorMatch').and.returnValue(true);
        floodFill.initializeAttributes({
            imageData: imageDataStub,
            onClickCoords: {} as Vec2,
            fillColour: Constants.BLACK,
            tolerance: Constants.TOLERANCE,
        });
        const actual = floodFill.isValidPixel(0, 0, Constants.BLACK);
        expect(actual).toBeTrue();
    });

    it('isValidPixel(): should return false if one of properties is false', () => {
        spyOn(floodFill, 'inside').and.returnValue(false);
        const actual = floodFill.isValidPixel(0, 0, Constants.BLACK);
        expect(actual).toBeFalse();
    });

    it('result(): should empty _result array and return its content', () => {
        const expected = [0, 1, 2];
        floodFill['_result'] = expected;
        const actual = floodFill.result;
        expect(actual).toEqual(expected);
        expect(floodFill['_result']).toEqual([]);
    });
});
