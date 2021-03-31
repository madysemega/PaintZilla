import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { TextShape } from '@app/shapes/text-shape';
import { ShapeRenderer } from './shape-renderer';

export class TextCursorRenderer extends ShapeRenderer<TextShape> {
    constructor(shape: TextShape, properties: ShapeProperty[], public cursorPosition: number) {
        super(shape, properties);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const xOffset = ctx.measureText(this.shape.text.substr(0, this.cursorPosition)).width;
        const xPosition = this.shape.position.x + xOffset;

        ctx.beginPath();
        ctx.moveTo(xPosition, this.shape.position.y - this.shape.fontSize);
        ctx.lineTo(xPosition, this.shape.position.y);
        ctx.stroke();
    }

    clone(): ShapeRenderer<TextShape> {
        return new TextCursorRenderer(this.getShapeCopy(), this.getPropertiesCopy(), this.cursorPosition);
    }
}
