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

    private selectionCanvas : HTMLCanvasElement ;
    private selectionCanvasCTX : CanvasRenderingContext2D;
    
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
      
            this.mouseDown = event.button === MouseButton.Left;
        
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.lastMousePosition = this.mouseDownCoord;
            this.startPoint = this.mouseDownCoord;
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
                this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.startPoint, mousePosition)
            }
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
                this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.startPoint, mousePosition);
            }
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if(this.selectionService.isSelectionBeingMoved ){
            this.selectionMoverService.onKeyDown(event);
        }
        else{
            if (event.key === 'Shift') {
                this.selectionService.isShiftDown = true;

                if (this.mouseDown) {
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.drawEllipse(false, this.startPoint, this.lastMousePosition);
                    this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.startPoint, this.lastMousePosition);
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
                this.selectionService.isShiftDown = false;

                if (this.mouseDown) {
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.drawEllipse(false, this.startPoint, this.lastMousePosition);
                    this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.startPoint, this.lastMousePosition);
                }
            }
        }
    }

    drawEllipse(isFinalDrawing : boolean , startPoint: Vec2, endPoint: Vec2): void {
        this.selectionCanvas.width = this.drawingService.canvas.width;
        this.selectionCanvas.height = this.drawingService.canvas.height;

        //console.log(startPoint.x +" "+ startPoint.y +"    "+ endPoint.x +" "+endPoint.y);

        if (this.selectionService.isShiftDown) {
            endPoint = this.selectionService.getSquareAjustedPerimeter(startPoint, endPoint);
        }

        let center: Vec2={x:0, y:0};
        let radii: Vec2={x:0, y:0};
        this.selectionService.getEllipseParam(this.startPoint, endPoint, center, radii);

    
        if(isFinalDrawing){
            this.selectionCanvasCTX.beginPath();
            this.selectionCanvasCTX.ellipse(center.x, center.y, radii.x, radii.y, 0, 0, this.CIRCLE_MAX_ANGLE);
            this.selectionCanvasCTX.clip();
            this.selectionCanvasCTX.drawImage(this.drawingService.canvas, 0, 0);
            this.endPoint = endPoint;
            //this.selectionCanvasCTX.clearRect(0,0,this.selectionCanvas.width, this.selectionCanvas.height);

        }

        this.selectionService.drawSelectionEllipse(center, radii);


        if(isFinalDrawing){
            this.selectionService.drawPostSelectionEllipse(center, radii);

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
            
            this.drawingService.previewCtx.drawImage(
            this.selectionCanvas, topLeft.x, topLeft.y,
            this.selectionCanvas.width, this.selectionCanvas.height,
            topLeft.x, topLeft.y,
            this.selectionCanvas.width, this.selectionCanvas.height);

            this.selectionService.isSelectionBeingMoved = true;
            this.selectionService.isShiftDown = false;
            this.selectionMoverService.setSelection(this.selectionCanvas, topLeft, this.endPoint);
        }

    }
}
