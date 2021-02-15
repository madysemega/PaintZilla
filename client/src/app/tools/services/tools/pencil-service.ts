import { Injectable } from '@angular/core';
import { ResizableTool } from '@app/app/classes/resizable-tool';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MouseButton } from '@app/tools/classes/mouse-button';

@Injectable({
    providedIn: 'root',
})
export class PencilService extends ResizableTool {
    private vertices: Vec2[];

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.vertices = [];
        this.name = 'Crayon';
        this.key = 'pencil';
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearVertices();

            this.mouseDownCoord = this.getPositionFromMouse(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.vertices.push(mousePosition);

            this.drawVertices(this.drawingService.baseCtx);
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDown = false;
        this.clearVertices();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.vertices.push(mousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawVertices(this.drawingService.previewCtx);
        }
    }

    private drawVertices(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = 'black';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        for (const point of this.vertices) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();

        ctx.restore();
    }

    private clearVertices(): void {
        this.vertices = [];
    }
}
