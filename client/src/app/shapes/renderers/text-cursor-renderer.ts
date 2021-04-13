import { Vec2 } from '@app/app/classes/vec2';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { TextShape } from '@app/shapes/text-shape';
import { TextCursor } from '@app/tools/services/tools/text/text-cursor';
import { ShapeRenderer } from './shape-renderer';

export class TextCursorRenderer extends ShapeRenderer<TextShape> {
    constructor(shape: TextShape, properties: ShapeProperty[], public cursor: TextCursor) {
        super(shape, properties);
    }

    private getOffsetsAt(cursorPosition: number, ctx: CanvasRenderingContext2D): Vec2 {
        const offsets = { x: 0, y: 0 };

        for (let i = 0; i < cursorPosition && i < this.shape.text.length; ++i) {
            const character = this.shape.text[i];
            if (character === '\n') {
                offsets.x = 0;
                offsets.y += this.shape.fontSize;
            } else {
                offsets.x += ctx.measureText(character).width;
            }
        }

        return offsets;
    }

    private getTextCurrentLineWidth(ctx: CanvasRenderingContext2D): number {
        let currentLineIndex = 0;
        for (let position = 0; position < this.cursor.position; ++position) {
            if (this.shape.text[position] === '\n') {
                ++currentLineIndex;
            }
        }
        const lines = this.shape.splitTextInMultipleLines();
        return lines[currentLineIndex] === undefined ? 0 : ctx.measureText(lines[currentLineIndex]).width;
    }

    private getRealPosition(start: Vec2, ctx: CanvasRenderingContext2D): Vec2 {
        const maxLineWidth = this.shape.getMaxLineWidth(ctx);
        const currentLineWidth = this.getTextCurrentLineWidth(ctx);

        switch (this.shape.textAlignment) {
            case 'left':
                return start;
            case 'center':
                return {
                    x: start.x + (maxLineWidth - currentLineWidth) / 2,
                    y: start.y,
                };
            case 'right':
                return {
                    x: start.x + maxLineWidth - currentLineWidth,
                    y: start.y,
                };
            default:
                return start;
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const CURSOR_BOTTOM_SIZE_DIVIDEND = 3;

        const offsets = this.getOffsetsAt(this.cursor.position, ctx);

        const realStart = this.getRealPosition(this.shape.position, ctx);

        const xPosition = realStart.x + offsets.x;
        const yPosition = realStart.y + offsets.y;

        const fontSize = this.shape.fontSize;

        ctx.beginPath();
        ctx.moveTo(xPosition, yPosition - fontSize);
        ctx.lineTo(xPosition, yPosition + fontSize / CURSOR_BOTTOM_SIZE_DIVIDEND);
        ctx.stroke();
    }

    clone(): ShapeRenderer<TextShape> {
        const shapeClone = this.getShapeCopy();
        return new TextCursorRenderer(shapeClone, this.getPropertiesCopy(), this.cursor.clone(shapeClone));
    }
}
