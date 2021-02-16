import { ShapeProperty } from './shape-property';

export class FillStyleProperty extends ShapeProperty {
    apply(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.colour;
    }

    constructor(public colour: string) {
        super();
    }
}
