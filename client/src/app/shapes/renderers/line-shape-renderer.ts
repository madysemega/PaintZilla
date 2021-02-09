import { LineShape } from '@app/shapes/line-shape';
import { ShapeRenderer } from './shape-renderer';

export class LineShapeRenderer extends ShapeRenderer<LineShape> {
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        this.shape.vertices.forEach((vertex) => {
            ctx.lineTo(vertex.x, vertex.y);
        });
        ctx.stroke();
    }

    constructor(shape: LineShape) {
        super(shape);
    }
}
