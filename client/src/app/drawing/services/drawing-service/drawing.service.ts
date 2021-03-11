import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { CursorType } from '@app/drawing/classes/cursor-type';
import * as Constants from '@app/drawing/constants/drawing-constants';
import { HistoryService } from '@app/history/service/history.service';

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
    canvasResize: Vec2 = { x: Constants.DEFAULT_WIDTH, y: Constants.DEFAULT_HEIGHT };

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

    fillCanvas(ctx: CanvasRenderingContext2D, width: number, height: number, colour: string): void {
        ctx.fillStyle = colour;
        ctx.fillRect(0, 0, width, height);
    }

    updateCanvasStyle(): void {
        this.canvas.style.zIndex = Constants.SUPERIOR_Z_INDEX;
    }

    restoreCanvasStyle(): void {
        this.canvas.style.zIndex = Constants.INFERIOR_Z_INDEX;
        this.fillCanvas(this.baseCtx, this.canvasResize.x, this.canvasResize.y, Constants.CTX_COLOR);
    }

    constructor(historyService: HistoryService) {
        historyService.onUndo(() => {
            this.fillCanvas(this.baseCtx, Constants.DEFAULT_WIDTH, Constants.DEFAULT_HEIGHT, Constants.CTX_COLOR);
            this.restoreCanvasStyle();
        });
    }
}
