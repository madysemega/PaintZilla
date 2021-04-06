import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { TextShape } from '@app/shapes/text-shape';
import { ShapeRenderer } from './shape-renderer';

export class TextCursorRenderer extends ShapeRenderer<TextShape> {
    constructor(shape: TextShape, properties: ShapeProperty[], public cursorPosition: number) {
        super(shape, properties);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const CURSOR_BOTTOM_SIZE_DIVIDEND = 3;

        const xOffset = ctx.measureText(this.shape.text.substr(0, this.cursorPosition)).width;
        const xPosition = this.shape.position.x + xOffset;

        const fontSize = this.shape.fontSize;

        ctx.beginPath();
        ctx.moveTo(xPosition, this.shape.position.y - fontSize);
        ctx.lineTo(xPosition, this.shape.position.y + fontSize / CURSOR_BOTTOM_SIZE_DIVIDEND);
        ctx.stroke();
    }

    clone(): ShapeRenderer<TextShape> {
        return new TextCursorRenderer(this.getShapeCopy(), this.getPropertiesCopy(), this.cursorPosition);
    }
}
