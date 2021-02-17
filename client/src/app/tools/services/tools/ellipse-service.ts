import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/app/classes/shape-tool';
import { ShapeType } from '@app/app/classes/shape-type';
import { Vec2 } from '@app/app/classes/vec2';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';
import { ColourToolService } from './colour-tool.service';

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends ShapeTool implements ISelectableTool {
    private readonly CIRCLE_MAX_ANGLE: number = 360;

    startPoint: Vec2 = { x: 0, y: 0 };
    lastMousePosition: Vec2;

    isShiftDown: boolean = false;

    private selectionCanvas : HTMLCanvasElement ;
    private selectionCanvasCTX : CanvasRenderingContext2D;

    constructor(drawingService: DrawingService, private colourService: ColourToolService) {
        super(drawingService);
        this.shapeType = ShapeType.Contoured;
        this.key = 'ellipse';
        this.selectionCanvas = document.createElement('canvas');
        this.selectionCanvasCTX= this.selectionCanvas.getContext('2d') as CanvasRenderingContext2D
        
    }

    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.lastMousePosition = this.mouseDownCoord;
            this.startPoint = this.mouseDownCoord;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.lastMousePosition = mousePosition;
            this.drawEllipse(this.drawingService.baseCtx, this.startPoint, mousePosition);
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.lastMousePosition = mousePosition;

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawEllipse(this.drawingService.previewCtx, this.startPoint, mousePosition);
            this.drawPerimeter(this.drawingService.previewCtx, this.startPoint, mousePosition);
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.isShiftDown = true;

            if (this.mouseDown) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawEllipse(this.drawingService.previewCtx, this.startPoint, this.lastMousePosition);
                this.drawPerimeter(this.drawingService.previewCtx, this.startPoint, this.lastMousePosition);
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.isShiftDown = false;

            if (this.mouseDown) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawEllipse(this.drawingService.previewCtx, this.startPoint, this.lastMousePosition);
                this.drawPerimeter(this.drawingService.previewCtx, this.startPoint, this.lastMousePosition);
            }
        }
    }

    getSquareAjustedPerimeter(startPoint: Vec2, endPoint: Vec2): Vec2 {
        const endPointWithRespectToStartPoint: Vec2 = {
            x: endPoint.x - startPoint.x,
            y: endPoint.y - startPoint.y,
        };

        const endPointShortestComponent = Math.min(Math.abs(endPointWithRespectToStartPoint.x), Math.abs(endPointWithRespectToStartPoint.y));

        const isXComponentPositive: boolean = startPoint.x < endPoint.x;
        const isYComponentPositive: boolean = startPoint.y < endPoint.y;

        return {
            x: startPoint.x + (isXComponentPositive ? endPointShortestComponent : -endPointShortestComponent),
            y: startPoint.y + (isYComponentPositive ? endPointShortestComponent : -endPointShortestComponent),
        };
    }

    drawPerimeter(ctx: CanvasRenderingContext2D, startPoint: Vec2, endPoint: Vec2): void {
        const DASH_NUMBER = 8;

        if (this.isShiftDown) {
            endPoint = this.getSquareAjustedPerimeter(startPoint, endPoint);
        }

        const topLeft: Vec2 = {
            x: Math.min(startPoint.x, endPoint.x),
            y: Math.min(startPoint.y, endPoint.y),
        };

        const dimensions: Vec2 = {
            x: Math.abs(endPoint.x - startPoint.x),
            y: Math.abs(endPoint.y - startPoint.y),
        };

        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([DASH_NUMBER]);
        ctx.strokeStyle = '#888';
        ctx.rect(topLeft.x, topLeft.y, dimensions.x, dimensions.y);
        ctx.stroke();
        ctx.restore();
    }

    drawEllipse(ctx: CanvasRenderingContext2D, startPoint: Vec2, endPoint: Vec2): void {
        this.selectionCanvas.width = this.drawingService.canvas.width;
        this.selectionCanvas.height = this.drawingService.canvas.height;

        if (this.isShiftDown) {
            endPoint = this.getSquareAjustedPerimeter(startPoint, endPoint);
        }

        const center: Vec2 = {
            x: (startPoint.x + endPoint.x) / 2,
            y: (startPoint.y + endPoint.y) / 2,
        };

        const radii: Vec2 = {
            x: Math.abs(endPoint.x - startPoint.x) / 2 - this.lineWidth / 2,
            y: Math.abs(endPoint.y - startPoint.y) / 2 - this.lineWidth / 2,
        };
        
        if(ctx == this.drawingService.baseCtx){
            this.selectionCanvasCTX.beginPath();
            this.selectionCanvasCTX.ellipse(center.x, center.y, radii.x, radii.y, 0, 0, this.CIRCLE_MAX_ANGLE);
            this.selectionCanvasCTX.clip();
            this.selectionCanvasCTX.drawImage(this.drawingService.canvas, 0, 0);
            ctx.drawImage(this.selectionCanvas, this.startPoint.x, this.startPoint.y, this.selectionCanvas.width, this.selectionCanvas.height,0,0 , this.selectionCanvas.width, this.selectionCanvas.height);
            this.selectionCanvasCTX.clearRect(0,0,this.selectionCanvas.width, this.selectionCanvas.height);
        }

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.colourService.secondaryColour;
        ctx.ellipse(center.x, center.y, radii.x, radii.y, 0, 0, this.CIRCLE_MAX_ANGLE);
        ctx.stroke();
        ctx.restore();
    }
}
