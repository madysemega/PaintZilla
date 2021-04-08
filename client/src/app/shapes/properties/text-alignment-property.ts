import { ShapeProperty } from './shape-property';

export class TextAlignmentProperty extends ShapeProperty {
    constructor(public value: CanvasTextAlign) {
        super();
    }

    apply(ctx: CanvasRenderingContext2D): void {
        ctx.textAlign = this.value;
    }

    clone(): ShapeProperty {
        return new TextAlignmentProperty(this.value);
    }
}
