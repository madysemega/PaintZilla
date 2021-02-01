import { Injectable } from '@angular/core';
import { ShapeType } from '@app/classes/shape-type';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MouseButton } from './pencil-service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    private startingPos: Vec2;
    private width: number;
    private height: number;
    private shiftDown: boolean;
    private lastMouseCoords: Vec2;
    shapeType: ShapeType = ShapeType.Contoured;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.startingPos = {x: 0, y:0};
        this.width=0;
        this.height=0;
        this.shiftDown = false;
        this.lastMouseCoords = {x:0, y:0}
    }
/*
    setLineWidth(width: number): void {
        this.drawingService.previewCtx.lineWidth = width;
        this.drawingService.baseCtx.lineWidth = width;
    }
*/

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

    private adjustRectSize(x: number, y: number): void {
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
        // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        if (this.shapeType === ShapeType.Filled || this.shapeType === ShapeType.ContouredAndFilled) {
            ctx.fillRect(this.startingPos.x, this.startingPos.y, this.width, this.height);
            if (this.shapeType === ShapeType.ContouredAndFilled) {
                ctx.strokeStyle = 'red';
                ctx.strokeRect(this.startingPos.x, this.startingPos.y, this.width, this.height);
            }
        } else ctx.strokeRect(this.startingPos.x, this.startingPos.y, this.width, this.height);
    }
}
