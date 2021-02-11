import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import * as CanvasAttributes from '../../constants/canvas-attributes';
import { ResizingService } from './resizing.service';
@Injectable({
    providedIn: 'root',
})
export class DrawingSurfaceResizingService {
    isResizingHorizontally: boolean = false;
    isResizingVertically: boolean = false;
    isResizingDiagonally: boolean = false;
    canvasResize: Vec2 = { x: CanvasAttributes.DEFAULT_WIDTH, y: CanvasAttributes.DEFAULT_HEIGHT };
    constructor(private resizingService: ResizingService) {}

    isResizing(event: MouseEvent): boolean {
        if (this.resizingService.downResizerEnabled || this.resizingService.rightDownResizerEnabled || this.resizingService.rightResizerEnabled) {
            return true;
        }
        return false;
    }

    resizingCanvas(event: MouseEvent): void {
        if (this.resizingService.rightResizerEnabled && event.offsetX > CanvasAttributes.MINIMUM_SIZE && event.offsetX < CanvasAttributes.MAX_WIDTH) {
            this.canvasResize.x = event.offsetX;
        } else if (
            this.resizingService.downResizerEnabled &&
            event.offsetY > CanvasAttributes.MINIMUM_SIZE &&
            event.offsetY < CanvasAttributes.MAX_HEIGHT
        ) {
            this.canvasResize.y = event.offsetY;
        } else if (this.resizingService.rightDownResizerEnabled) {
            if (event.offsetX > CanvasAttributes.MINIMUM_SIZE && event.offsetX < CanvasAttributes.MAX_WIDTH) {
                this.canvasResize.x = event.offsetX;
            }
            if (event.offsetY > CanvasAttributes.MINIMUM_SIZE && event.offsetY < CanvasAttributes.MAX_HEIGHT) {
                this.canvasResize.y = event.offsetY;
            }
        }
    }

    resizeCanvasX(): number {
        return this.canvasResize.x;
    }

    resizeCanvasY(): number {
        return this.canvasResize.y;
    }

    activateResizer(button: string): void {
        if (button === 'right') this.resizingService.rightResizerEnabled = true;
        else if (button === 'down') this.resizingService.downResizerEnabled = true;
        else if (button === 'rightDown') this.resizingService.rightDownResizerEnabled = true;
    }

    disableResizer(): void {
        this.resizingService.rightResizerEnabled = false;
        this.resizingService.rightDownResizerEnabled = false;
        this.resizingService.downResizerEnabled = false;
    }
}
