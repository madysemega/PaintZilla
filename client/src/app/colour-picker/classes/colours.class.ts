import * as Constants from '@app/colour-picker/constants/colours.class.constants';

export class Colour {
    private red: number = Constants.MIN_RGB;
    private green: number = Constants.MIN_RGB;
    private blue: number = Constants.MIN_RGB;
    private alpha: number = Constants.MAX_ALPHA;

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

    rgbToHsl(): [number, number, number] {
        // references -> color-conversion ref: https://css-tricks.com/converting-color-spaces-in-javascript/#rgb-to-hsl,
        // hsl explanation refs: https://stackoverflow.com/a/39147465, https://medium.com/innovaccer-tech/rgb-vs-hsb-vs-hsl-demystified-1992d7273d3a
        let hue = Constants.MIN_HSL;
        let saturation = Constants.MIN_HSL;
        let lightness = Constants.MIN_HSL;
        const red = this.red / Constants.MAX_RGB;
        const green = this.green / Constants.MAX_RGB;
        const blue = this.blue / Constants.MAX_RGB;
        const maxChannelValue = Math.max(red, green, blue);
        const minChannelValue = Math.min(red, green, blue);
        const deltaChannelValue = maxChannelValue - minChannelValue;
        if (deltaChannelValue) {
            if (maxChannelValue === red) {
                hue = ((green - blue) / deltaChannelValue) % Constants.HEXAGON_CIRCUMFERENCE;
            } else if (maxChannelValue === green) {
                hue = (blue - red) / deltaChannelValue + Constants.GREEN_SHIFT_VALUE;
            } else {
                hue = (red - green) / deltaChannelValue + Constants.BLUE_SHIFT_VALUE;
            }
        }
        hue = Math.round(hue * Constants.DEGREE_NORMALIZER);
        if (hue < Constants.MIN_HSL) {
            hue += Constants.MAX_HUE;
        }
        lightness = (maxChannelValue + minChannelValue) / 2;
        saturation = deltaChannelValue === 0 ? 0 : deltaChannelValue / (1 - Math.abs(2 * lightness - 1));

        return [hue, saturation, lightness];
    }

    hslToRgb(hue: number, saturation: number, lightness: number): Colour {
        // reference : https://css-tricks.com/converting-color-spaces-in-javascript/#hsl-to-rgb
        const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
        const secondLargestComponent = chroma * (1 - Math.abs(((hue / 60) % Constants.GREEN_SHIFT_VALUE) - 1));
        const lightnessMatchingValue = lightness - chroma / 2;
        let red = 0;
        let green = 0;
        let blue = 0;
        const result: Colour = new Colour();
        if (hue >= Constants.MIN_HSL && hue < Constants.DEGREE_NORMALIZER) {
            red = chroma;
            green = secondLargestComponent;
            blue = 0;
        } else if (hue >= Constants.DEGREE_NORMALIZER && hue < Constants.DEGREE_NORMALIZER * 2) {
            red = secondLargestComponent;
            green = chroma;
            blue = 0;
        } else if (hue >= Constants.DEGREE_NORMALIZER * 2 && hue < Constants.DEGREE_NORMALIZER * 3) {
            red = 0;
            green = chroma;
            blue = secondLargestComponent;
        } else if (hue >= Constants.DEGREE_NORMALIZER * 3 && hue < Constants.DEGREE_NORMALIZER * 4) {
            red = 0;
            green = secondLargestComponent;
            blue = chroma;
        } else if (hue >= Constants.DEGREE_NORMALIZER * 4 && hue < Constants.DEGREE_NORMALIZER * 5) {
            red = secondLargestComponent;
            green = 0;
            blue = chroma;
        } else if (hue >= Constants.DEGREE_NORMALIZER * 5 && hue < Constants.DEGREE_NORMALIZER * 6) {
            red = chroma;
            green = 0;
            blue = secondLargestComponent;
        }
        red = Math.round((red + lightnessMatchingValue) * Constants.MAX_RGB);
        green = Math.round((green + lightnessMatchingValue) * Constants.MAX_RGB);
        blue = Math.round((blue + lightnessMatchingValue) * Constants.MAX_RGB);
        result.red = red;
        result.green = green;
        result.blue = blue;
        return result;
    }
}
