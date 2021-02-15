import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/app/classes/shape-tool';
import { ShapeType } from '@app/app/classes/shape-type';
import { Vec2 } from '@app/app/classes/vec2';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends ShapeTool implements ISelectableTool {
    startingPos: Vec2;
    width: number;
    height: number;
    shiftDown: boolean;
    lastMouseCoords: Vec2;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.startingPos = { x: 0, y: 0 };
        this.width = 0;
        this.height = 0;
        this.shiftDown = false;
        this.lastMouseCoords = { x: 0, y: 0 };
        this.key = 'rectangle';
    }

    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.shiftDown = true;
            this.draw(this.drawingService.previewCtx, this.lastMouseCoords.x, this.lastMouseCoords.y);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.shiftDown = false;
            this.draw(this.drawingService.previewCtx, this.lastMouseCoords.x, this.lastMouseCoords.y);
        }
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.startingPos = this.mouseDownCoord;
            this.lastMouseCoords = this.startingPos;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawRect(this.drawingService.baseCtx);
            this.startingPos.x = 0;
            this.startingPos.y = 0;
        }
        this.lastMouseCoords.x = 0;
        this.lastMouseCoords.y = 0;
        this.width = 0;
        this.height = 0;
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.lastMouseCoords = mousePosition;
            this.draw(this.drawingService.previewCtx, mousePosition.x, mousePosition.y);
        }
    }

    private draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        this.adjustRectSize(x, y);
        this.drawRect(ctx);
    }

    adjustRectSize(x: number, y: number): void {
        this.width = x - this.startingPos.x;
        this.height = y - this.startingPos.y;
        if (this.shiftDown) {
            if (Math.abs(this.width) > Math.abs(this.height)) {
                if (this.width > 0) this.width = Math.abs(this.height);
                else this.width = -Math.abs(this.height);
            } else {
                if (this.height > 0) this.height = Math.abs(this.width);
                else this.height = -Math.abs(this.width);
            }
        }
    }

    private drawRect(ctx: CanvasRenderingContext2D): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        ctx.save();

        ctx.lineWidth = this.lineWidth;

        if (this.shapeType === ShapeType.Filled || this.shapeType === ShapeType.ContouredAndFilled) {
            ctx.fillRect(this.startingPos.x, this.startingPos.y, this.width, this.height);
            if (this.shapeType === ShapeType.ContouredAndFilled) {
                ctx.strokeStyle = 'red';
                ctx.strokeRect(this.startingPos.x, this.startingPos.y, this.width, this.height);
            }
        } else ctx.strokeRect(this.startingPos.x, this.startingPos.y, this.width, this.height);

        ctx.restore();
    }
}
