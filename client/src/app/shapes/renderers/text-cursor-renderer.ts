import { Vec2 } from '@app/app/classes/vec2';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { TextShape } from '@app/shapes/text-shape';
import { ShapeRenderer } from './shape-renderer';

export class TextCursorRenderer extends ShapeRenderer<TextShape> {
    constructor(shape: TextShape, properties: ShapeProperty[], public cursorPosition: number) {
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
        for (let position = 0; position < this.cursorPosition; ++position) {
            if (this.shape.text[position] === '\n') {
                ++currentLineIndex;
            }
        }
        const lines = this.shape.splitTextInMultipleLines();
        return lines[currentLineIndex] === undefined ? 0 : ctx.measureText(lines[currentLineIndex]).width;
    }

    private getRealPosition(start: Vec2, ctx: CanvasRenderingContext2D): Vec2 {
        const currentLineWidth = this.getTextCurrentLineWidth(ctx);
        console.log(currentLineWidth);

        switch (this.shape.textAlignment) {
            case 'left':
                return start;
            case 'center':
                return {
                    x: start.x - currentLineWidth / 2,
                    y: start.y,
                };
            case 'right':
                return {
                    x: start.x - currentLineWidth,
                    y: start.y,
                };
            default:
                return start;
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const CURSOR_BOTTOM_SIZE_DIVIDEND = 3;

        const offsets = this.getOffsetsAt(this.cursorPosition, ctx);

        const realStart = this.getRealPosition(this.shape.position, ctx);

        console.log(realStart.x);

        const xPosition = realStart.x + offsets.x;
        const yPosition = realStart.y + offsets.y;

        console.log(xPosition);

        const fontSize = this.shape.fontSize;

        ctx.beginPath();
        ctx.moveTo(xPosition, yPosition - fontSize);
        ctx.lineTo(xPosition, yPosition + fontSize / CURSOR_BOTTOM_SIZE_DIVIDEND);
        ctx.stroke();
    }

    clone(): ShapeRenderer<TextShape> {
        return new TextCursorRenderer(this.getShapeCopy(), this.getPropertiesCopy(), this.cursorPosition);
    }
}
