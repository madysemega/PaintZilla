import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/app/classes/shape-tool';
import { ShapeType } from '@app/app/classes/shape-type';
import { Vec2 } from '@app/app/classes/vec2';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';
import { SelectionService } from '@app/tools/services/tools/selection.service'
import { SelectionMoverService } from '@app/tools/services/tools/selection-mover.service'
import { EllipseSelectionRendererService } from '@app/tools/services/tools/ellipse-selection-renderer.service'

@Injectable({
    providedIn: 'root',
})

export class EllipseService extends ShapeTool implements ISelectableTool {
    private readonly CIRCLE_MAX_ANGLE: number = 360;

    startPoint: Vec2 = { x: 0, y: 0 };
    finalEndPoint: Vec2;
    lastMousePosition: Vec2;

    private selectionCanvas: HTMLCanvasElement;
    private selectionCanvasCtx: CanvasRenderingContext2D;

    constructor(drawingService: DrawingService, private selectionService: SelectionService, private selectionMoverService: SelectionMoverService, private ellipseSelectionRenderer: EllipseSelectionRendererService) {
        super(drawingService);
        this.shapeType = ShapeType.Contoured;
        this.key = 'ellipse';
        this.selectionCanvas = document.createElement('canvas');
        this.selectionCanvasCtx = this.selectionCanvas.getContext('2d') as CanvasRenderingContext2D
    }

    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
        this.selectionService.isSelectionBeingMoved = false;
    }

    onMouseDown(event: MouseEvent): void {
        if (this.selectionService.isSelectionBeingMoved) {
            this.selectionMoverService.onMouseDown(event);
        }
        
            this.mouseDown = event.button === MouseButton.Left;
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.lastMousePosition = this.mouseDownCoord;
            this.startPoint = this.mouseDownCoord;
    }

    onMouseUp(event: MouseEvent): void {
        if (this.selectionService.isSelectionBeingMoved) {
            this.selectionMoverService.onMouseUp(event);
        }
        else {
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
        if (this.selectionService.isSelectionBeingMoved) {
            this.selectionMoverService.onMouseMove(event);
        }
        else {
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
        if (this.selectionService.isSelectionBeingMoved) {
            this.selectionMoverService.onKeyDown(event);
        }
        if (event.key === 'Shift') {
            this.selectionService.isShiftDown = true;
            if (!this.selectionService.isSelectionBeingMoved) {
                if (this.mouseDown) {
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.drawEllipse(false, this.startPoint, this.lastMousePosition);
                    this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.startPoint, this.lastMousePosition);
                }
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.selectionService.isSelectionBeingMoved) {
            this.selectionMoverService.onKeyUp(event);
        }
        if (event.key === 'Shift') {
            this.selectionService.isShiftDown = false;
            if (!this.selectionService.isSelectionBeingMoved) {
                if (this.mouseDown) {
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.drawEllipse(false, this.startPoint, this.lastMousePosition);
                    this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.startPoint, this.lastMousePosition);
                }
            }
        }
    }

    drawEllipse(isFinalDrawing: boolean, startPoint: Vec2, endPoint: Vec2): void {
        this.selectionCanvas.width = this.drawingService.canvas.width;
        this.selectionCanvas.height = this.drawingService.canvas.height;
        let canvasClone =document.createElement('canvas');

        if (this.selectionService.isShiftDown) {
            endPoint = this.selectionService.getSquareAjustedPerimeter(startPoint, endPoint);
        }

        let center: Vec2 = { x: 0, y: 0 };
        let radii: Vec2 = { x: 0, y: 0 };
        this.selectionService.getEllipseParam(this.startPoint, endPoint, center, radii);

        if (isFinalDrawing) {
            canvasClone.width=this.drawingService.canvas.width;
            canvasClone.height=this.drawingService.canvas.height;
            (canvasClone.getContext('2d') as CanvasRenderingContext2D).drawImage(this.drawingService.canvas, 0,0);

            /*this.selectionCanvasCtx.translate(this.selectionCanvas.width/2,this.selectionCanvas.height/2 );
            this.selectionCanvasCtx.transform(1,0,0,2,0,0);
            this.selectionCanvasCtx.transform(1,0,0,2,0,0);
            this.selectionCanvasCtx.transform(1,0,0,3,0,0);
            this.selectionCanvasCtx.translate(-this.selectionCanvas.width/2, -this.selectionCanvas.height/2 );*/
            
            //this.selectionCanvasCtx.save();
            this.selectionCanvasCtx.beginPath();
            this.selectionCanvasCtx.ellipse( this.selectionCanvas.width/2,  this.selectionCanvas.height/2, radii.x, radii.y, 0, 0, this.CIRCLE_MAX_ANGLE);
            this.selectionCanvasCtx.clip();
           ////
            this.finalEndPoint = endPoint;

           /* this.selectionCanvasCtx.translate(this.selectionCanvas.width/2,this.selectionCanvas.height/2 );
            this.selectionCanvasCtx.transform(1,0,0,2,0,0);
            this.selectionCanvasCtx.transform(1,0,0,2,0,0);
            this.selectionCanvasCtx.transform(1,0,0,3,0,0);
            this.selectionCanvasCtx.translate(-this.selectionCanvas.width/2, -this.selectionCanvas.height/2 );*/

            this.selectionCanvasCtx.drawImage(this.drawingService.canvas, this.selectionCanvas.width/2-radii.x- this.startPoint.x , this.selectionCanvas.height/2-radii.y- this.startPoint.y);
            this.selectionCanvasCtx.closePath();
            //this.selectionCanvasCtx.restore();

       /*     this.selectionCanvasCtx.translate(this.selectionCanvas.width/2,this.selectionCanvas.height/2 );
            this.selectionCanvasCtx.transform(1,0,0,2,0,0);
            //this.selectionCanvasCtx.transform(1,0,0,2,0,0);
            //this.selectionCanvasCtx.transform(1,0,0,3,0,0);
            this.selectionCanvasCtx.translate(-this.selectionCanvas.width/2, -this.selectionCanvas.height/2 );
            //this.drawingService.clearCanvas(this.selectionCanvasCtx);
            this.selectionCanvasCtx.drawImage(canvasClone, this.selectionCanvas.width/2-radii.x- this.startPoint.x , this.selectionCanvas.height/2-radii.y- this.startPoint.y);
            */
            /*canvasClone.width=this.drawingService.canvas.width;
            canvasClone.width=this.drawingService.canvas.height;
            (canvasClone.getContext('2d') as CanvasRenderingContext2D).drawImage(this.drawingService.canvas, 0,0);*/
        }

        this.selectionService.drawSelectionEllipse(center, radii);

        if (isFinalDrawing) {

            let topLeft: Vec2 = this.startPoint;
            console.log(topLeft.x + " "+ topLeft.y + " "+this.finalEndPoint.x +" "+ this.finalEndPoint.y );
            if (startPoint.x > endPoint.x) {
                topLeft.x = endPoint.x;
                this.finalEndPoint.x = startPoint.x;
            }
            if (startPoint.y > endPoint.y) {
                topLeft.y = endPoint.y;
                this.finalEndPoint.y = startPoint.y;
            }

            

            this.ellipseSelectionRenderer.center = center;
            this.ellipseSelectionRenderer.radii = radii;
            this.ellipseSelectionRenderer.sourceTopLeft = {x:0, y:0};
            this.ellipseSelectionRenderer.targetTopLeft = {x: this.startPoint.x-(this.selectionCanvas.width/2-radii.x), y: this.startPoint.y-(this.selectionCanvas.height/2-radii.y)};
            this.ellipseSelectionRenderer.isFillWhiteBehindSelection = true;
            this.ellipseSelectionRenderer.selectionCanvas = this.selectionCanvas;
            this.ellipseSelectionRenderer.ctx = this.drawingService.previewCtx;
            this.ellipseSelectionRenderer.render();

            /*DO NOT DELETE
            => push to stack, notice the difference in the ctx 
            this.ellipseSelectionRenderer.center=center;
            this.ellipseSelectionRenderer.radii =radii;
            this.ellipseSelectionRenderer.sourceTopLeft = topLeft;
            this.ellipseSelectionRenderer.targetTopLeft = topLeft;
            this.ellipseSelectionRenderer.isFillWhiteBehindSelection = false;
            this.ellipseSelectionRenderer.selectionCanvas = this.selectionCanvas;
            this.ellipseSelectionRenderer.ctx = this.drawingService.baseCtx;
            ///////
            this.ellipseSelectionRenderer.render();
            */

            this.selectionService.isSelectionBeingMoved = true;
            this.selectionMoverService.setSelection(this.selectionCanvas, this.selectionCanvasCtx, topLeft, this.finalEndPoint, {x: this.startPoint.x-(this.selectionCanvas.width/2-radii.x), y: this.startPoint.y-(this.selectionCanvas.height/2-radii.y)});
            this.selectionMoverService.initialPos = {x:  this.selectionCanvas.width/2-radii.x- this.startPoint.x , y: this.selectionCanvas.height/2-radii.y- this.startPoint.y};
           
            this.selectionMoverService.canvasClone = canvasClone;
        }

    }
}
