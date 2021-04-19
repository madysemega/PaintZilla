import { Vec2 } from '@app/app/classes/vec2';
import { MathsHelper } from '@app/shapes/helper/maths-helper.service';
import { PolygonShape } from '@app/shapes/polygon-shape';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { ShapeRenderer } from './shape-renderer';

export class PolygonStrokeRenderer extends ShapeRenderer<PolygonShape> {
    constructor(shape: PolygonShape, properties: ShapeProperty[], private mathsHelper: MathsHelper) {
        super(shape, properties);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const CENTER_POINT: Vec2 = this.mathsHelper.computeCenter(this.shape.bottomRight, this.shape.topLeft);

        const SIZE = Math.abs(this.squarePoint(CENTER_POINT, this.shape.bottomRight));

        ctx.beginPath();
        ctx.moveTo(
            CENTER_POINT.x + SIZE * Math.cos((2 * Math.PI) / this.shape.numberSides),
            CENTER_POINT.y + SIZE * Math.sin((2 * Math.PI) / this.shape.numberSides),
        );

        for (let i = 2; i <= this.shape.numberSides; i++) {
            ctx.lineTo(
                CENTER_POINT.x + SIZE * Math.cos((i * 2 * Math.PI) / this.shape.numberSides),
                CENTER_POINT.y + SIZE * Math.sin((i * 2 * Math.PI) / this.shape.numberSides),
            );
        }
        ctx.closePath();
        ctx.stroke();
    }

    clone(): ShapeRenderer<PolygonShape> {
        return new PolygonStrokeRenderer(this.getShapeCopy(), this.getPropertiesCopy(), this.mathsHelper);
    }

    squarePoint(startPoint: Vec2, endPoint: Vec2): number {
        const COMP_X = endPoint.x - startPoint.x;
        const COMP_Y = endPoint.y - startPoint.y;
        const COMP = Math.abs(COMP_X) < Math.abs(COMP_Y) ? COMP_X : COMP_Y;
        return COMP;
    }
}
