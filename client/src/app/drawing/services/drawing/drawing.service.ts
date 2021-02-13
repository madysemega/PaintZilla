import { Injectable } from '@angular/core';

const BLANK = 0;

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    previewCanvas: HTMLCanvasElement;
    canvasIsEmpty: boolean = true;

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Taken from https://stackoverflow.com/questions/17386707/how-to-check-if-a-canvas-is-blank
    isCanvasEmpty(): boolean {
        this.canvasIsEmpty = false;
        if (this.canvas) {
            const originX = 0;
            const originY = 0;
            this.canvasIsEmpty = !this.baseCtx
                .getImageData(originX, originY, this.canvas.width, this.canvas.height)
                .data.some((channel) => channel !== BLANK);
        }
        return this.canvasIsEmpty;
    }

    setCanvasSize(width: number, height: number): void {
        this.canvas.width = width;
        this.canvas.height = height;
        this.previewCanvas.width = width;
        this.previewCanvas.height = height;
    }
}
