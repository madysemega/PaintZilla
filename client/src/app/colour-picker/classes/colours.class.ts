import * as Constants from '@app/colour-picker/constants/colours.class.constants';

export class Colour {
    private red: number = Constants.MIN_RGB;
    private green: number = Constants.MIN_RGB;
    private blue: number = Constants.MIN_RGB;
    private alpha: number = Constants.MAX_ALPHA;

    static fromRgb(red: number, green: number, blue: number): Colour {
        const newColor = new Colour();
        newColor.red = red;
        newColor.green = green;
        newColor.blue = blue;
        return newColor;
    }

    static fromRgba(red: number, green: number, blue: number, alpha: number): Colour {
        const newColor = this.fromRgb(red, green, blue);
        newColor.alpha = alpha;
        return newColor;
    }
    static hsvToRgb(hue: number, saturation: number, value: number): Colour {
        // reference : https://gist.github.com/mjackson/5311256
        const minHue = 0;
        const minSaturation = 0;
        const maxSaturation = 1;
        const minValue = 0;
        const maxValue = 1;

        hue = Math.min(Math.max(minHue, hue), Constants.MAX_HUE);
        saturation = Math.min(Math.max(minSaturation, saturation), maxSaturation);
        value = Math.min(Math.max(minValue, value), maxValue);

        const sectionSize = 60;
        hue /= sectionSize;

        const chroma = value * saturation;
        const x = chroma * (1 - Math.abs((hue % 2) - 1));
        const m = value - chroma;

        let newColor: Colour;
        if (hue <= 1) {
            newColor = Colour.fromRgb(chroma + m, x + m, m);
        } else if (hue <= 2) {
            newColor = Colour.fromRgb(x + m, chroma + m, m);
        } else if (hue <= 3) {
            newColor = Colour.fromRgb(m, chroma + m, x + m);
        } else if (hue <= 4) {
            newColor = Colour.fromRgb(m, x + m, chroma + m);
        } else if (hue <= 5) {
            newColor = Colour.fromRgb(x + m, m, chroma + m);
        } else {
            newColor = Colour.fromRgb(chroma + m, m, x + m);
        }
        newColor.red *= Constants.MAX_RGB;
        newColor.green *= Constants.MAX_RGB;
        newColor.blue *= Constants.MAX_RGB;
        return newColor;
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

    setColor(color: number, minValue: number, maxValue: number): number {
        if (color < minValue) {
            return minValue;
        } else if (color > maxValue) {
            return maxValue;
        }
        return color;
    }

    toStringRBG(): string {
        return `rgb(${this.red}, ${this.green}, ${this.blue})`;
    }

    toStringRBGA(): string {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
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
        // references -> color-conversion ref: https://gist.github.com/mjackson/5311256,
        // hsl explanation refs: https://stackoverflow.com/a/39147465, https://medium.com/innovaccer-tech/rgb-vs-hsb-vs-hsl-demystified-1992d7273d3a
        const redPrime = this.red / Constants.MAX_RGB;
        const greenPrime = this.green / Constants.MAX_RGB;
        const bluePrime = this.blue / Constants.MAX_RGB;

        const cMax = Math.max(redPrime, greenPrime, bluePrime);
        const cMin = Math.min(redPrime, greenPrime, bluePrime);
        const deltaC = cMax - cMin;

        const angleValue = 60;

        let hue: number;
        if (deltaC === 0) {
            hue = 0;
        } else if (cMax === redPrime) {
            hue = angleValue * (((greenPrime - bluePrime) / deltaC) % 6);
        } else if (cMax === greenPrime) {
            hue = angleValue * ((bluePrime - redPrime) / deltaC + 2);
        } else {
            hue = angleValue * ((redPrime - greenPrime) / deltaC + 4);
        }

        const saturation: number = cMax === 0 ? 0 : deltaC / cMax;

        const value = cMax;

        return [hue, saturation, value];
    }
}
