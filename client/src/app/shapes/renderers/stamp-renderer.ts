import { BoxShape } from '@app/shapes/box-shape';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { ShapeRenderer } from './shape-renderer';

export class StampRenderer extends ShapeRenderer<BoxShape> {
    constructor(shape: BoxShape, properties: ShapeProperty[]) {
        super(shape, properties);
    }
    draw(ctx: CanvasRenderingContext2D): void {
        const BASE_IMAGE = new Image();
        const SIZE = this.shape.bottomRight.x - this.shape.topLeft.x;
        BASE_IMAGE.src = './assets/icons/black-stamp.svg';
        // ctx.drawImage(BASE_IMAGE, this.shape.topLeft.x, this.shape.topLeft.y, SIZE, SIZE);
        BASE_IMAGE.onload = () => ctx.drawImage(BASE_IMAGE, this.shape.topLeft.x, this.shape.topLeft.y, SIZE, SIZE);
        console.log(this.shape);
    }
    clone(): ShapeRenderer<BoxShape> {
        return new StampRenderer(this.getShapeCopy(), this.getPropertiesCopy());
    }
}
