import { ShapeProperty } from './shape-property';

export class FillStyleProperty extends ShapeProperty {
    apply(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.colour;
    }

    constructor(private colour: string) {
        super();
    }
}
