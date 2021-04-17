import { ShapeProperty } from './shape-property';

export class LineDashProperty extends ShapeProperty {
    apply(ctx: CanvasRenderingContext2D): void {
        ctx.setLineDash(this.segments);
    }

    clone(): ShapeProperty {
        return new LineDashProperty(this.segments.map((segment) => segment));
    }

    constructor(public segments: number[]) {
        super();
    }
}
