import { ShapeProperty } from './shape-property';

export class LineCapProperty extends ShapeProperty {
    apply(ctx: CanvasRenderingContext2D): void {
        ctx.lineCap = this.lineCapOption;
    }

    constructor(public lineCapOption: CanvasLineCap) {
        super();
    }
}
