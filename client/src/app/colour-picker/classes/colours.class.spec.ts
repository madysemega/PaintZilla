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

    it('toHex(): should return any number to hex format (#ff)', () => {
        expect(Colour.toHex(Constants.MIN_RGB)).toEqual('00');
        expect(Colour.toHex(Constants.MAX_RGB)).toEqual('ff');
    });

    it('equals(): should return true if colours are equal and false if not', () => {
        const firstColour: Colour = new Colour(Constants.TEST_COLOUR.red, Constants.TEST_COLOUR.green, Constants.TEST_COLOUR.blue);
        const secondColour: Colour = new Colour(Constants.TEST_COLOUR.red, Constants.TEST_COLOUR.green, Constants.TEST_COLOUR.blue);
        expect(firstColour.equals(secondColour)).toBeTrue();
        secondColour.setAlpha(0);
        expect(firstColour.equals(secondColour)).toBeFalse();
    });

    it('setRed(): should set red to specified values inside [0, 255]', () => {
        colour.setRed(Constants.TEST_RGB[1]);
        expect(colour.getRed()).toEqual(Constants.TEST_RGB[1]);
        colour.setRed(Constants.TEST_RGB[1] + Constants.MAX_RGB);
        expect(colour.getRed()).toEqual(Constants.MAX_RGB);
        colour.setRed(Constants.MIN_RGB - Constants.TEST_RGB[1]);
        expect(colour.getRed()).toEqual(Constants.MIN_RGB);
    });

    it('setGreen(): should set green to specified values inside [0, 255]', () => {
        colour.setGreen(Constants.TEST_RGB[1]);
        expect(colour.getGreen()).toEqual(Constants.TEST_RGB[1]);
        colour.setGreen(Constants.TEST_RGB[1] + Constants.MAX_RGB);
        expect(colour.getGreen()).toEqual(Constants.MAX_RGB);
        colour.setGreen(Constants.MIN_RGB - Constants.TEST_RGB[1]);
        expect(colour.getGreen()).toEqual(Constants.MIN_RGB);
    });

    it('setBlue(): should set red to specified values inside [0, 255]', () => {
        colour.setBlue(Constants.TEST_RGB[1]);
        expect(colour.getBlue()).toEqual(Constants.TEST_RGB[1]);
        colour.setBlue(Constants.TEST_RGB[1] + Constants.MAX_RGB);
        expect(colour.getBlue()).toEqual(Constants.MAX_RGB);
        colour.setBlue(Constants.MIN_RGB - Constants.TEST_RGB[1]);
        expect(colour.getBlue()).toEqual(Constants.MIN_RGB);
    });

    it('setAlpha(): should set red to specified values inside [0, 255]', () => {
        colour.setAlpha(Constants.TEST_ALPHA);
        expect(colour.getAlpha()).toEqual(Constants.TEST_ALPHA);
        colour.setAlpha(Constants.MAX_ALPHA + Constants.TEST_ALPHA);
        expect(colour.getAlpha()).toEqual(Constants.MAX_ALPHA);
        colour.setAlpha(Constants.MIN_ALPHA - Constants.TEST_ALPHA);
        expect(colour.getAlpha()).toEqual(Constants.MIN_ALPHA);
    });

    it('toStringRGB(): should return rgb property in rgb(r, g, b) string form', () => {
        colour = new Colour();
        expect(colour.toStringRGB()).toEqual(Constants.DEFAULT_RGB);
    });

    it('toStringRGBA(): should return rgb property in rgba(r, g, b, a) string form', () => {
        colour = new Colour();
        expect(colour.toStringRGBA()).toEqual(Constants.DEFAULT_RGBA);
    });

    it('toStringHex(): should return rgb property in hex #ffffff string form', () => {
        colour = new Colour();
        expect(colour.toStringHex()).toEqual(Constants.DEFAULT_HEX);
    });

    it('clone(): should return a clone of calling instance', () => {
        const clone = colour.clone();
        expect(colour).toEqual(clone);
    });

    it('rgbToHsv(): should return a clone of calling instance', () => {
        colour.setRed(Constants.TEST_RGB[0]);
        colour.setGreen(Constants.TEST_RGB[1]);
        colour.setBlue(Constants.TEST_RGB[2]);
        const [hue, saturation, value] = colour.rgbToHsv();
        expect(hue).toEqual(Constants.TEST_HSV[0]);
        expect(saturation / Constants.TO_PERCENTAGE).toEqual(Constants.TEST_HSV[1]);
        expect(value / Constants.TO_PERCENTAGE).toEqual(Constants.TEST_HSV[2]);
    });
});
