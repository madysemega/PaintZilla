
export const HEXAGON_CIRCUMFERENCE = 6;
export const MAX_RGB = 255;
export const MIN_RGB = 0;
export const MIN_HSL = 0;
export const GREEN_SHIFT_VALUE = 2;
export const BLUE_SHIFT_VALUE = 4;
export const MAX_HUE = 360;
export const DEGREE_NORMALIZER = 60;

export class Color {
    private red: number;
    private green: number;
    private blue: number;


    rgbToHsl(): [number, number, number] {
        // references -> color-conversion ref: https://css-tricks.com/converting-color-spaces-in-javascript/#rgb-to-hsl, 
        // hsl explanation refs: https://stackoverflow.com/a/39147465, https://medium.com/innovaccer-tech/rgb-vs-hsb-vs-hsl-demystified-1992d7273d3a
        let hue = MIN_HSL, saturation = MIN_HSL, lightness = MIN_HSL;
        const red = this.red / MAX_RGB;
        const green = this.green / MAX_RGB;
        const blue = this.blue / MAX_RGB;
        let maxChannelValue = Math.max(red, green, blue);
        let minChannelValue = Math.min(red, green, blue);
        let deltaChannelValue = maxChannelValue - minChannelValue;
        if (deltaChannelValue){
            if (maxChannelValue === red) {
                hue = ((green - blue) / deltaChannelValue) % HEXAGON_CIRCUMFERENCE;
            } else if (maxChannelValue === green) {
                hue = (blue - red) / deltaChannelValue + GREEN_SHIFT_VALUE;
            } else {
                hue = (red - green) / deltaChannelValue + BLUE_SHIFT_VALUE;
            }
        }
        hue = Math.round(hue * DEGREE_NORMALIZER);
        if (hue < MIN_HSL){
            hue += MAX_HUE;
        }
        lightness = (maxChannelValue + minChannelValue) / 2;
        saturation = deltaChannelValue === 0 ? 0 : deltaChannelValue / (1 - Math.abs(2 * lightness - 1));

        return [hue, saturation, lightness];
    }

    hslToRgb(hue: number, saturation: number, lightness: number): void {
        // reference : https://css-tricks.com/converting-color-spaces-in-javascript/#hsl-to-rgb
        let chroma = (1 - Math.abs(2 * lightness - 1)) * saturation,
        secondLargestComponent = chroma * (1 - Math.abs((hue / 60) % GREEN_SHIFT_VALUE - 1)),
        lightnessMatchingValue = lightness - chroma / 2, red = 0, green = 0, blue = 0;
        if (hue >= MIN_HSL && hue < DEGREE_NORMALIZER){
            red = chroma;
            green = secondLargestComponent;
            blue = 
        }
    }
}