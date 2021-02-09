import { ShapeProperty } from './shape-property';

export class StrokeStyleProperty extends ShapeProperty {
    apply(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.colour;
    }

    constructor(private colour: string) {
        super();
    }
}
