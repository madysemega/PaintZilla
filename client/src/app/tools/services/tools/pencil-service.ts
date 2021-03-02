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
export class PencilService extends ResizableTool implements ISelectableTool {
    private vertices: Vec2[];

    constructor(drawingService: DrawingService, private colourService: ColourService) {
        super(drawingService);
        this.vertices = [];
        this.key = 'pencil';
    }

    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
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
        ctx.strokeStyle = this.colourService.getPrimaryColour().toStringRBGA();
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
