import { ShapeProperty } from '@app/shapes/properties/shape-property';
import * as Constants from '@app/shapes/properties/stroke-width-property/stroke-width-constants';

export class StrokeWidthProperty extends ShapeProperty {
    apply(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.strokeWidth;
    }

    clone(): ShapeProperty {
        return new StrokeWidthProperty(this.strokeWidth);
    }

    constructor(public strokeWidth: number = Constants.DEFAULT_STROKE_WIDTH) {
        super();
    }
}
