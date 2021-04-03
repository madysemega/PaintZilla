import { ShapeProperty } from './shape-property';

export class ImageSizeProperty extends ShapeProperty {
    static readonly DEFAULT_WIDTH: number = 10;

    apply(ctx: CanvasRenderingContext2D): void {
        // ctx.rotate((20 * Math.PI) / 180);
    }

    clone(): ShapeProperty {
        return new ImageSizeProperty(this.imageSize);
    }

    constructor(public imageSize: number = ImageSizeProperty.DEFAULT_WIDTH) {
        super();
    }
}
