import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { TextShape } from '@app/shapes/text-shape';
import { ShapeRenderer } from './shape-renderer';

export class TextRenderer extends ShapeRenderer<TextShape> {
    constructor(shape: TextShape, properties: ShapeProperty[]) {
        super(shape, properties);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const lines = this.shape.splitTextInMultipleLines();
        lines.forEach((line, lineNb) => {
            ctx.fillText(line, this.shape.position.x, this.shape.position.y + lineNb * this.shape.fontSize);
        });
    }

    clone(): ShapeRenderer<TextShape> {
        return new TextRenderer(this.getShapeCopy(), this.getPropertiesCopy());
    }
}
