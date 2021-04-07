import { ShapeProperty } from './shape-property';

export class FontProperty extends ShapeProperty {
    constructor(public fontSize: number, public fontName: string) {
        super();
    }

    apply(ctx: CanvasRenderingContext2D): void {
        ctx.font = `${this.fontSize}px ${this.fontName}`;
    }

    clone(): ShapeProperty {
        return new FontProperty(this.fontSize, this.fontName);
    }
}
