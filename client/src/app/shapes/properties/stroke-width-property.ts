import { ShapeProperty } from './shape-property';

export class StrokeWidthProperty extends ShapeProperty {
    static readonly DEFAULT_STROKE_WIDTH: number = 1;

    constructor(public strokeWidth: number = StrokeWidthProperty.DEFAULT_STROKE_WIDTH) {
        super();
    }

    apply(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.strokeWidth;
    }
}
