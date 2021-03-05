import { ShapeProperty } from './shape-property';

export class StrokeStyleProperty extends ShapeProperty {
    apply(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.colour;
    }

    clone(): ShapeProperty {
        return new StrokeStyleProperty(this.colour);
    }

    constructor(public colour: string) {
        super();
    }
}
