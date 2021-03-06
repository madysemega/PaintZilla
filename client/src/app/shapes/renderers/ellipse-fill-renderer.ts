import { Vec2 } from '@app/app/classes/vec2';
import { BoxShape } from '@app/shapes/box-shape';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { ShapeRenderer } from './shape-renderer';

export class EllipseFillRenderer extends ShapeRenderer<BoxShape> {
    constructor(shape: BoxShape, properties: ShapeProperty[]) {
        super(shape, properties);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const FULL_CIRCLE_DEG = 360;

        const center: Vec2 = {
            x: (this.shape.topLeft.x + this.shape.bottomRight.x) / 2,
            y: (this.shape.topLeft.y + this.shape.bottomRight.y) / 2,
        };

        const radii: Vec2 = {
            x: Math.abs(this.shape.topLeft.x - this.shape.bottomRight.x) / 2,
            y: Math.abs(this.shape.topLeft.y - this.shape.bottomRight.y) / 2,
        };

        ctx.beginPath();
        ctx.ellipse(center.x, center.y, radii.x, radii.y, 0, 0, FULL_CIRCLE_DEG);
        ctx.fill();
    }

    clone(): ShapeRenderer<BoxShape> {
        return new EllipseFillRenderer(this.getShapeCopy(), this.getPropertiesCopy());
    }
}
