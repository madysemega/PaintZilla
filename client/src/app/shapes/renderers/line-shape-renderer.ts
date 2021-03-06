import { LineShape } from '@app/shapes/line-shape/line-shape';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { ShapeRenderer } from './shape-renderer';

export class LineShapeRenderer extends ShapeRenderer<LineShape> {
    constructor(shape: LineShape, properties: ShapeProperty[]) {
        super(shape, properties);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        this.shape.vertices.forEach((vertex: { x: number; y: number }) => {
            ctx.lineTo(vertex.x, vertex.y);
        });
        ctx.stroke();
    }

    clone(): ShapeRenderer<LineShape> {
        return new LineShapeRenderer(this.getShapeCopy(), this.getPropertiesCopy());
    }
}
