import { Vec2 } from '@app/app/classes/vec2';
import { FloodFill } from '@app/tools/services/paint-bucket/flood-fill/flood-fill';
import * as Constants from '@app/tools/services/paint-bucket/paint-bucket.constants';

export class ContiguousPixelFill extends FloodFill {
    private queue: Constants.Line[] = [];
    private start: number;
    private end: number;
    fill(parameters: Constants.fillParameters): number[] {
        parameters.onClickCoords = { x: Math.round(parameters.onClickCoords.x), y: Math.round(parameters.onClickCoords.y) };
        this.initializeAttributes(parameters);
        let x = parameters.onClickCoords.x;
        let y = parameters.onClickCoords.y;
        let line: Constants.Line | undefined = [x, x, y, Constants.INVALID_INDEX];
        while (line) {
            const [x1, x2, y1, dy] = line;
            x = x1;
            y = y1;
            while (x !== Constants.INVALID_INDEX && x <= x2) {
                [this.start, this.end] = this.fillAt(x, y);
                if (this.start !== Constants.INVALID_INDEX) {
                    this.fillQueue({ start: x1, end: x2, nextRow: y, parentRow: dy });
                }
                if (this.end === Constants.INVALID_INDEX && x <= x2) {
                    x++;
                } else {
                    x = this.end + 1;
                }
            }
            line = this.queue.shift();
        }
        return this.result;
    }

    fillQueue(toVisit: Constants.visitCoordinates): void {
        if (this.start >= toVisit.start && this.end <= toVisit.end && toVisit.parentRow !== Constants.INVALID_INDEX) {
            if (toVisit.parentRow < toVisit.nextRow && toVisit.parentRow + 1 < this.height) {
                this.queue.push([this.start, this.end, toVisit.nextRow + 1, toVisit.nextRow]);
            }
            if (toVisit.parentRow > toVisit.nextRow && toVisit.nextRow > 0) {
                this.queue.push([this.start, this.end, toVisit.nextRow - 1, toVisit.nextRow]);
            }
        } else {
            if (toVisit.nextRow > 0) {
                this.queue.push([this.start, this.end, toVisit.nextRow - 1, toVisit.nextRow]);
            }
            if (toVisit.nextRow + 1 < this.height) {
                this.queue.push([this.start, this.end, toVisit.nextRow + 1, toVisit.nextRow]);
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
