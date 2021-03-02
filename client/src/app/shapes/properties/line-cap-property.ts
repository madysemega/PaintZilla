import { ShapeProperty } from './shape-property';

export class LineCapProperty extends ShapeProperty {
    apply(ctx: CanvasRenderingContext2D): void {
        ctx.lineCap = this.lineCapOption;
    }

    clone(): ShapeProperty {
        return new LineCapProperty(this.lineCapOption);
    }

    constructor(public lineCapOption: CanvasLineCap) {
        super();
    }
}
