import { FloodFill } from '@app/tools/services/paint-bucket/flood-fill/flood-fill';
import * as Constants from '@app/tools/services/paint-bucket/paint-bucket.constants';
export class NonContiguousPixelFill extends FloodFill {
    fill(parameters: Constants.fillParameters): number[] {
        this.initializeAttributes(parameters);
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
