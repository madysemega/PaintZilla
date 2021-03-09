import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { SelectionHandlerService } from '@app/tools/services/selection/selection-base/selection-handler.service';
import { EllipseSelectionHelperService } from './ellipse-selection-helper.service';

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
export class EllipseSelectionHandlerService extends SelectionHandlerService {
    constructor(drawingService: DrawingService, protected selectionService: EllipseSelectionHelperService) {
        super(drawingService, selectionService);
    }

    extractSelectionFromSource(sourceCanvas: HTMLCanvasElement): void {
        this.extract(sourceCanvas, this.selectionCtx, false);
    }

    extract(source: HTMLCanvasElement, destination: CanvasRenderingContext2D, fillItWhite: boolean) {
        const originalRadii: Vec2 = { x: this.originalWidth / 2, y: this.originalHeight / 2 };
        
        destination.save();
        destination.beginPath();
        destination.ellipse(
            this.selection.width / 2,
            this.selection.height / 2,
            originalRadii.x,
            originalRadii.y,
            0,
            0,
            this.CIRCLE_MAX_ANGLE,
        );
        destination.clip();

        destination.imageSmoothingEnabled = false;

        if (fillItWhite) {
            destination.fillStyle = 'white';
            destination.fill();
        }

        else {
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
        const originalRadii: Vec2 = { x: this.originalWidth / 2, y: this.originalHeight / 2 };
        this.selectionService.whiteEllipseFill(this.originalCenter, originalRadii);
    }
}
