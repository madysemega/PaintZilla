import { Injectable } from '@angular/core';
import { sleep } from '@app/app/classes/sleep';
import { Vec2 } from '@app/app/classes/vec2';
import * as Constants from '@app/drawing/constants/drawing-constants';
import { ResizingType } from '@app/drawing/enums/resizing-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { UserActionResizeDrawingSurface } from '@app/history/user-actions/user-action-resize-drawing-surface';
import { MagnetismService } from '@app/magnetism/magnetism.service';

@Injectable({
    providedIn: 'root',
})
export class ResizingService {
    rightResizerEnabled: boolean = false;
    downResizerEnabled: boolean = false;
    rightDownResizerEnabled: boolean = false;
    canvasResize: Vec2;
    image: ImageData;
    imageGrid: ImageData;

    constructor(public drawingService: DrawingService, private historyService: HistoryService, public magnetism:MagnetismService) {
        this.canvasResize = this.drawingService.canvasResize;
    }

    isResizing(): boolean {
        return this.downResizerEnabled || this.rightDownResizerEnabled || this.rightResizerEnabled;
    }

    resizeCanvas(event: MouseEvent): void {
        const resizeHorizontally = this.canBeResizedHorizontally(event) && (this.rightResizerEnabled || this.rightDownResizerEnabled);
        const resizeVertically = this.canBeResizedVertically(event) && (this.downResizerEnabled || this.rightDownResizerEnabled);

        if (resizeHorizontally) {
            this.canvasResize.x = event.offsetX;
        }
        if (resizeVertically) {
            this.canvasResize.y = event.offsetY;
        }

        this.drawingService.updateCanvasStyle();
        this.restorePreviewImageData();
        this.restoreGridImageData();
    }

    canBeResizedHorizontally(event: MouseEvent): boolean {
        return event.offsetX > Constants.MINIMUM_SIZE && event.offsetX < Constants.MAX_WIDTH;
    }

    canBeResizedVertically(event: MouseEvent): boolean {
        return event.offsetY > Constants.MINIMUM_SIZE && event.offsetY < Constants.MAX_HEIGHT;
    }

    restorePreviewImageData(): void {
        this.drawingService.previewCtx.putImageData(this.image, 0, 0);
    }

    activateResizer(button: string): void {
        this.saveCurrentImage();
        this.rightResizerEnabled = button === ResizingType.RIGHT;
        this.downResizerEnabled = button === ResizingType.DOWN;
        this.rightDownResizerEnabled = button === ResizingType.RIGHTDOWN;
    }

    saveCurrentImage(): void {
        this.image = this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvasSize.x, this.drawingService.canvasSize.y);
        this.imageGrid = this.drawingService.gridCtx.getImageData(0, 0, this.drawingService.canvasSize.x, this.drawingService.canvasSize.y);
    }

    disableResizer(): void {
        this.rightResizerEnabled = false;
        this.rightDownResizerEnabled = false;
        this.downResizerEnabled = false;
        this.updateCanvasSize();
        this.drawingService.restoreCanvasStyle();
        this.restoreBaseImageData();
        this.restoreGridImageData();
    }

    finalizeResizingEvent(): void {
        this.historyService.do(
            new UserActionResizeDrawingSurface(this.canvasResize.x, this.canvasResize.y, async (width: number, height: number) => {
                this.saveCurrentImage();

                this.drawingService.resizeDrawingSurface(width, height);
                await sleep();

                this.drawingService.resetDrawingSurfaceColour();
                this.restoreBaseImageData();
                this.restoreGridImageData();
                this.magnetism.toggleGrid();
                this.magnetism.toggleGrid();
            }),
        );
    }

    updateCanvasSize(): void {
        this.drawingService.canvasSize.x = this.canvasResize.x;
        this.drawingService.canvasSize.y = this.canvasResize.y;
    }

    restoreBaseImageData(): void {
        this.drawingService.baseCtx.putImageData(this.image, 0, 0);
    }
    restoreGridImageData(): void {
        this.drawingService.gridCtx.putImageData(this.imageGrid, 0, 0);
    }

    resetCanvasDimensions(): void {
        this.canvasResize.x = Constants.DEFAULT_WIDTH;
        this.canvasResize.y = Constants.DEFAULT_HEIGHT;
    }
}
