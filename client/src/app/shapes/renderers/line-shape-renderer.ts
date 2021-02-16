import { LineShape } from '@app/shapes/line-shape';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { ShapeRenderer } from './shape-renderer';

export class LineShapeRenderer extends ShapeRenderer<LineShape> {
    constructor(shape: LineShape, properties: ShapeProperty[]) {
        super(shape, properties);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        this.shape.vertices.forEach((vertex) => {
            ctx.lineTo(vertex.x, vertex.y);
        });
        ctx.stroke();
    }
}
