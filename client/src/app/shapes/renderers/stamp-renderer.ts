import { BoxShape } from '@app/shapes/box-shape';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { ShapeRenderer } from './shape-renderer';

export class StampRenderer extends ShapeRenderer<BoxShape> {
    draw(ctx: CanvasRenderingContext2D): void {
        const BASE_IMAGE = new Image();
        const SIZE = this.shape.bottomRight.x - this.shape.topLeft.x;
        BASE_IMAGE.src = './assets/icons/black-stamp.svg';
        ctx.drawImage(BASE_IMAGE, this.shape.topLeft.x, this.shape.topLeft.y, SIZE, SIZE);
        console.log(SIZE);
    }
    clone(): ShapeRenderer<BoxShape> {
        return new StampRenderer(this.getShapeCopy(), this.getPropertiesCopy());
    }
    constructor(shape: BoxShape, properties: ShapeProperty[]) {
        super(shape, properties);
    }
}
