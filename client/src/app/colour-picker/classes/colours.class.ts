import * as Constants from '@app/colour-picker/constants/colours.class.constants';
import * as Converter from 'color-convert';
export class Colour {
    private red: number;
    private green: number;
    private blue: number;
    private alpha: number;
    constructor(
        red: number = Constants.MIN_RGB,
        green: number = Constants.MIN_RGB,
        blue: number = Constants.MIN_RGB,
        alpha: number = Constants.MAX_ALPHA,
    ) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
    static hsvToRgb(hue: number, saturation: number, value: number): Colour {
        // references -> color-conversion ref: https://github.com/Qix-/color-convert, library: https://www.npmjs.com/package/color-convert
        // hsv explanation refs: https://stackoverflow.com/a/39147465, https://medium.com/innovaccer-tech/rgb-vs-hsb-vs-hsl-demystified-1992d7273d3a
        const convertedToRgb = Converter.hsv.rgb([hue, saturation * Constants.TO_PERCENTAGE, value * Constants.TO_PERCENTAGE]);
        const result = new Colour();
        result.red = convertedToRgb[Constants.FIRST_INDEX];
        result.green = convertedToRgb[Constants.SECOND_INDEX];
        result.blue = convertedToRgb[Constants.THIRD_INDEX];
        return result;
    }

    static hexToRgb(hexColor: string): Colour {
        const rgb = Converter.hex.rgb(hexColor);
        const result = new Colour();
        result.red = rgb[Constants.FIRST_INDEX];
        result.green = rgb[Constants.SECOND_INDEX];
        result.blue = rgb[Constants.THIRD_INDEX];
        return result;
    }

    static toHex(color: number): string {
        const hex = Math.round(color).toString(Constants.BASE_HEX);
        return hex.length === 1 ? '0' + hex : hex;
    }

    equals(colour: Colour): boolean {
        return this.alpha === colour.alpha && this.red === colour.red && this.green === colour.green && this.blue === colour.blue;
    }

    getRed(): number {
        return this.red;
    }

    getGreen(): number {
        return this.green;
    }

    getBlue(): number {
        return this.blue;
    }

    getAlpha(): number {
        return this.alpha;
    }

    setRed(red: number): void {
        this.red = this.setColor(red, Constants.MIN_RGB, Constants.MAX_RGB);
    }

    setGreen(green: number): void {
        this.green = this.setColor(green, Constants.MIN_RGB, Constants.MAX_RGB);
    }

    setBlue(blue: number): void {
        this.blue = this.setColor(blue, Constants.MIN_RGB, Constants.MAX_RGB);
    }

    setAlpha(alpha: number): void {
        this.alpha = this.setColor(alpha, Constants.MIN_ALPHA, Constants.MAX_ALPHA);
    }

    private setColor(color: number, minValue: number, maxValue: number): number {
        if (color < minValue) {
            return minValue;
        } else if (color > maxValue) {
            return maxValue;
        }
        return color;
    }

    toStringRGB(): string {
        return `rgb(${this.red}, ${this.green}, ${this.blue})`;
    }

    toStringRGBA(): string {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
    }

    toStringHex(): string {
        return '' + Colour.toHex(this.red) + Colour.toHex(this.green) + Colour.toHex(this.blue);
    }

    clone(): Colour {
        const newColor = new Colour();
        newColor.red = this.red;
        newColor.green = this.green;
        newColor.blue = this.blue;
        newColor.alpha = this.alpha;
        return newColor;
    }

    rgbToHsv(): [number, number, number] {
        // references -> color-conversion ref: https://github.com/Qix-/color-convert, library: https://www.npmjs.com/package/color-convert
        // hsv explanation refs: https://stackoverflow.com/a/39147465, https://medium.com/innovaccer-tech/rgb-vs-hsb-vs-hsl-demystified-1992d7273d3a
        return Converter.rgb.hsv(this.red, this.green, this.blue);
    }
}
