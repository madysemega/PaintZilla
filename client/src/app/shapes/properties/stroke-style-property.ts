import { Colour } from '@app/colour-picker/classes/colours.class';
import { ShapeProperty } from './shape-property';

export class StrokeStyleProperty extends ShapeProperty {
    apply(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.colour.toStringRGBA();
    }

    clone(): ShapeProperty {
        return new StrokeStyleProperty(this.colour);
    }

    constructor(public colour: Colour) {
        super();
    }
}
