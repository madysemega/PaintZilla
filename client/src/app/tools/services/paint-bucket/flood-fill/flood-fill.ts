import { Colour } from '@app/colour-picker/classes/colours.class';
import * as Constants from '@app/tools/services/paint-bucket/paint-bucket.constants';
export abstract class FloodFill {
    // tslint:disable-next-line:variable-name
    protected _result: number[] = [];
    protected pixels: Uint8ClampedArray;
    protected width: number;
    protected height: number;
    protected replacedColour: Colour;
    protected replacementColour: Colour;
    protected tolerance: number;
    protected visited: boolean[][];
    abstract fill(parameters: Constants.fillParameters): number[];

    initializeAttributes(parameters: Constants.fillParameters): void {
        this.pixels = parameters.imageData.data;
        this.width = parameters.imageData.width;
        this.height = parameters.imageData.height;
        this.replacementColour = parameters.fillColour;
        this.replacedColour = this.getColourAtPixel(this.normalize(parameters.onClickCoords.x, parameters.onClickCoords.y));
        this.tolerance = parameters.tolerance / Constants.TO_PERCENTAGE;
        this.initializeVisitsArray();
    }

    private initializeVisitsArray(): void {
        this.visited = new Array<boolean[]>(this.height);
        for (let i = 0; i < this.height; i++) {
            this.visited[i] = new Array<boolean>(this.width);
            for (let j = 0; j < this.width; j++) {
                this.visited[i][j] = false;
            }
        }
    }

    colorMatch(x: number, y: number, replacementColour: Colour): boolean {
        const colourToReplace = this.getColourAtPixel(this.normalize(x, y));
        const alphas = replacementColour.getAlpha() - colourToReplace.getAlpha();
        const distance =
            this.colourChannelDistance(colourToReplace.getRed(), replacementColour.getRed(), alphas) +
            this.colourChannelDistance(colourToReplace.getGreen(), replacementColour.getGreen(), alphas) +
            this.colourChannelDistance(colourToReplace.getBlue(), replacementColour.getBlue(), alphas);
        const distancePercentage = distance / Constants.MAX_DISTANCE;
        return distancePercentage <= this.tolerance;
    }

    private colourChannelDistance(x: number, y: number, alpha: number): number {
        const black = x - y;
        const white = black + alpha;
        return Math.max(black * black, white * white);
    }

    getColourAtPixel(pixelIndex: number): Colour {
        const alpha = this.pixels[pixelIndex + Constants.ALPHA_INDEX];
        return new Colour(
            this.pixels[pixelIndex + Constants.RED_INDEX],
            this.pixels[pixelIndex + Constants.GREEN_INDEX],
            this.pixels[pixelIndex + Constants.BLUE_INDEX],
            alpha / Constants.MAX_RGBA,
        );
    }

    setPixel(x: number, y: number): void {
        const index = this.normalize(x, y);
        this._result.push(index);
        this.visited[y][x] = true;
        this.pixels[index + Constants.RED_INDEX] = this.replacementColour.getRed();
        this.pixels[index + Constants.GREEN_INDEX] = this.replacementColour.getGreen();
        this.pixels[index + Constants.BLUE_INDEX] = this.replacementColour.getBlue();
        this.pixels[index + Constants.ALPHA_INDEX] = this.replacementColour.getAlpha() * Constants.MAX_RGBA;
    }

    protected normalize(x: number, y: number): number {
        return Constants.PIXEL_LENGTH * (y * this.width + x);
    }

    inside(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    isValidPixel(x: number, y: number, replacedColour: Colour): boolean {
        return this.inside(x, y) && this.colorMatch(x, y, replacedColour) && !this.visited[y][x];
    }
    get result(): number[] {
        const result = this._result;
        this._result = [];
        return result;
    }
}
