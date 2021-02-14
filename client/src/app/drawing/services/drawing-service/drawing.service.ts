import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';

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
    canvasSize: Vec2;

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Taken from https://stackoverflow.com/questions/17386707/how-to-check-if-a-canvas-is-blank
    isCanvasEmpty(): boolean {
        const originX = 0;
        const originY = 0;
        this.canvasIsEmpty = !this.baseCtx
            .getImageData(originX, originY, this.canvas.width, this.canvas.height)
            .data.some((channel) => channel !== BLANK);
        return this.canvasIsEmpty;
    }

    fillCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }
}
