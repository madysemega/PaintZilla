import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { TextShape } from '@app/shapes/text-shape';
import { ShapeRenderer } from './shape-renderer';

export class TextRenderer extends ShapeRenderer<TextShape> {
    constructor(shape: TextShape, properties: ShapeProperty[]) {
        super(shape, properties);
    }

    private getAlignmentAjustedXPosition(ctx: CanvasRenderingContext2D): number {
        const maxLineWidth = this.shape.getMaxLineWidth(ctx);
        let xPosition = this.shape.position.x;

        switch (this.shape.textAlignment) {
            case 'right':
                xPosition += maxLineWidth;
                break;
            case 'center':
                xPosition += maxLineWidth / 2;
                break;
        }

        return xPosition;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const lines = this.shape.splitTextInMultipleLines();
        const xPosition = this.getAlignmentAjustedXPosition(ctx);

        lines.forEach((line, lineNb) => {
            ctx.fillText(line, xPosition, this.shape.position.y + lineNb * this.shape.fontSize);
        });
    }

    clone(): ShapeRenderer<TextShape> {
        return new TextRenderer(this.getShapeCopy(), this.getPropertiesCopy());
    }
}
