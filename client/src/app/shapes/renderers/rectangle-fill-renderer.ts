
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { BoxShape } from '../box-shape';
import { ShapeRenderer } from './shape-renderer';

export class RectangleFillRenderer extends ShapeRenderer<BoxShape> {
    constructor(shape: BoxShape, properties: ShapeProperty[]) {
        super(shape, properties);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.rect(this.shape.topLeft.x, this.shape.topLeft.y, this.shape.width, this.shape.height);
        ctx.fill();
    }

    clone(): ShapeRenderer<BoxShape> {
        return new RectangleFillRenderer(this.getShapeCopy(), this.getPropertiesCopy());
    }
}
