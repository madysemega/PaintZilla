import { ShapeProperty } from './shape-property';

export class FillStyleProperty extends ShapeProperty {
    constructor(private colour: string) {
        super();
    }
    apply(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.colour;
    }
}
