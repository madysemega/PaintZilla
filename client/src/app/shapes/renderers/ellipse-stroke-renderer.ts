import { Vec2 } from '@app/app/classes/vec2';
import { BoxShape } from '@app/shapes/box-shape';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { MathsHelper } from '../helper/maths-helper.service';
import { ShapeRenderer } from './shape-renderer';

export class EllipseStrokeRenderer extends ShapeRenderer<BoxShape> {
    constructor(shape: BoxShape, properties: ShapeProperty[], private mathsHelper: MathsHelper) {
        super(shape, properties);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const FULL_CIRCLE_DEG = 360;

        const center: Vec2 = this.mathsHelper.computeCenter(this.shape.topLeft, this.shape.bottomRight);

        const radii: Vec2 = {
            x: Math.abs(this.shape.topLeft.x - this.shape.bottomRight.x) / 2,
            y: Math.abs(this.shape.topLeft.y - this.shape.bottomRight.y) / 2,
        };

        ctx.beginPath();
        ctx.ellipse(center.x, center.y, radii.x, radii.y, 0, 0, FULL_CIRCLE_DEG);
        ctx.stroke();
    }

    clone(): ShapeRenderer<BoxShape> {
        return new EllipseStrokeRenderer(this.getShapeCopy(), this.getPropertiesCopy(), this.mathsHelper);
    }
}
