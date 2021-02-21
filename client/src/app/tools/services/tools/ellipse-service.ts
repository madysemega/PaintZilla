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
import { EllipseSelectionHandlerService } from '@app/tools/services/tools/ellipse-selection-handler-service'

@Injectable({
    providedIn: 'root',
})

export class EllipseService extends ShapeTool implements ISelectableTool {
    private startPoint: Vec2 = { x: 0, y: 0 };
    private finalEndPoint: Vec2 = { x: 0, y: 0 };
    private lastMousePosition: Vec2 = { x: 0, y: 0 };

    constructor(drawingService: DrawingService, private selectionService: SelectionService, private selectionMoverService: SelectionMoverService, private selectionHandler: EllipseSelectionHandlerService) {
        super(drawingService);
        this.shapeType = ShapeType.Contoured;
        this.key = 'ellipse';
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
                this.select(this.startPoint, mousePosition, true);
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
                this.select(this.startPoint, this.lastMousePosition, false);
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
                    this.select(this.startPoint, this.lastMousePosition,false);
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
                    this.select(this.startPoint, this.lastMousePosition, false);
                    this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.startPoint, this.lastMousePosition);
                }
            }
        }
    }

    select(startPoint: Vec2, endPoint: Vec2, isFinalDrawing: boolean): void {
        
        if (this.selectionService.isShiftDown) {
            endPoint = this.selectionService.getSquareAjustedPerimeter(startPoint, endPoint);
        }

        let center: Vec2 = { x: 0, y: 0 };
        let radii: Vec2 = { x: 0, y: 0 };
        this.selectionService.getEllipseParam(this.startPoint, endPoint, center, radii);
        this.selectionService.drawSelectionEllipse(center, radii);

        if (isFinalDrawing) {

            let topLeft: Vec2 = this.startPoint;
            this.finalEndPoint = endPoint;
            //console.log(topLeft.x + " "+ topLeft.y + " "+this.finalEndPoint.x +" "+ this.finalEndPoint.y );
            if (startPoint.x > endPoint.x) {
                topLeft.x = endPoint.x;
                this.finalEndPoint.x = startPoint.x;
            }
            if (startPoint.y > endPoint.y) {
                topLeft.y = endPoint.y;
                this.finalEndPoint.y = startPoint.y;
            }
            this.selectionHandler.selectionCanvas.width = this.drawingService.canvas.width;////////////change to 2000?
            this.selectionHandler.selectionCanvas.height = this.drawingService.canvas.height;
            this.selectionHandler.modificationCanvas.width = this.drawingService.canvas.width;
            this.selectionHandler.modificationCanvas.height = this.drawingService.canvas.height;

            this.selectionHandler.selectArea(this.startPoint, radii);
            this.selectionService.drawPostSelectionEllipse(center, radii);
            this.selectionHandler.drawSelection(this.startPoint, this.drawingService.previewCtx);
            this.selectionService.isSelectionBeingMoved = true;
            this.selectionMoverService.setSelection(topLeft, this.finalEndPoint);

        }
            /*this.ellipseSelectionRenderer.center = center;
            this.ellipseSelectionRenderer.radii = radii;
            this.ellipseSelectionRenderer.sourceTopLeft = {x:0, y:0};
            this.ellipseSelectionRenderer.targetTopLeft = {x: this.startPoint.x-(this.selectionCanvas.width/2-radii.x), y: this.startPoint.y-(this.selectionCanvas.height/2-radii.y)};
            this.ellipseSelectionRenderer.isFillWhiteBehindSelection = true;
            this.ellipseSelectionRenderer.selectionCanvas = this.selectionCanvas;
            this.ellipseSelectionRenderer.ctx = this.drawingService.previewCtx;
            this.ellipseSelectionRenderer.render();*/

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
        }
    }
