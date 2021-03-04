import { Colour } from '@app/colour-picker/classes/colours.class';
import { ShapeProperty } from './shape-property';

export class FillStyleProperty extends ShapeProperty {
    apply(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.colour.toStringRGBA();
    }

    clone(): ShapeProperty {
        return new FillStyleProperty(this.colour);
    }

    constructor(public colour: Colour) {
        super();
    }
}
