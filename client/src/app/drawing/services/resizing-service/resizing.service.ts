import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import * as Constants from '@app/drawing/constants/drawing-constants';
import { ResizingType } from '@app/drawing/enums/resizing-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class ResizingService {
    rightResizerEnabled: boolean = false;
    downResizerEnabled: boolean = false;
    rightDownResizerEnabled: boolean = false;
    canvasResize: Vec2 = { x: Constants.DEFAULT_WIDTH, y: Constants.DEFAULT_HEIGHT };
    image: ImageData;

    constructor(public drawingService: DrawingService) {}

    isResizing(event: MouseEvent): boolean {
        return this.downResizerEnabled || this.rightDownResizerEnabled || this.rightResizerEnabled;
    }

    resizeCanvas(event: MouseEvent): void {
        if (this.rightResizerEnabled && this.canBeResizedHorizontally(event)) {
            this.canvasResize.x = event.offsetX;
        } else if (this.downResizerEnabled && this.canBeResizedVertically(event)) {
            this.canvasResize.y = event.offsetY;
        } else if (this.rightDownResizerEnabled) {
            if (this.canBeResizedHorizontally(event)) {
                this.canvasResize.x = event.offsetX;
            }
            if (this.canBeResizedVertically(event)) {
                this.canvasResize.y = event.offsetY;
            }
        }
        this.drawingService.canvas.style.zIndex = '2';
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.restorePreviewImageData();
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
    }

    disableResizer(): void {
        this.rightResizerEnabled = false;
        this.rightDownResizerEnabled = false;
        this.downResizerEnabled = false;
        this.drawingService.canvas.style.zIndex = '0';
        this.drawingService.fillCanvas(this.drawingService.baseCtx, this.canvasResize.x, this.canvasResize.y);
        this.restoreBaseImageData();
        this.updateCanvasSize();
    }

    restoreBaseImageData(): void {
        this.drawingService.baseCtx.putImageData(this.image, 0, 0);
    }

    updateCanvasSize(): void {
        this.drawingService.canvasSize.x = this.canvasResize.x;
        this.drawingService.canvasSize.y = this.canvasResize.y;
    }

    resetCanvasDimensions(): void {
        this.canvasResize.x = Constants.HALF_WINDOW_WIDTH;
        this.canvasResize.y = Constants.HALF_WINDOW_HEIGHT;
    }
}
