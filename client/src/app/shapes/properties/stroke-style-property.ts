import { ShapeProperty } from './shape-property';

export class StrokeStyleProperty extends ShapeProperty {
    constructor(private colour: string) {
        super();
    }
    apply(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.colour;
    }
}
