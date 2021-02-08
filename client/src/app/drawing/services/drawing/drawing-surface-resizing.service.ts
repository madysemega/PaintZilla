import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { CanvasAttributes } from '../../constants/canvas-attributes';

@Injectable({
    providedIn: 'root',
})
export class DrawingSurfaceResizingService {
    isResizingHorizontally: boolean = false;
    isResizingVertically: boolean = false;
    isResizingDiagonally: boolean = false;
    canvasResize: Vec2 = { x: this.canvasAttributes.DEFAULT_WIDTH, y: this.canvasAttributes.DEFAULT_HEIGHT };

    constructor(private canvasAttributes: CanvasAttributes) {}

    checkIfOnBorder(event: MouseEvent): void {
        const canvas = document.getElementsByTagName('canvas');
        if (canvas != null) {
            const isOnRightBorder = this.isOnBorderX(event);
            const isOnBottomBorder = this.isOnBorderY(event);
            if (isOnBottomBorder && isOnRightBorder) {
                canvas[1].style.cursor = 'nwse-resize';
            } else if (isOnRightBorder) {
                canvas[1].style.cursor = 'ew-resize';
            } else if (isOnBottomBorder) {
                canvas[1].style.cursor = 'ns-resize';
            } else {
                canvas[1].style.cursor = 'crosshair';
            }
        }
    }
    isResizing(event: MouseEvent): boolean {
        const resizeX = this.isResizingX(event);
        const resizeY = this.isResizingY(event);
        if (resizeX && resizeY) {
            this.isResizingVertically = false;
            this.isResizingHorizontally = false;
            this.isResizingDiagonally = true;
            return true;
        } else if (resizeX || resizeY) {
            return true;
        }
        return false;
    }

    isOnBorderX(event: MouseEvent): boolean {
        if (
            event.offsetX >= this.canvasResize.x - this.canvasAttributes.BORDER_SIZE &&
            event.offsetX <= this.canvasResize.x + this.canvasAttributes.BORDER_SIZE
        ) {
            return true;
        }
        return false;
    }

    isOnBorderY(event: MouseEvent): boolean {
        if (
            event.offsetY >= this.canvasResize.y - this.canvasAttributes.BORDER_SIZE &&
            event.offsetY <= this.canvasResize.y + this.canvasAttributes.BORDER_SIZE
        ) {
            return true;
        }
        return false;
    }

    isResizingX(event: MouseEvent): boolean {
        if (this.isOnBorderX(event)) {
            this.isResizingHorizontally = true;
            return true;
        }
        return false;
    }

    isResizingY(event: MouseEvent): boolean {
        if (this.isOnBorderY(event)) {
            this.isResizingVertically = true;
            return true;
        }
        return false;
    }

    resizingCanvas(event: MouseEvent): void {
        if (this.isResizingHorizontally && event.offsetX > this.canvasAttributes.MINIMUM_SIZE) {
            this.canvasResize.x = event.offsetX;
        } else if (this.isResizingVertically && event.offsetY > this.canvasAttributes.MINIMUM_SIZE) {
            this.canvasResize.y = event.offsetY;
        } else if (this.isResizingDiagonally) {
            if (event.offsetX > this.canvasAttributes.MINIMUM_SIZE) {
                this.canvasResize.x = event.offsetX;
            }
            if (event.offsetY > this.canvasAttributes.MINIMUM_SIZE) {
                this.canvasResize.y = event.offsetY;
            }
        }
    }

    resizeCanvasX(): number {
        this.isResizingHorizontally = false;
        return this.canvasResize.x;
    }

    resizeCanvasY(): number {
        this.isResizingVertically = false;
        this.isResizingDiagonally = false;
        return this.canvasResize.y;
    }

    restoreImage(ctx: CanvasRenderingContext2D, url: string): void {
        const image = new Image();
        image.src = url;
        ctx.drawImage(image, 0, 0);
    }
}
