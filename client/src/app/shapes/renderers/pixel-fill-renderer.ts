import { Colour } from '@app/colour-picker/classes/colours.class';
import { PixelShape } from '@app/shapes/pixel-shape';
import { FillStyleProperty } from '@app/shapes/properties/fill-style-property';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import * as Constants from '@app/tools/services/paint-bucket/paint-bucket.constants';
import { ShapeRenderer } from './shape-renderer';
export class PixelFillRenderer extends ShapeRenderer<PixelShape> {
    fillColour: Colour;
    constructor(shape: PixelShape, properties: ShapeProperty[], public width: number, public height: number) {
        super(shape, properties);
        this.fillColour = (properties[0] as FillStyleProperty).colour;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const imageData = ctx.getImageData(0, 0, this.width, this.height);
        for (const index of this.shape.pixels) {
            imageData.data[index + Constants.RED_INDEX] = this.fillColour.getRed();
            imageData.data[index + Constants.GREEN_INDEX] = this.fillColour.getGreen();
            imageData.data[index + Constants.BLUE_INDEX] = this.fillColour.getBlue();
            imageData.data[index + Constants.ALPHA_INDEX] = this.fillColour.getAlpha() * Constants.MAX_RGBA;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    clone(): ShapeRenderer<PixelShape> {
        return new PixelFillRenderer(this.getShapeCopy(), this.getPropertiesCopy(), this.width, this.height);
    }
}
