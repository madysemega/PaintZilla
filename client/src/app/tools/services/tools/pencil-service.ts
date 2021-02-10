import { Injectable } from '@angular/core';
import { ResizableTool } from '@app/app/classes/resizable-tool';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing/drawing.service';
import { MouseButton } from '@app/tools/classes/mouse-button';

@Injectable({
    providedIn: 'root',
})
export class PencilService extends ResizableTool {
    lineWidth: number;
    private currentSegmentIndex: number;
    private segments: Vec2[][];

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.currentSegmentIndex = 0;
        this.segments = [];
        this.name = 'Crayon';
        this.key = 'pencil';
    }

    adjustLineWidth(lineWidth: number): void {
        this.lineWidth = lineWidth;
        this.drawingService.previewCtx.lineWidth = lineWidth;
        this.drawingService.baseCtx.lineWidth = lineWidth;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearSegments();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.createNewSegment(this.mouseDownCoord);
            this.drawPoint(this.drawingService.previewCtx, this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            if (this.segments[this.currentSegmentIndex]) this.segments[this.currentSegmentIndex].push(mousePosition);

            this.drawSegments(this.drawingService.baseCtx);
            this.drawPoint(this.drawingService.baseCtx, this.mouseDownCoord);
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDown = false;
        this.clearSegments();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.segments[this.currentSegmentIndex].push(mousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawSegments(this.drawingService.previewCtx);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        this.mouseInCanvas = false;
    }

    onMouseEnter(event: MouseEvent): void {
        this.mouseInCanvas = true;
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.createNewSegment(mousePosition);
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.drawingService.baseCtx.save();
        this.drawingService.previewCtx.save();
        this.adjustLineWidth(this.lineWidth);
        ctx.strokeStyle = 'black';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        this.drawingService.baseCtx.restore();
        this.drawingService.previewCtx.restore();
    }

    private drawPoint(ctx: CanvasRenderingContext2D, point: Vec2): void {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI, true);
        ctx.fill();
    }

    private drawSegments(ctx: CanvasRenderingContext2D): void {
        for (const segment of this.segments) {
            if (segment) this.drawLine(ctx, segment);
        }
    }

    private clearSegments(): void {
        this.segments = [];
    }

    private createNewSegment(initialPoint: Vec2): void {
        this.currentSegmentIndex++;
        this.segments[this.currentSegmentIndex] = [];
        this.segments[this.currentSegmentIndex].push(initialPoint);
    }
}
