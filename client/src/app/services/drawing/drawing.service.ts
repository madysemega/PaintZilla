import { Injectable } from '@angular/core';

const BLANK = 0;

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Taken from https://stackoverflow.com/questions/17386707/how-to-check-if-a-canvas-is-blank
    // Move this somewhere else?
    isCanvasEmpty(): boolean {
        const originX: number = 0;
        const originY: number = 0;
        return !this.baseCtx
                .getImageData(originX, originY, this.canvas.width, this.canvas.height).data
                .some(channel => channel !== BLANK);
    }
}
