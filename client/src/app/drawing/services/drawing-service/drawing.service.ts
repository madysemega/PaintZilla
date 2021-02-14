import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    canvasSize: Vec2;

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    fillCanvas(ctx: CanvasRenderingContext2D, width: number, height: number) {
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }
}
