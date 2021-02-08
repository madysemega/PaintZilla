import { ShapeProperty } from "./shape-property";

export class StrokeWidthProperty extends ShapeProperty {
    apply(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = this.strokeWidth;
    }

    constructor(private strokeWidth: number) {
        super();
    }
}