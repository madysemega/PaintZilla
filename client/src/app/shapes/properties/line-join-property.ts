import { ShapeProperty } from './shape-property';

export class LineJoinProperty extends ShapeProperty {
    apply(ctx: CanvasRenderingContext2D): void {
        ctx.lineJoin = this.lineJoinOption;
    }

    constructor(public lineJoinOption: CanvasLineJoin) {
        super();
    }
}
