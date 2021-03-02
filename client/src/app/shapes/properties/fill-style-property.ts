import { ShapeProperty } from './shape-property';

export class FillStyleProperty extends ShapeProperty {
    apply(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.colour;
    }

    clone(): ShapeProperty {
        return new FillStyleProperty(this.colour);
    }

    constructor(public colour: string) {
        super();
    }
}
