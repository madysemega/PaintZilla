import { LineShape } from '@app/shapes/line-shape/line-shape';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { ShapeRenderer } from './shape-renderer';

export class LineJointsRenderer extends ShapeRenderer<LineShape> {
    constructor(shape: LineShape, properties: ShapeProperty[]) {
        super(shape, properties);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const FULL_CIRCLE_DEGREES = 360;

        const radius = this.shape.jointsDiameter / 2;

        this.shape.vertices.forEach((vertex) => {
            ctx.beginPath();
            ctx.ellipse(vertex.x, vertex.y, radius, radius, 0, 0, FULL_CIRCLE_DEGREES);
            ctx.fill();
        });
    }

    clone(): ShapeRenderer<LineShape> {
        return new LineJointsRenderer(this.getShapeCopy(), this.getPropertiesCopy());
    }
}
