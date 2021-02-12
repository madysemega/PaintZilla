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
    private image: ImageData;

    constructor(private drawingService: DrawingService) {}

    isResizing(event: MouseEvent): boolean {
        return this.downResizerEnabled || this.rightDownResizerEnabled || this.rightResizerEnabled;
    }

    resizeCanvas(event: MouseEvent): void {
        if (this.rightResizerEnabled && event.offsetX > Constants.MINIMUM_SIZE && event.offsetX < Constants.MAX_WIDTH) {
            this.canvasResize.x = event.offsetX;
        } else if (this.downResizerEnabled && event.offsetY > Constants.MINIMUM_SIZE && event.offsetY < Constants.MAX_HEIGHT) {
            this.canvasResize.y = event.offsetY;
        } else if (this.rightDownResizerEnabled) {
            if (event.offsetX > Constants.MINIMUM_SIZE && event.offsetX < Constants.MAX_WIDTH) {
                this.canvasResize.x = event.offsetX;
            }
            if (event.offsetY > Constants.MINIMUM_SIZE && event.offsetY < Constants.MAX_HEIGHT) {
                this.canvasResize.y = event.offsetY;
            }
        }
        this.restorePreviewImageData();
    }

    restorePreviewImageData(): void {
        this.drawingService.previewCtx.putImageData(this.image, 0, 0);
        this.drawingService.canvas.style.border = Constants.BORDER_RESISING_STYLE;
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
        this.restoreBaseImageData();
        this.updateCanvasSize();
        this.rightResizerEnabled = false;
        this.rightDownResizerEnabled = false;
        this.downResizerEnabled = false;
    }

    restoreBaseImageData(): void {
        this.drawingService.baseCtx.putImageData(this.image, 0, 0);
    }

    updateCanvasSize(): void {
        this.drawingService.canvasSize.x = this.canvasResize.x;
        this.drawingService.canvasSize.y = this.canvasResize.y;
        this.drawingService.canvas.style.border = Constants.BORDER_INITIAL_STYLE;
    }
}
