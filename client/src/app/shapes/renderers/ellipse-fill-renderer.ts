import { Vec2 } from '@app/app/classes/vec2';
import { MAX_DEGREES } from '@app/common-constants';
import { ContouredBoxShape } from '@app/shapes/contoured-box-shape';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { ShapeRenderer } from './shape-renderer';

export class EllipseFillRenderer extends ShapeRenderer<ContouredBoxShape> {
    constructor(shape: ContouredBoxShape, properties: ShapeProperty[]) {
        super(shape, properties);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const center: Vec2 = {
            x: (this.shape.topLeft.x + this.shape.bottomRight.x) / 2,
            y: (this.shape.topLeft.y + this.shape.bottomRight.y) / 2,
        };

        const radii: Vec2 = {
            x: Math.max(Math.abs(this.shape.topLeft.x - this.shape.bottomRight.x) / 2 - this.shape.contourWidth / 2, 0),
            y: Math.max(Math.abs(this.shape.topLeft.y - this.shape.bottomRight.y) / 2 - this.shape.contourWidth / 2, 0),
        };

        ctx.beginPath();
        ctx.ellipse(center.x, center.y, radii.x, radii.y, 0, 0, MAX_DEGREES);
        ctx.fill();
    }

    clone(): ShapeRenderer<ContouredBoxShape> {
        return new EllipseFillRenderer(this.getShapeCopy(), this.getPropertiesCopy());
    }
}
