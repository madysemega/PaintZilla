import { Vec2 } from '@app/app/classes/vec2';
import { PolygonShape } from '@app/shapes/polygon-shape';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { ShapeRenderer } from './shape-renderer';

export class PolygonFillRenderer extends ShapeRenderer<PolygonShape> {
    constructor(shape: PolygonShape, properties: ShapeProperty[]) {
        super(shape, properties);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const CENTER_POINT: Vec2 = {
            x: (this.shape.bottomRight.x + this.shape.topLeft.x) / 2,
            y: (this.shape.bottomRight.y + this.shape.topLeft.y) / 2,
        };

        const SIZE_BEFORE_CONTOUR = this.squarePoint(CENTER_POINT, this.shape.bottomRight);
        let size;
        if (SIZE_BEFORE_CONTOUR > 0) size = Math.abs(SIZE_BEFORE_CONTOUR - this.shape.contourWidth / 2);
        else size = Math.abs(SIZE_BEFORE_CONTOUR + this.shape.contourWidth / 2);

        ctx.beginPath();

        ctx.moveTo(
            CENTER_POINT.x + size * Math.cos((2 * Math.PI) / this.shape.numberSides),
            CENTER_POINT.y + size * Math.sin((2 * Math.PI) / this.shape.numberSides),
        );

        for (let i = 2; i <= this.shape.numberSides; i++) {
            ctx.lineTo(
                CENTER_POINT.x + size * Math.cos((i * 2 * Math.PI) / this.shape.numberSides),
                CENTER_POINT.y + size * Math.sin((i * 2 * Math.PI) / this.shape.numberSides),
            );
        }
        ctx.closePath();
        ctx.fill();
    }

    clone(): ShapeRenderer<PolygonShape> {
        return new PolygonFillRenderer(this.getShapeCopy(), this.getPropertiesCopy());
    }

    squarePoint(startPoint: Vec2, endPoint: Vec2): number {
        const COMP_X = endPoint.x - startPoint.x;
        const COMP_Y = endPoint.y - startPoint.y;
        const COMP = Math.abs(COMP_X) < Math.abs(COMP_Y) ? COMP_X : COMP_Y;
        return COMP;
    }
}
