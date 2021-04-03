import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { StampShape } from '@app/shapes/stamp-shape';
import { ShapeRenderer } from './shape-renderer';

export class StampRenderer extends ShapeRenderer<StampShape> {
    constructor(shape: StampShape, properties: ShapeProperty[]) {
        super(shape, properties);
    }
    draw(ctx: CanvasRenderingContext2D): void {
        const SIZE = this.shape.bottomRight.x - this.shape.topLeft.x;
        const CENTER_X = this.shape.topLeft.x - SIZE / 2;
        const CENTER_Y = this.shape.topLeft.y - SIZE / 2;
        ctx.save();
        ctx.translate(this.shape.topLeft.x, this.shape.topLeft.y);
        ctx.rotate(this.shape.angle);
        ctx.translate(-this.shape.topLeft.x, -this.shape.topLeft.y);
        ctx.drawImage(this.shape.image, CENTER_X, CENTER_Y, SIZE, SIZE);
        ctx.restore();
    }
    clone(): ShapeRenderer<StampShape> {
        return new StampRenderer(this.getShapeCopy(), this.getPropertiesCopy());
    }
}
