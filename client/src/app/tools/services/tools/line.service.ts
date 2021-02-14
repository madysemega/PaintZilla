import { Injectable } from '@angular/core';
import { ResizableTool } from '@app/app/classes/resizable-tool';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { LineShape } from '@app/shapes/line-shape';
import { StrokeWidthProperty } from '@app/shapes/properties/stroke-width-property';
import { LineJointsRenderer } from '@app/shapes/renderers/line-joints-renderer';
import { LineShapeRenderer } from '@app/shapes/renderers/line-shape-renderer';
import { LineType } from '@app/shapes/types/line-type';
import { MouseButton } from '@app/tools/classes/mouse-button';

@Injectable({
    providedIn: 'root',
})
export class LineService extends ResizableTool {
    private lineShape: LineShape;
    private lineShapeRenderer: LineShapeRenderer;
    private lineJointsRenderer: LineJointsRenderer;
    private lastMousePosition: Vec2;

    private isShiftDown: boolean;
    private lineType: LineType;

    private strokeWidthProperty: StrokeWidthProperty;

    adjustLineWidth(lineWidth: number): void {
        this.strokeWidthProperty.strokeWidth = lineWidth;
    }

    setLineType(lineType: LineType): void {
        this.lineType = lineType;
    }

    setJointsDiameter(jointsDiameter: number): void {
        this.lineShape.jointsDiameter = jointsDiameter;
    }

    onMouseClick(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            const mousePosition: Vec2 = this.lineShape.getFinalMousePosition(this.getPositionFromMouse(event), this.isShiftDown);
            this.lineShape.vertices.push(mousePosition);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.lineShapeRenderer.render(this.drawingService.previewCtx);
            if (this.lineType === LineType.WITH_JOINTS) {
                this.lineJointsRenderer.render(this.drawingService.previewCtx);
            }
        }
    }

    onMouseDoubleClick(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            this.lineShape.vertices.length -= 2;

            if (this.lineShape.isCloseableWith(this.lastMousePosition)) {
                this.lineShape.close();
            } else {
                this.lineShape.vertices.push(this.lineShape.getFinalMousePosition(this.lastMousePosition, this.isShiftDown));
            }

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.lineShapeRenderer.render(this.drawingService.baseCtx);
            if (this.lineType === LineType.WITH_JOINTS) {
                this.lineJointsRenderer.render(this.drawingService.baseCtx);
            }
            this.lineShape.clear();
        }
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition: Vec2 = this.getPositionFromMouse(event);
        this.lastMousePosition = mousePosition;
        this.previewLine(this.lineShape.getFinalMousePosition(mousePosition, this.isShiftDown));
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.isShiftDown = true;
            this.previewLine(this.lastMousePosition);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        switch (event.key) {
            case 'Shift':
                this.isShiftDown = false;
                this.previewLine(this.lastMousePosition);
                break;
            case 'Escape':
                this.lineShape.clear();
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                break;
            case 'Backspace':
                this.lineShape.vertices.pop();

                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.lineShape.vertices.push(this.lastMousePosition);
                this.lineShapeRenderer.render(this.drawingService.previewCtx);
                if (this.lineType === LineType.WITH_JOINTS) {
                    this.lineJointsRenderer.render(this.drawingService.previewCtx);
                }
                this.lineShape.vertices.pop();
                break;
        }
    }

    previewLine(mousePosition: Vec2): void {
        const isShapeBeingDrawn = this.lineShape.vertices.length !== 0;
        if (isShapeBeingDrawn) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            this.lineShape.vertices.push(this.lineShape.getFinalMousePosition(mousePosition, this.isShiftDown));
            this.lineShapeRenderer.render(this.drawingService.previewCtx);
            if (this.lineType === LineType.WITH_JOINTS) {
                this.lineJointsRenderer.render(this.drawingService.previewCtx);
            }
            this.lineShape.vertices.pop();
        }
    }

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.lineShape = new LineShape([]);
        this.lineShapeRenderer = new LineShapeRenderer(this.lineShape, [(this.strokeWidthProperty = new StrokeWidthProperty())]);
        this.lineJointsRenderer = new LineJointsRenderer(this.lineShape, []);
        this.isShiftDown = false;
    }
}
