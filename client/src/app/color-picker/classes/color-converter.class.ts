import * as Constants from '@app/color-picker/constants/color-converter.constants';

export class ColorConverter {
    red: number = 0;
    green: number = 0;
    blue: number = 0;
    alpha: number = 1;

    static Clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

    static convertNumberToHex(num: number): string {
        const convertedNum = Math.round(num).toString(Constants.HEX_BASE);
        return convertedNum.length === 1 ? '0' + convertedNum : convertedNum;
    }

    static getColorFromRGB(red: number, green: number, blue: number): ColorConverter {
        const newColor = new ColorConverter();
        newColor.red = red;
        newColor.green = green;
        newColor.blue = blue;
        return newColor;
    }

    static getColorFromHSV(hue: number, saturation: number, value: number): ColorConverter {
        hue = ColorConverter.Clamp(hue, Constants.HUE_MIN, Constants.HUE_MAX);
        saturation = ColorConverter.Clamp(saturation, Constants.MIN_SATURATION, Constants.MAX_SATURATION);
        value = ColorConverter.Clamp(value, Constants.MIN_VALUE, Constants.MAX_VALUE);

        hue /= Constants.HUE_SECTION_ANGLE;

        const chroma = value * saturation;
        const x = chroma * (1 - Math.abs((hue % 2) - 1));
        const m = value - chroma;

        let newColor: ColorConverter;
        if (hue <= 1) {
            newColor = ColorConverter.getColorFromRGB(chroma + m, x + m, m);
        } else if (hue <= 2) {
            newColor = ColorConverter.getColorFromRGB(x + m, chroma + m, m);
        } else if (hue <= 3) {
            newColor = ColorConverter.getColorFromRGB(m, chroma + m, x + m);
        } else if (hue <= 4) {
            newColor = ColorConverter.getColorFromRGB(m, x + m, chroma + m);
        } else if (hue <= 5) {
            newColor = ColorConverter.getColorFromRGB(x + m, m, chroma + m);
        } else {
            newColor = ColorConverter.getColorFromRGB(chroma + m, m, x + m);
        }
        newColor.red *= Constants.RGB_MAX;
        newColor.green *= Constants.RGB_MAX;
        newColor.blue *= Constants.RGB_MAX;

        return newColor;
    }

    getHSV(): [number, number, number] {
        const redPrime = this.red / Constants.RGB_MAX;
        const greenPrime = this.green / Constants.RGB_MAX;
        const bluePrime = this.blue / Constants.RGB_MAX;
        const cMax = Math.max(redPrime, greenPrime, bluePrime);
        const cMin = Math.min(redPrime, greenPrime, bluePrime);
        const deltaC = cMax - cMin;
        let hue: number;
        if (deltaC === 0) {
            hue = 0;
        } else if (cMax === redPrime) {
            hue = Constants.HUE_SECTION_ANGLE * (((greenPrime - bluePrime) / deltaC) % 6);
        } else if (cMax === greenPrime) {
            hue = Constants.HUE_SECTION_ANGLE * ((bluePrime - redPrime) / deltaC + 2);
        } else {
            hue = Constants.HUE_SECTION_ANGLE * ((redPrime - greenPrime) / deltaC + 4);
        }
        const saturation: number = cMax === 0 ? 0 : deltaC / cMax;
        const value = cMax;
        return [hue, saturation, value];
    }

    getHex(): string {
        return (
            '' +
            ColorConverter.convertNumberToHex(this.red) +
            ColorConverter.convertNumberToHex(this.green) +
            ColorConverter.convertNumberToHex(this.blue)
        );
    }

    clone(): ColorConverter {
        const newColor = new ColorConverter();
        newColor.red = this.red;
        newColor.green = this.green;
        newColor.blue = this.blue;
        newColor.alpha = this.alpha;
        return newColor;
    }

    equals(color: ColorConverter): boolean {
        return this.red === color.red && this.green === color.green && this.blue === color.blue && this.alpha ===  color.alpha;
    }
}
