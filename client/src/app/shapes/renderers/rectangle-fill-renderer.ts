import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { ContouredBoxShape } from '../contoured-box-shape';
import { ShapeRenderer } from './shape-renderer';

export class RectangleFillRenderer extends ShapeRenderer<ContouredBoxShape> {
    constructor(shape: ContouredBoxShape, properties: ShapeProperty[]) {
        super(shape, properties);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const HALF_CONTOUR_WIDTH = this.shape.contourWidth / 2;

        ctx.beginPath();
        ctx.rect(
            this.shape.topLeft.x + HALF_CONTOUR_WIDTH,
            this.shape.topLeft.y + HALF_CONTOUR_WIDTH,
            this.shape.width - this.shape.contourWidth,
            this.shape.height - this.shape.contourWidth
        );
        ctx.fill();
    }

    clone(): ShapeRenderer<ContouredBoxShape> {
        return new RectangleFillRenderer(this.getShapeCopy(), this.getPropertiesCopy());
    }
}
