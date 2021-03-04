import { Injectable } from '@angular/core';
import { ResizableTool } from '@app/app/classes/resizable-tool';
import { Vec2 } from '@app/app/classes/vec2';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';

@Injectable({
    providedIn: 'root',
})
export class SprayService extends ResizableTool implements ISelectableTool {
    private vertices: Vec2[];
    diameterDraw: number = 1;
    numberPoints: number = 1;
    delaiPoints: number = 10;
    lastMousePosition: Vec2;
    sprayTimer: ReturnType<typeof setTimeout>;
    constructor(drawingService: DrawingService, private colourService: ColourService) {
        super(drawingService);
        this.vertices = [];
        this.key = 'spray';
    }

    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearVertices();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.drawPoint(this.drawingService.previewCtx, this.mouseDownCoord);
            this.lastMousePosition = this.mouseDownCoord;

            this.sprayTimer = setInterval(() => {
                this.vertices.push(this.lastMousePosition);
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawVertices(this.drawingService.baseCtx);
            }, this.delaiPoints);
        }
    }
    private drawPoint(ctx: CanvasRenderingContext2D, point: Vec2): void {
        ctx.beginPath();
        ctx.fill();
    }
    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.vertices.push(mousePosition);
            clearInterval(this.sprayTimer);
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDown = false;
        this.clearVertices();
        clearInterval();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.vertices.push(mousePosition);
            this.lastMousePosition = mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        this.clearVertices();
    }

    private drawVertices(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        let min: number = -this.diameterDraw;
        let max: number = this.diameterDraw;
        min = Math.ceil(min);
        max = Math.floor(max);
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.colourService.getPrimaryColour().toStringRBGA();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        for (let i = 0; i < this.numberPoints; i++) {
            ctx.strokeRect(
                this.vertices[0].x + Math.floor(Math.random() * (max - min + 1)) + min,
                this.vertices[0].y + Math.floor(Math.random() * (max - min + 1)) + min,
                1,
                1,
            );
        }
    }

    clearVertices(): void {
        this.vertices = [];
    }
}
