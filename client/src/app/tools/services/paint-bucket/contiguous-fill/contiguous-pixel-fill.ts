import { Vec2 } from '@app/app/classes/vec2';
import { Colour } from '@app/colour-picker/classes/colours.class';
import * as Constants from '@app/tools/constants/flood-fill.constants';
import { FloodFill } from '@app/tools/services/paint-bucket/flood-fill/flood-fill';

type Line = [number, number, number, number];
export class ContiguousPixelFill extends FloodFill {
    private queue: Line[] = [];
    private start: number;
    private end: number;
    fill(imageData: ImageData, onClickCoords: Vec2, fillColour: Colour, tolerance: number): number[] {
        onClickCoords = { x: Math.round(onClickCoords.x), y: Math.round(onClickCoords.y) };
        this.initializeAttributes(imageData, onClickCoords, fillColour, tolerance);
        let line: Line | undefined = [onClickCoords.x, onClickCoords.x, onClickCoords.y, Constants.INVALID_INDEX];
        while (line) {
            const [x1, x2, y1, dy] = line;
            onClickCoords.x = x1;
            onClickCoords.y = y1;
            while (onClickCoords.x !== Constants.INVALID_INDEX && onClickCoords.x <= x2) {
                [this.start, this.end] = this.fillAt(onClickCoords.x, onClickCoords.y);
                if (this.start !== Constants.INVALID_INDEX) {
                    this.fillQueue(x1, x2, onClickCoords.y, dy);
                }
                if (this.end === Constants.INVALID_INDEX && onClickCoords.x <= x2) {
                    onClickCoords.x++;
                } else {
                    onClickCoords.x = this.end + 1;
                }
            }
            line = this.queue.shift();
        }
        return this.result;
    }

    fillQueue(x1: number, x2: number, y: number, dy: number): void {
        if (this.start >= x1 && this.end <= x2 && dy !== Constants.INVALID_INDEX) {
            if (dy < y && y + 1 < this.height) {
                this.queue.push([this.start, this.end, y + 1, y]);
            }
            if (dy > y && y > 0) {
                this.queue.push([this.start, this.end, y - 1, y]);
            }
        } else {
            if (y > 0) {
                this.queue.push([this.start, this.end, y - 1, y]);
            }
            if (y + 1 < this.height) {
                this.queue.push([this.start, this.end, y + 1, y]);
            }
        }
    }

    fillAt(x: number, y: number): [number, number] {
        if (!this.isValidPixel(x, y, this.replacedColour)) {
            return [Constants.INVALID_INDEX, Constants.INVALID_INDEX];
        }
        this.setPixel(x, y);
        let minX = x;
        let maxX = x;
        let currentNeighbour = this.getLeftNeighbour(minX, y);
        while (this.isValidPixel(currentNeighbour.x, currentNeighbour.y, this.replacedColour)) {
            this.setPixel(currentNeighbour.x, currentNeighbour.y);
            minX = currentNeighbour.x;
            currentNeighbour = this.getLeftNeighbour(minX, y);
        }
        currentNeighbour = this.getRightNeighbour(maxX, y);
        while (this.isValidPixel(currentNeighbour.x, currentNeighbour.y, this.replacedColour)) {
            this.setPixel(currentNeighbour.x, currentNeighbour.y);
            maxX = currentNeighbour.x;
            currentNeighbour = this.getRightNeighbour(maxX, y);
        }
        return [minX, maxX];
    }

    private getLeftNeighbour(x: number, y: number): Vec2 {
        return { x: x - 1, y };
    }

    private getRightNeighbour(x: number, y: number): Vec2 {
        return { x: x + 1, y };
    }
}
