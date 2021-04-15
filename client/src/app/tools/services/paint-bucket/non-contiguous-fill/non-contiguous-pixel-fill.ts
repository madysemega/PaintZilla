import { Vec2 } from '@app/app/classes/vec2';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { FloodFill } from '@app/tools/services/paint-bucket/flood-fill/flood-fill';

export class NonContiguousPixelFill extends FloodFill {
    fill(imageData: ImageData, onClickCoords: Vec2, fillColour: Colour, tolerance: number): number[] {
        this.initializeAttributes(imageData, onClickCoords, fillColour, tolerance);
        let startX = 0;
        let startY = 0;
        while (startY < this.height) {
            while (startX < this.width) {
                if (this.isValidPixel(startX, startY, this.replacedColour)) {
                    this.setPixel(startX, startY);
                }
                startX++;
            }
            startY++;
            startX = 0;
        }
        return this.result;
    }
}
