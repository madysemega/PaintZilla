import { BoxShape } from '@app/shapes/box-shape';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { ShapeRenderer } from './shape-renderer';

export class PolygonStrokeRenderer extends ShapeRenderer<BoxShape> {
    constructor(shape: BoxShape, properties: ShapeProperty[]) {
        super(shape, properties);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.rect(this.shape.topLeft.x, this.shape.topLeft.y, this.shape.width, this.shape.height);
        ctx.fill();
    }

    clone(): ShapeRenderer<BoxShape> {
        return new PolygonStrokeRenderer(this.getShapeCopy(), this.getPropertiesCopy());
    }
}
