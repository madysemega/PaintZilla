import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { SprayShape } from '@app/shapes/spray-shape';
import { ShapeRenderer } from './shape-renderer';

export class SprayRenderer extends ShapeRenderer<SprayShape> {
    constructor(shape: SprayShape, properties: ShapeProperty[]) {
        super(shape, properties);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const NB_DEG_FULL_CIRCLE = 360;

        for (const vertex of this.shape.vertices) {
            ctx.beginPath();
            ctx.ellipse(vertex.x, vertex.y, this.shape.radius, this.shape.radius, 0, 0, NB_DEG_FULL_CIRCLE);
            ctx.fill();
        }
    }

    clone(): SprayRenderer {
        return new SprayRenderer(this.getShapeCopy(), this.getPropertiesCopy());
    }
}
