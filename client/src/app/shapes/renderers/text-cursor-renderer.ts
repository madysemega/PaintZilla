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

    draw(ctx: CanvasRenderingContext2D): void {
        const CURSOR_BOTTOM_SIZE_DIVIDEND = 3;

        const offsets = this.getOffsetsAt(this.cursorPosition, ctx);

        const xPosition = this.shape.position.x + offsets.x;

        const fontSize = this.shape.fontSize;

        ctx.beginPath();
        ctx.moveTo(xPosition, this.shape.position.y + offsets.y - fontSize);
        ctx.lineTo(xPosition, this.shape.position.y + offsets.y + fontSize / CURSOR_BOTTOM_SIZE_DIVIDEND);
        ctx.stroke();
    }

    clone(): ShapeRenderer<TextShape> {
        return new TextCursorRenderer(this.getShapeCopy(), this.getPropertiesCopy(), this.cursorPosition);
    }
}
