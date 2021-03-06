import { Injectable } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ShapeTool } from '@app/app/classes/shape-tool';
import { ShapeType } from '@app/app/classes/shape-type';
import { Vec2 } from '@app/app/classes/vec2';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';

@Injectable({
    providedIn: 'root',
})
export class PolygonService extends ShapeTool implements ISelectableTool {
    private readonly CIRCLE_MAX_ANGLE: number = 360;
    private readonly TRIANGLE_SIDES: number = 3;
    startPoint: Vec2;
    lastMousePosition: Vec2;
    numberSides: number;
    isToDrawPerim: boolean;
    constructor(drawingService: DrawingService, private colourService: ColourService) {
        super(drawingService);
        this.shapeType = ShapeType.Contoured;
        this.key = 'polygon';
        this.startPoint = { x: 0, y: 0 };
        this.lastMousePosition = { x: 0, y: 0 };
        this.numberSides = this.TRIANGLE_SIDES;
        this.isToDrawPerim = true;
    }
    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
    }
    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.isToDrawPerim = true;
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.lastMousePosition = this.mouseDownCoord;
            this.startPoint = this.mouseDownCoord;
        }
    }
    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.lastMousePosition = this.getPositionFromMouse(event);
            this.isToDrawPerim = false;
            this.drawPolygon(this.drawingService.baseCtx, this.startPoint, this.lastMousePosition);
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDown = false;
    }
    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.lastMousePosition = this.getPositionFromMouse(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawPolygon(this.drawingService.previewCtx, this.startPoint, this.lastMousePosition);
        }
    }
    changeNbSides(event: MatSliderChange): void {
        this.numberSides = event.value as number;
    }
    squarePoint(startPoint: Vec2, endPoint: Vec2): number {
        const COMP_X = endPoint.x - startPoint.x;
        const COMP_Y = endPoint.y - startPoint.y;
        const COMP = Math.abs(COMP_X) < Math.abs(COMP_Y) ? COMP_X : COMP_Y;
        return COMP;
    }
    getSquareEndPoint(startPoint: Vec2, endPoint: Vec2): Vec2 {
        const COMP = this.squarePoint(startPoint, endPoint);
        const X_COMPONENT_POS: boolean = COMP * (endPoint.x - startPoint.x) >= 0;
        const Y_COMPONENT_POS: boolean = COMP * (endPoint.y - startPoint.y) >= 0;
        return { x: startPoint.x + (X_COMPONENT_POS ? COMP : -COMP), y: startPoint.y + (Y_COMPONENT_POS ? COMP : -COMP) };
    }
    drawPolygon(ctx: CanvasRenderingContext2D, startPoint: Vec2, endPoint: Vec2): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        ctx.save();
        ctx.lineWidth = this.lineWidth;
        ctx.fillStyle = this.colourService.getPrimaryColour().toStringRGBA();
        ctx.strokeStyle = this.colourService.getSecondaryColour().toStringRGBA();
        endPoint = this.getSquareEndPoint(startPoint, endPoint);
        // const SIZE = this.squarePoint(startPoint, endPoint);
        const CENTER_POINT: Vec2 = { x: (startPoint.x + endPoint.x) / 2, y: (startPoint.y + endPoint.y) / 2 };
        const SIZE = this.squarePoint(CENTER_POINT, endPoint);

        ctx.beginPath();
        ctx.moveTo(
            CENTER_POINT.x + SIZE * Math.cos((2 * Math.PI) / this.numberSides),
            CENTER_POINT.y + SIZE * Math.sin((2 * Math.PI) / this.numberSides),
        );
        for (let i = 2; i <= this.numberSides; i++) {
            ctx.lineTo(
                CENTER_POINT.x + SIZE * Math.cos((i * 2 * Math.PI) / this.numberSides),
                CENTER_POINT.y + SIZE * Math.sin((i * 2 * Math.PI) / this.numberSides),
            );
        }
        ctx.closePath();
        if (this.shapeType === ShapeType.Filled || this.shapeType === ShapeType.ContouredAndFilled) {
            ctx.fill();
        }
        if (this.shapeType === ShapeType.Contoured || this.shapeType === ShapeType.ContouredAndFilled) {
            ctx.stroke();
        }
        if (this.isToDrawPerim) {
            this.drawPerimeter(ctx, CENTER_POINT, Math.abs(SIZE));
        }
        ctx.restore();
    }
    drawPerimeter(ctx: CanvasRenderingContext2D, center: Vec2, size: number): void {
        const DASH_NUMBER = 8;
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([DASH_NUMBER]);
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1;
        ctx.ellipse(center.x, center.y, size + this.lineWidth, size + this.lineWidth, 0, 0, this.CIRCLE_MAX_ANGLE);
        ctx.stroke();
        ctx.restore();
    }
}
