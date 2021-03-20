import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { ContouredBoxShape } from '../contoured-box-shape';
import { ShapeRenderer } from './shape-renderer';

export class RectangleStrokeRenderer extends ShapeRenderer<ContouredBoxShape> {
    constructor(shape: ContouredBoxShape, properties: ShapeProperty[]) {
        super(shape, properties);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.rect(this.shape.topLeft.x - this.shape.contourWidth/2, 
            this.shape.topLeft.y-this.shape.contourWidth/2, 
            this.shape.width+this.shape.contourWidth, 
            this.shape.height+this.shape.contourWidth);
        ctx.stroke();
    }

    clone(): ShapeRenderer<ContouredBoxShape> {
        return new RectangleStrokeRenderer(this.getShapeCopy(), this.getPropertiesCopy());
    }
}
