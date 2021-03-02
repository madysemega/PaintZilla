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
    constructor(drawingService: DrawingService, protected selectionService: RectangleSelectionHelperService) {
        super(drawingService, selectionService);
    }

    extractSelectionFromSource(sourceCanvas: HTMLCanvasElement): void {
        this.selectionCtx.save();
        this.selectionCtx.beginPath();
        this.selectionCtx.rect(this.fixedTopLeft.x, this.fixedTopLeft.y, this.originalWidth, this.originalHeight);
        this.selectionCtx.clip();
        this.selectionCtx.imageSmoothingEnabled = false;
        this.selectionCtx.drawImage(
            sourceCanvas,
            this.fixedTopLeft.x - this.originalTopLeftOnBaseCanvas.x,
            this.fixedTopLeft.y - this.originalTopLeftOnBaseCanvas.y,
        );
        this.selectionCtx.closePath();
        this.selectionCtx.restore();
    }

    drawWhitePostSelection(): void {
        this.selectionService.drawPostSelectionRectangle(this.originalTopLeftOnBaseCanvas, this.originalWidth, this.originalHeight);
    }
}
