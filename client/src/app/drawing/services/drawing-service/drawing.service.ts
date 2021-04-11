import { EventEmitter, Injectable } from '@angular/core';
import { sleep } from '@app/app/classes/sleep';
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
    gridCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    previewCanvas: HTMLCanvasElement;
    gridCanvas: HTMLCanvasElement;
    canvasIsEmpty: boolean = true;
    canvasSize: Vec2;
    canvasResize: Vec2 = { x: Constants.DEFAULT_WIDTH, y: Constants.DEFAULT_HEIGHT };

    onDrawingSurfaceResize: EventEmitter<Vec2>;
    onDrawingLoaded: EventEmitter<boolean>;

    initialSize: Vec2;
    initialImage: CanvasImageSource | undefined;

    setCursorType(type: CursorType): void {
        if (this.previewCanvas) {
            this.previewCanvas.style.setProperty('cursor', type as string);
        }
    }

    clearCanvas(context: CanvasRenderingContext2D, size?: Vec2): void {
        if (size != undefined) {
            context.clearRect(0, 0, size.x, size.y);
        } else {
            context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
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
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.fillStyle = colour;
        ctx.fill();
        ctx.closePath();
    }

    updateCanvasStyle(): void {
        this.canvas.style.zIndex = Constants.SUPERIOR_Z_INDEX;
        this.fillCanvas(this.baseCtx, this.canvasResize.x, this.canvasResize.y, Constants.PREVIEW_CTX_COLOR);
    }

    restoreCanvasStyle(): void {
        this.canvas.style.zIndex = Constants.INFERIOR_Z_INDEX;
        this.fillCanvas(this.baseCtx, this.canvasResize.x, this.canvasResize.y, Constants.CTX_COLOR);
    }

    get currentDrawing(): string {
        return this.canvas.toDataURL('image/jpeg', 1.0);
    }

    resizeDrawingSurface(newWidth: number, newHeight: number): void {
        this.onDrawingSurfaceResize.emit({ x: newWidth, y: newHeight });
    }

    resetDrawingSurfaceDimensions(): void {
        this.resizeDrawingSurface(this.initialSize.x, this.initialSize.y);
    }

    resetDrawingSurfaceColour(): void {
        this.fillCanvas(this.baseCtx, this.canvasSize.x, this.canvasSize.y, Constants.CTX_COLOR);
    }

    async resetDrawingSurface(): Promise<void> {
        this.resetDrawingSurfaceDimensions();
        await sleep();
        this.resetDrawingSurfaceColour();
        this.drawInitialImage();
        this.onDrawingLoaded.emit();
    }

    drawInitialImage(): void {
        if (this.initialImage != undefined) {
            this.baseCtx.drawImage(this.initialImage, 0, 0);
        }
    }

    async setImageFromBase64(imageSrc: string): Promise<void> {
        const image = new Image();
        image.src = imageSrc;

        this.initialSize.x = image.width;
        this.initialSize.y = image.height;
        this.initialImage = image;

        this.resetDrawingSurface();
    }

    async setImageSavedLocally(imageSrc: string): Promise<void> {
        const image = new Image();
        image.src = imageSrc;

        return new Promise(
            (image.onload = async () => {
                this.initialSize.x = image.width;
                this.initialSize.y = image.height;
                this.initialImage = image;
                this.resetDrawingSurface();
            }),
        );
    }

    constructor(historyService: HistoryService) {
        historyService.onUndo(() => this.resetDrawingSurface());

        this.onDrawingLoaded = new EventEmitter();

        this.onDrawingSurfaceResize = new EventEmitter();
        this.initialSize = { x: Constants.DEFAULT_WIDTH, y: Constants.DEFAULT_HEIGHT };
        this.initialImage = undefined;
    }
}
