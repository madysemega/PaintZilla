import { Vec2 } from '@app/app/classes/vec2';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { FloodFill } from '@app/tools/services/paint-bucket/flood-fill/flood-fill';
// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
export const HEIGHT = 2;
export const WIDTH = 2;
export const MAX_RGBA = 255;
export const MAX_ALPHA = 1;
export const LENGTH = 16;
export const COLOUR_STUB = new Colour();
export const TOLERANCE = 10;
export const TO_PERCENTAGE = 100;
export const BLACK = new Colour();
export const WHITE = new Colour(MAX_RGBA, MAX_RGBA, MAX_RGBA, MAX_ALPHA);
export class FloodFillMock extends FloodFill {
    fill(imageData: ImageData, onClickCoords: Vec2, fillColour: Colour, tolerance: number): number[] {
        return [];
    }
}

describe('FloodFill', () => {
    let floodFill: FloodFillMock;
    let dataStub: Uint8ClampedArray;
    let imageDataStub: ImageData;
    let onClickStub: Vec2;
    beforeEach(() => {
        dataStub = new Uint8ClampedArray(LENGTH);
        for (let i = 0; i < 4; i++) {
            dataStub[i] = MAX_RGBA;
        }
        imageDataStub = new ImageData(dataStub, WIDTH, HEIGHT);
        floodFill = new FloodFillMock();
        onClickStub = { x: 0, y: 0 };
    });

    it('should create', () => {
        expect(floodFill).toBeTruthy();
    });

    it('fill(): should return empty array', () => {
        expect(floodFill.fill(imageDataStub, {} as Vec2, COLOUR_STUB, TOLERANCE)).toEqual([]);
    });

    it('initializeAttributes(): should set attributes', () => {
        const expectedPixels = imageDataStub.data;
        const expectedHeight = imageDataStub.height;
        const expectedWidth = imageDataStub.width;
        const expectedReplacementColour = COLOUR_STUB;
        const expectedTolerance = TOLERANCE / TO_PERCENTAGE;
        spyOn(floodFill, 'getColourAtPixel').and.returnValue(expectedReplacementColour);
        floodFill.initializeAttributes(imageDataStub, onClickStub, COLOUR_STUB, TOLERANCE);
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
        spyOn(floodFill, 'getColourAtPixel').and.returnValue(BLACK);
        floodFill.initializeAttributes(imageDataStub, {} as Vec2, BLACK, 0);
        const actualValue = floodFill.colorMatch(0, 0, BLACK);
        expect(actualValue).toBeTrue();
    });

    it("colorMatch(): should return false if colors don't match", () => {
        spyOn(floodFill, 'getColourAtPixel').and.returnValue(BLACK);
        floodFill.initializeAttributes(imageDataStub, {} as Vec2, BLACK, 0);
        const actualValue = floodFill.colorMatch(0, 0, WHITE);
        expect(actualValue).toBeFalse();
    });

    it('getColourAtPixel(): should return a colour with correct attributes', () => {
        floodFill.initializeAttributes(imageDataStub, {} as Vec2, BLACK, TOLERANCE);
        const colour = floodFill.getColourAtPixel(0);
        expect(colour.getRed()).toEqual(MAX_RGBA);
        expect(colour.getGreen()).toEqual(MAX_RGBA);
        expect(colour.getBlue()).toEqual(MAX_RGBA);
        expect(colour.getAlpha()).toEqual(1);
    });

    it('setPixel(): should set specified pixel with replacementColour', () => {
        floodFill.initializeAttributes(imageDataStub, {} as Vec2, BLACK, TOLERANCE);
        floodFill.setPixel(0, 0);
        const expectedRGB = 0;
        const expectedAlpha = MAX_RGBA;
        for (let i = 0; i < 3; i++) {
            expect(floodFill['pixels'][i]).toEqual(expectedRGB);
        }
        expect(floodFill['pixels'][3]).toEqual(expectedAlpha);
    });

    it('inside(): should return true if (x, y) is in bound', () => {
        floodFill['width'] = WIDTH;
        floodFill['height'] = HEIGHT;
        const actual = floodFill.inside(3, 0);
        expect(actual).toBeFalse();
    });

    it('inside(): should be false if (x, y) is out of bound', () => {
        floodFill['width'] = WIDTH;
        floodFill['height'] = HEIGHT;
        const actual = floodFill.inside(0, 0);
        expect(actual).toBeTrue();
    });

    it('isValidPixel(): should return true if all properties are true', () => {
        spyOn(floodFill, 'inside').and.returnValue(true);
        spyOn(floodFill, 'colorMatch').and.returnValue(true);
        floodFill.initializeAttributes(imageDataStub, {} as Vec2, BLACK, TOLERANCE);
        const actual = floodFill.isValidPixel(0, 0, BLACK);
        expect(actual).toBeTrue();
    });

    it('isValidPixel(): should return false if one of properties is false', () => {
        spyOn(floodFill, 'inside').and.returnValue(false);
        const actual = floodFill.isValidPixel(0, 0, BLACK);
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
