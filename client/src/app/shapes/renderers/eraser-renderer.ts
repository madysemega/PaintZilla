import { Vec2 } from '@app/app/classes/vec2';
import { EraserShape } from '@app/shapes/eraser-shape';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { ShapeRenderer } from './shape-renderer';

export class EraserRenderer extends ShapeRenderer<EraserShape> {
    constructor(shape: EraserShape, properties: ShapeProperty[]) {
        super(shape, properties);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.shape.vertices.forEach((point, index) => {
            if (index === 0) {
                ctx.beginPath();
                ctx.rect(point.x, point.y, 0, 0);
                ctx.stroke();
            } else {
                const previousPoint = this.shape.vertices[index - 1];

                const isMovementRightward = point.x > previousPoint.x;
                const isMovementDownward = point.y > previousPoint.y;

                if (isMovementRightward && isMovementDownward) {
                    this.drawRightwardPolygon(ctx, previousPoint, point, this.shape.strokeWidth);
                } else if (!isMovementRightward && isMovementDownward) {
                    this.drawLeftwardPolygon(ctx, previousPoint, point, this.shape.strokeWidth);
                } else if (!isMovementRightward && !isMovementDownward) {
                    this.drawRightwardPolygon(ctx, point, previousPoint, this.shape.strokeWidth);
                } else {
                    this.drawLeftwardPolygon(ctx, point, previousPoint, this.shape.strokeWidth);
                }
            }
        });
    }

    drawRightwardPolygon(ctx: CanvasRenderingContext2D, topLeft: Vec2, bottomRight: Vec2, width: number): void {
        const HALF_LINE_WIDTH = width / 2;

        ctx.beginPath();
        ctx.moveTo(topLeft.x - HALF_LINE_WIDTH, topLeft.y - HALF_LINE_WIDTH);
        ctx.lineTo(topLeft.x + HALF_LINE_WIDTH, topLeft.y - HALF_LINE_WIDTH);
        ctx.lineTo(bottomRight.x + HALF_LINE_WIDTH, bottomRight.y - HALF_LINE_WIDTH);
        ctx.lineTo(bottomRight.x + HALF_LINE_WIDTH, bottomRight.y + HALF_LINE_WIDTH);
        ctx.lineTo(bottomRight.x - HALF_LINE_WIDTH, bottomRight.y + HALF_LINE_WIDTH);
        ctx.lineTo(topLeft.x - HALF_LINE_WIDTH, topLeft.y + HALF_LINE_WIDTH);
        ctx.closePath();
        ctx.fill();
    }

    drawLeftwardPolygon(ctx: CanvasRenderingContext2D, topRight: Vec2, bottomLeft: Vec2, width: number): void {
        const HALF_LINE_WIDTH = width / 2;

        ctx.beginPath();
        ctx.moveTo(topRight.x + HALF_LINE_WIDTH, topRight.y - HALF_LINE_WIDTH);
        ctx.lineTo(topRight.x + HALF_LINE_WIDTH, topRight.y + HALF_LINE_WIDTH);
        ctx.lineTo(bottomLeft.x + HALF_LINE_WIDTH, bottomLeft.y + HALF_LINE_WIDTH);
        ctx.lineTo(bottomLeft.x - HALF_LINE_WIDTH, bottomLeft.y + HALF_LINE_WIDTH);
        ctx.lineTo(bottomLeft.x - HALF_LINE_WIDTH, bottomLeft.y - HALF_LINE_WIDTH);
        ctx.lineTo(topRight.x - HALF_LINE_WIDTH, topRight.y - HALF_LINE_WIDTH);
        ctx.closePath();
        ctx.fill();
    }

    clone(): ShapeRenderer<EraserShape> {
        return new EraserRenderer(this.getShapeCopy(), this.getPropertiesCopy());
    }
}
