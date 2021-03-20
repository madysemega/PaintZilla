import { Injectable } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { SelectionHandlerService } from '@app/tools/services/selection/selection-base/selection-handler.service';
import { RectangleSelectionHelperService } from './rectangle-selection-helper.service';

export enum ResizingMode {
    off = 0,
    towardsRight = 1,
    towardsLeft = 2,
    towardsTop = 3,
    towardsBottom = 4,
}

@Injectable({
    providedIn: 'root',
})
export class RectangleSelectionHandlerService extends SelectionHandlerService {
    constructor(drawingService: DrawingService, protected selectionHelper: RectangleSelectionHelperService) {
        super(drawingService, selectionHelper);
    }

    extractSelectionFromSource(sourceCanvas: HTMLCanvasElement): void {
        this.extract(sourceCanvas, this.selectionCtx, false);
    }

    extract(source: HTMLCanvasElement, destination: CanvasRenderingContext2D, fillItWhite: boolean): void {
        destination.save();
        destination.beginPath();
        destination.rect(this.topLeftRelativeToMiddle.x, this.topLeftRelativeToMiddle.y, this.originalWidth, this.originalHeight);
        destination.clip();

        destination.imageSmoothingEnabled = false;

        if (fillItWhite) {
            destination.fillStyle = 'white';
            destination.fill();
        } else {
            destination.drawImage(
                source,
                this.topLeftRelativeToMiddle.x - this.originalTopLeftOnBaseCanvas.x,
                this.topLeftRelativeToMiddle.y - this.originalTopLeftOnBaseCanvas.y,
            );
        }

        destination.closePath();
        destination.restore();
    }

    whiteFillAtOriginalLocation(): void {
        this.selectionHelper.drawPostSelectionRectangle(this.originalTopLeftOnBaseCanvas, this.originalWidth, this.originalHeight);
    }
}
