import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/app/classes/shape-tool';
import { ShapeType } from '@app/app/classes/shape-type';
import { Vec2 } from '@app/app/classes/vec2';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';
import { ColourToolService } from './colour-tool.service';
import { SelectionService } from '@app/tools/services/tools/selection.service'
import { SelectionMoverService } from '@app/tools/services/tools/selection-mover.service'

@Injectable({
    providedIn: 'root',
})

export class EllipseService extends ShapeTool implements ISelectableTool {
    private readonly CIRCLE_MAX_ANGLE: number = 360;

    startPoint: Vec2 = { x: 0, y: 0 };
    endPoint : Vec2;
    lastMousePosition: Vec2;

    isShiftDown: boolean = false;

    private selectionCanvas : HTMLCanvasElement ;
    private selectionCanvasCTX : CanvasRenderingContext2D;

    /*private state : SelectionState;
    private firstTime : boolean;
    anchorPoint: Vec2 = { x: 0, y: 0 };
    selectionPos: Vec2 = { x: 0, y: 0 };*/
    
    constructor(drawingService: DrawingService, private colourService: ColourToolService, private selectionService: SelectionService, private selectionMoverService: SelectionMoverService) {
        super(drawingService);
        this.shapeType = ShapeType.Contoured;
        this.key = 'ellipse';
        this.selectionCanvas = document.createElement('canvas');
        this.selectionCanvasCTX= this.selectionCanvas.getContext('2d') as CanvasRenderingContext2D
    }

    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
        this.selectionService.isSelectionBeingMoved = false;
    }

    onMouseDown(event: MouseEvent): void {
        if( this.selectionService.isSelectionBeingMoved ){
            this.selectionMoverService.onMouseDown(event);
        }
        else{
            this.mouseDown = event.button === MouseButton.Left;
        
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.lastMousePosition = this.mouseDownCoord;
            this.startPoint = this.mouseDownCoord;
        }

        /*
        if(this.mouseDown && this.state == SelectionState.Standby){
            this.mouseDownCoord = this.getPositionFromMouse(event);
            const xInSelection : boolean = this.mouseDownCoord.x > Math.min(this.startPoint.x, this.endPoint.x) 
            && this.mouseDownCoord.x < Math.max(this.startPoint.x, this.endPoint.x);
            const yInSelection : boolean = this.mouseDownCoord.y > Math.min(this.startPoint.y, this.endPoint.y) 
            && this.mouseDownCoord.y < Math.max(this.startPoint.y, this.endPoint.y);
            console.log(this.startPoint.x + " " + this.startPoint.y);
            console.log(this.endPoint.x + " " + this.endPoint.y);
            console.log(this.mouseDownCoord.x + " " + this.mouseDownCoord.y);
            if(xInSelection && yInSelection){
                
            }
        }*/
    }

    onMouseUp(event: MouseEvent): void {
        if(this.selectionService.isSelectionBeingMoved ){
            this.selectionMoverService.onMouseUp(event);
        }
        else{
            if (this.mouseDown) {
                const mousePosition = this.getPositionFromMouse(event);
                this.lastMousePosition = mousePosition;
                this.drawEllipse(true, this.startPoint, mousePosition);
                this.drawPerimeter(this.drawingService.previewCtx, this.startPoint, mousePosition)
            }
            //this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.mouseDown = false;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if(this.selectionService.isSelectionBeingMoved ){
            this.selectionMoverService.onMouseMove(event);
        }
        else{
            const mousePosition = this.getPositionFromMouse(event);
            if (this.mouseDown) {
                this.lastMousePosition = mousePosition;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawEllipse(false, this.startPoint, mousePosition);
                this.drawPerimeter(this.drawingService.previewCtx, this.startPoint, mousePosition);
            }
        }
        
        /*else if(this.mouseDown && this.firstTime && this.state == SelectionState.Standby){
            console.log("dddddddddd")
            this.anchorPoint.x = mousePosition.x;
            this.anchorPoint.y = mousePosition.y;
            this.firstTime = false;
        }

        else if(this.mouseDown && this.state == SelectionState.Standby){
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            const movX = mousePosition.x - this.anchorPoint.x;
            const movY = mousePosition.y - this.anchorPoint.y;

            this.selectionPos.x = this.startPoint.x + movX;
            this.selectionPos.y = this.startPoint.y + movY;

            this.drawingService.previewCtx.drawImage(
                this.selectionCanvas, this.startPoint.x, this.startPoint.y,
                this.selectionCanvas.width, this.selectionCanvas.height,
                this.selectionPos.x, this.selectionPos.y, 
                this.selectionCanvas.width, this.selectionCanvas.height);
        }*/
    }

    onKeyDown(event: KeyboardEvent): void {
        if(this.selectionService.isSelectionBeingMoved ){
            this.selectionMoverService.onKeyDown(event);
        }
        else{
            if (event.key === 'Shift') {
                this.isShiftDown = true;

                if (this.mouseDown) {
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.drawEllipse(false, this.startPoint, this.lastMousePosition);
                    this.drawPerimeter(this.drawingService.previewCtx, this.startPoint, this.lastMousePosition);
                }
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if(this.selectionService.isSelectionBeingMoved ){
            this.selectionMoverService.onKeyUp(event);
        }
        else{
            if (event.key === 'Shift') {
                this.isShiftDown = false;

                if (this.mouseDown) {
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.drawEllipse(false, this.startPoint, this.lastMousePosition);
                    this.drawPerimeter(this.drawingService.previewCtx, this.startPoint, this.lastMousePosition);
                }
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

    drawEllipse(isFinalDrawing : boolean , startPoint: Vec2, endPoint: Vec2): void {
        let ctx : CanvasRenderingContext2D = this.drawingService.previewCtx;
        this.selectionCanvas.width = this.drawingService.canvas.width;
        this.selectionCanvas.height = this.drawingService.canvas.height;

        //console.log(startPoint.x +" "+ startPoint.y +"    "+ endPoint.x +" "+endPoint.y);

        if (this.isShiftDown) {
            endPoint = this.getSquareAjustedPerimeter(startPoint, endPoint);
        }

        const center: Vec2 = {
            x: (startPoint.x + endPoint.x) / 2,
            y: (startPoint.y + endPoint.y) / 2,
        };

        const radii: Vec2 = {
            x: Math.abs(endPoint.x - startPoint.x) / 2,
            y: Math.abs(endPoint.y - startPoint.y) / 2,
        };
        
        if(isFinalDrawing){
            this.selectionCanvasCTX.beginPath();
            this.selectionCanvasCTX.ellipse(center.x, center.y, radii.x, radii.y, 0, 0, this.CIRCLE_MAX_ANGLE);
            this.selectionCanvasCTX.clip();
            this.selectionCanvasCTX.drawImage(this.drawingService.canvas, 0, 0);
            this.endPoint = endPoint;
            //this.selectionCanvasCTX.clearRect(0,0,this.selectionCanvas.width, this.selectionCanvas.height);
        }

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.colourService.secondaryColour;
        ctx.ellipse(center.x, center.y, radii.x, radii.y, 0, 0, this.CIRCLE_MAX_ANGLE);
        ctx.stroke();
        ctx.restore();

        if(isFinalDrawing){
            let topLeft : Vec2={x:startPoint.x, y:startPoint.y};
            console.log(topLeft.x +" "+ topLeft.y);
            if(startPoint.x > endPoint.x){
                topLeft.x = endPoint.x; 
                this.endPoint.x = startPoint.x;
            }
            if(startPoint.y > endPoint.y){
                topLeft.y = endPoint.y;
                this.endPoint.y = startPoint.y;
            }
            console.log(topLeft.x +" "+ topLeft.y);
            this.selectionMoverService.setSelection(this.selectionCanvas, topLeft, this.endPoint);
            this.selectionService.isSelectionBeingMoved = true;
        }
    }
}
