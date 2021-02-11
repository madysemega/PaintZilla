import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import * as CanvasAttributes from '../../constants/Constants';
import { DrawingService } from './drawing.service';

@Injectable({
    providedIn: 'root',
})
export class ResizingService {
    rightResizerEnabled: boolean = false;
    downResizerEnabled: boolean = false;
    rightDownResizerEnabled: boolean = false;
    canvasResize: Vec2 = { x: CanvasAttributes.DEFAULT_WIDTH, y: CanvasAttributes.DEFAULT_HEIGHT };
    private image: ImageData;

    constructor(private drawingService: DrawingService) {}

    isResizing(event: MouseEvent): boolean {
        if (this.downResizerEnabled || this.rightDownResizerEnabled || this.rightResizerEnabled) {
            return true;
        }
        return false;
    }

    resizingCanvas(event: MouseEvent): void {
        if (this.rightResizerEnabled && event.offsetX > CanvasAttributes.MINIMUM_SIZE && event.offsetX < CanvasAttributes.MAX_WIDTH) {
            this.canvasResize.x = event.offsetX;
        } else if (this.downResizerEnabled && event.offsetY > CanvasAttributes.MINIMUM_SIZE && event.offsetY < CanvasAttributes.MAX_HEIGHT) {
            this.canvasResize.y = event.offsetY;
        } else if (this.rightDownResizerEnabled) {
            if (event.offsetX > CanvasAttributes.MINIMUM_SIZE && event.offsetX < CanvasAttributes.MAX_WIDTH) {
                this.canvasResize.x = event.offsetX;
            }
            if (event.offsetY > CanvasAttributes.MINIMUM_SIZE && event.offsetY < CanvasAttributes.MAX_HEIGHT) {
                this.canvasResize.y = event.offsetY;
            }
        }
        this.restorePreviewImageData();
    }

    activateResizer(button: string): void {
        this.image = this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvasSize.x, this.drawingService.canvasSize.y);
        if (button === 'right') this.rightResizerEnabled = true;
        else if (button === 'down') this.downResizerEnabled = true;
        else if (button === 'rightDown') this.rightDownResizerEnabled = true;
    }

    disableResizer(): void {
        this.restoreBaseImageData();
        this.updateCanvasSize();
        this.drawingService.canvas.style.border = 'medium none black';
        this.rightResizerEnabled = false;
        this.rightDownResizerEnabled = false;
        this.downResizerEnabled = false;
    }

    restoreBaseImageData(): void {
        this.drawingService.baseCtx.putImageData(this.image, 0, 0);
    }

    restorePreviewImageData(): void {
        this.drawingService.previewCtx.putImageData(this.image, 0, 0);
        this.drawingService.canvas.style.border = 'medium dotted black';
    }

    updateCanvasSize(){
        this.drawingService.canvasSize.x = this.canvasResize.x;
        this.drawingService.canvasSize.y = this.canvasResize.y;
    }

    
}
