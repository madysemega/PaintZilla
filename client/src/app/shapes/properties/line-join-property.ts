import { ShapeProperty } from './shape-property';

export class LineJoinProperty extends ShapeProperty {
    apply(ctx: CanvasRenderingContext2D): void {
        ctx.lineJoin = this.lineJoinOption;
    }

    clone(): ShapeProperty {
        return new LineJoinProperty(this.lineJoinOption);
    }

    constructor(public lineJoinOption: CanvasLineJoin) {
        super();
    }
}
