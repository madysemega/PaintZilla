import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { CursorType } from '@app/drawing/classes/cursor-type';
import * as Constants from '@app/drawing/constants/drawing-constants';

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

    setCursorType(type: CursorType): void {
        if (this.previewCanvas) {
            this.previewCanvas.style.setProperty('cursor', type as string);
        }
    }

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Taken from https://stackoverflow.com/questions/17386707/how-to-check-if-a-canvas-is-blank
    isCanvasEmpty(): boolean {
        const originX = 0;
        const originY = 0;
        this.canvasIsEmpty = !this.baseCtx
            .getImageData(originX, originY, this.canvas.width, this.canvas.height)
            .data.some((channel) => channel !== Constants.BLANK);
        return this.canvasIsEmpty;
    }

    fillCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.fillStyle = Constants.CTX_COLOR;
        ctx.fill();
        ctx.closePath();
    }

    updateCanvasStyle(): void {
        this.canvas.style.zIndex = Constants.SUPERIOR_Z_INDEX;
        this.canvas.style.background = Constants.PREVIEW_CTX_COLOR;
        this.fillCanvas(this.baseCtx, this.canvasSize.x, this.canvasSize.y);
    }

    restoreCanvasStyle(): void {
        this.canvas.style.zIndex = Constants.INFERIOR_Z_INDEX;
        this.canvas.style.background = Constants.CTX_COLOR;
        this.canvas.style.background = Constants.CTX_COLOR;
    }
}
