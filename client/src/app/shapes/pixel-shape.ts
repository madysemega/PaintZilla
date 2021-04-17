import { Shape } from './shape';
export class PixelShape extends Shape {
    constructor(public pixels: number[]) {
        super();
    }

    clear(): void {
        this.pixels = [];
    }

    clone(): Shape {
        const clonedPixels = new Array<number>();
        this.pixels.forEach((pixel) => {
            clonedPixels.push(pixel);
        });
        return new PixelShape(clonedPixels);
    }
}
