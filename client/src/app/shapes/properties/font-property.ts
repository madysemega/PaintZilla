import { ShapeProperty } from './shape-property';

export class FontProperty extends ShapeProperty {
    constructor(public fontSize: number) {
        super();
    }

    apply(ctx: CanvasRenderingContext2D): void {
        ctx.font = `${this.fontSize}px serif`;
    }

    clone(): ShapeProperty {
        return new FontProperty(this.fontSize);
    }
}
