import { Colour } from '@app/colour-picker/classes/colours.class';
import * as Constants from '@app/colour-picker/constants/colours.class.constants';
describe('Colour picker', () => {
    let colour: Colour;

    beforeEach(() => {
        colour = new Colour();
    });

    it('should create', () => {
        expect(colour).toBeTruthy();
    });

    it('hsvToRgb(): should return correct values for rgb properties', () => {
        const expectedRed = Constants.TEST_RGB[0];
        const expectedGreen = Constants.TEST_RGB[1];
        const expectedBlue = Constants.TEST_RGB[2];
        const actualColour = Colour.hsvToRgb(Constants.TEST_HSV[0], Constants.TEST_HSV[1], Constants.TEST_HSV[2]);
        expect(actualColour.getRed()).toEqual(expectedRed);
        expect(actualColour.getGreen()).toEqual(expectedGreen);
        expect(actualColour.getBlue()).toEqual(expectedBlue);
    });

    it('hexToRgb(): should return correct values for rgb properties', () => {
        const expectedRed = Constants.TEST_RGB[0];
        const expectedGreen = Constants.TEST_RGB[1];
        const expectedBlue = Constants.TEST_RGB[2];
        const actualColour = Colour.hexToRgb(Constants.TEST_HEX);
        expect(actualColour.getRed()).toEqual(expectedRed);
        expect(actualColour.getGreen()).toEqual(expectedGreen);
        expect(actualColour.getBlue()).toEqual(expectedBlue);
    });
});
