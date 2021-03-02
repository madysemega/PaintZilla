import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/app/classes/shape-tool';
import { ShapeType } from '@app/app/classes/shape-type';
import { Vec2 } from '@app/app/classes/vec2';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';
import { ColourToolService } from '@app/tools/services/tools/colour-tool.service';

@Injectable({
    providedIn: 'root',
})
export class PolygonService extends ShapeTool implements ISelectableTool {
    startPoint: Vec2;
    lastMousePosition: Vec2;
    numberSides: number;

    constructor(drawingService: DrawingService, private colourService: ColourToolService) {
        super(drawingService);
        this.shapeType = ShapeType.Contoured;
        this.key = 'polygon';
        this.startPoint = { x: 0, y: 0 };
        this.lastMousePosition = { x: 0, y: 0 };
        this.numberSides = 6;
    }
    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
    }
    onToolDeselect(): void {
        if (this.mouseDown) {
            // const mousePosition = this.getPositionFromMouse(event);
            // this.lastMousePosition = this.startPoint;
            // this.startPoint = mousePosition;
            this.drawPolygon(this.drawingService.baseCtx, this.startPoint, this.lastMousePosition);
            this.startPoint = { x: 0, y: 0 };
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDown = false;
        this.lastMousePosition = { x: 0, y: 0 };
    }
    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        console.log('appeler');
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.lastMousePosition = this.mouseDownCoord;
            this.startPoint = this.mouseDownCoord;
        }
    }
    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            // const mousePosition = this.getPositionFromMouse(event);
            // this.lastMousePosition = this.startPoint;
            // this.startPoint = mousePosition;
            this.drawPolygon(this.drawingService.baseCtx, this.startPoint, this.lastMousePosition);
            this.startPoint = { x: 0, y: 0 };
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDown = false;
        this.lastMousePosition = { x: 0, y: 0 };
    }
    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.lastMousePosition = this.getPositionFromMouse(event);
            this.drawPolygon(this.drawingService.previewCtx, this.startPoint, this.lastMousePosition);
        }
    }

    getPolygonSize(startPoint: Vec2, endPoint: Vec2): number {
        return Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));
    }
    drawPolygon(ctx: CanvasRenderingContext2D, startPoint: Vec2, endPoint: Vec2): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        ctx.save();
        ctx.lineWidth = 1;
        ctx.fillStyle = this.colourService.primaryColour;
        ctx.strokeStyle = this.colourService.secondaryColour;
        const SIZE = this.getPolygonSize(startPoint, endPoint);
        const CENTER_POINT: Vec2 = { x: Math.abs((startPoint.x - endPoint.x) / 2), y: Math.abs((startPoint.y - endPoint.y) / 2) };
        ctx.beginPath();
        ctx.moveTo(startPoint.x + SIZE * Math.cos(0), startPoint.y + SIZE * Math.cos(0));
        for (let i = 1; i <= this.numberSides; i++) {
            console.log(this.numberSides);
            ctx.lineTo(
                CENTER_POINT.x + SIZE * Math.cos((i * 2 * Math.PI) / this.numberSides),
                CENTER_POINT.y + SIZE * Math.sin((i * 2 * Math.PI) / this.numberSides),
            );
        }
        ctx.closePath();
        // ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}
