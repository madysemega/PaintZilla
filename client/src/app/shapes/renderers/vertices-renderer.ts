import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { VerticesShape } from '@app/shapes/vertices-shape';
import { ShapeRenderer } from './shape-renderer';

export class VerticesRenderer extends ShapeRenderer<VerticesShape> {
    constructor(shape: VerticesShape, properties: ShapeProperty[]) {
        super(shape, properties);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        this.shape.vertices.forEach((vertex) => {
            ctx.lineTo(vertex.x, vertex.y);
        });
        ctx.stroke();
    }

    clone(): ShapeRenderer<VerticesShape> {
        return new VerticesRenderer(this.getShapeCopy(), this.getPropertiesCopy());
    }
}
