import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing/drawing.service';
import { LineShape } from '@app/shapes/line-shape';
import { LineShapeRenderer } from '@app/shapes/renderers/line-shape-renderer';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { Tool } from '@app/tools/classes/tool';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    private lineShape: LineShape;
    private lineShapeRenderer: LineShapeRenderer;
    private lastMousePosition: Vec2;

    onMouseClick(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            const mousePosition: Vec2 = this.getPositionFromMouse(event);
            this.lineShape.vertices.push(mousePosition);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.lineShapeRenderer.render(this.drawingService.previewCtx);
        }
    }

    onMouseDoubleClick(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            this.lineShape.vertices.length -= 2;

            if (this.lineShape.isCloseableWith(this.lastMousePosition)) {
                this.lineShape.close();
            } else {
                this.lineShape.vertices.push(this.lastMousePosition);
            }

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.lineShapeRenderer.render(this.drawingService.baseCtx);
            this.lineShape.clear();
        }
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition: Vec2 = this.getPositionFromMouse(event);
        this.lastMousePosition = mousePosition;

        const isShapeBeingDrawn = this.lineShape.vertices.length !== 0;
        if (isShapeBeingDrawn) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            this.lineShape.vertices.push(mousePosition);
            this.lineShapeRenderer.render(this.drawingService.previewCtx);
            this.lineShape.vertices.pop();
        }
    }

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.lineShape = new LineShape([], []);
        this.lineShapeRenderer = new LineShapeRenderer(this.lineShape);
    }
}
