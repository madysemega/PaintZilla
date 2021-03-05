import { Injectable } from '@angular/core';
import { ResizableTool } from '@app/app/classes/resizable-tool';
import { Vec2 } from '@app/app/classes/vec2';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { IDeselectableTool } from '@app/tools/classes/deselectable-tool';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends ResizableTool implements ISelectableTool, IDeselectableTool {
    private readonly CURSOR_FILL_STYLE: string = '#FFF';
    private readonly CURSOR_STROKE_STYLE: string = '#000';
    minimumWidth: number = 5;

    private vertices: Vec2[];

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.vertices = [];
        this.key = 'eraser';
    }

    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.NONE);
    }

    onToolDeselect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearVertices();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.drawPoint(this.drawingService.previewCtx, this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.vertices.push(mousePosition);

            this.drawVertices(this.drawingService.baseCtx);
            this.drawPoint(this.drawingService.baseCtx, this.mouseDownCoord);
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDown = false;
        this.clearVertices();
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            this.vertices.push(mousePosition);
        }

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawVertices(this.drawingService.previewCtx);
        this.drawCursor(mousePosition, this.drawingService.previewCtx);
    }
    changeWidth(width: number): number {
        if (width < this.minimumWidth) {
            width = this.minimumWidth;
        }
        return width;
    }

    drawVertices(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        this.lineWidth = this.changeWidth(this.lineWidth);
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = 'white';
        ctx.lineCap = 'square';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        for (const point of this.vertices) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();

        ctx.restore();
    }

    private drawPoint(ctx: CanvasRenderingContext2D, point: Vec2): void {
        ctx.beginPath();
        ctx.fill();
    }

    private drawCursor(position: Vec2, ctx: CanvasRenderingContext2D): void {
        ctx.save();

        ctx.beginPath();

        ctx.strokeStyle = this.CURSOR_STROKE_STYLE;
        ctx.fillStyle = this.CURSOR_FILL_STYLE;

        const radius = this.lineWidth;
        ctx.rect(position.x - radius / 2, position.y - radius / 2, radius, radius);

        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    private clearVertices(): void {
        this.vertices = [];
    }
}
