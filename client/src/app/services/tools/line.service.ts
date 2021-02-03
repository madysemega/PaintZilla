import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    private vertices: Vec2[];
    private lastMousePosition: Vec2;

    private addVertex(newVertex: Vec2): void {
        this.vertices.push(newVertex);
        this.renderPreview();
    }

    private removeLastVertex(): void {
        this.renderPreview();
    }

    private clearVertices(): void {
        this.vertices = [];
    }

    private renderFinal(): void {
        this.drawSegments(this.drawingService.baseCtx, this.vertices);
    }

    private renderPreview(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawSegments(this.drawingService.previewCtx, this.vertices);
        this.drawSegments(this.drawingService.previewCtx, [this.vertices[this.vertices.length - 1], this.lastMousePosition]);
    }

    private isShapeBeingDrawn(): boolean {
        return this.vertices.length !== 0;
    }

    private isShapeCloseable(): boolean {
        const VALID_SHAPE_MIN_NB_VERTICES = 3;
        const CLOSING_SEGMENT_LENGTH_VALIDITY_THRESHOLD = 20; // (in pixels)

        const shapeHasEnoughVertices = this.vertices.length >= VALID_SHAPE_MIN_NB_VERTICES;
        if (!shapeHasEnoughVertices) {
            return false;
        }

        const firstVertex: Vec2 = this.vertices[0];
        const mousePosition: Vec2 = this.lastMousePosition;

        const closingSegmentLength: number = Math.sqrt((mousePosition.x - firstVertex.x) ** 2 + (mousePosition.y - firstVertex.y) ** 2);

        return closingSegmentLength <= CLOSING_SEGMENT_LENGTH_VALIDITY_THRESHOLD;
    }

    private closeShape(): void {
        const firstVertex: Vec2 = this.vertices[0];
        this.addVertex(firstVertex);
    }

    onMouseClick(event: MouseEvent): void {
        const mousePosition: Vec2 = this.getPositionFromMouse(event);
        this.addVertex(mousePosition);
    }

    onMouseDoubleClick(event: MouseEvent): void {
        this.removeLastVertex();

        if (this.isShapeCloseable()) {
            this.closeShape();
        } else {
            this.addVertex(this.lastMousePosition);
        }

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.renderFinal();
        this.clearVertices();
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition: Vec2 = this.getPositionFromMouse(event);
        this.lastMousePosition = mousePosition;
        if (this.isShapeBeingDrawn()) {
            this.renderPreview();
        }
    }

    private drawSegments(ctx: CanvasRenderingContext2D, vertices: Vec2[]): void {
        ctx.save();
        ctx.beginPath();

        for (const vertex of vertices) {
            ctx.lineTo(vertex.x, vertex.y);
        }

        ctx.stroke();
        ctx.restore();
    }

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearVertices();
    }
}
