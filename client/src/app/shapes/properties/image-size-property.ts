import { ShapeProperty } from './shape-property';

export class ImageSizeProperty extends ShapeProperty {
    static readonly DEFAULT_WIDTH: number = 1;

    apply(ctx: CanvasRenderingContext2D): void {
        ctx.scale(this.imageSize, this.imageSize);
    }

    clone(): ShapeProperty {
        return new ImageSizeProperty(this.imageSize);
    }

    constructor(public imageSize: number = ImageSizeProperty.DEFAULT_WIDTH) {
        super();
    }
}
