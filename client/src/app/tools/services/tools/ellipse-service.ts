import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/app/classes/shape-tool';
import { ShapeType } from '@app/app/classes/shape-type';
import { Vec2 } from '@app/app/classes/vec2';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';
import { SelectionMoverService } from '@app/tools/services/tools/selection-mover.service'
import { EllipseSelectionHandlerService } from '@app/tools/services/tools/ellipse-selection-handler-service'
import { SelectionService } from './selection.service';
import { IDeselectableTool } from '@app/tools/classes/deselectable-tool';

@Injectable({
    providedIn: 'root',
})

export class EllipseService extends ShapeTool implements ISelectableTool, IDeselectableTool {
    private startPoint: Vec2 = { x: 0, y: 0 };
    private finalEndPoint: Vec2 = { x: 0, y: 0 };
    private lastMousePosition: Vec2 = { x: 0, y: 0 };

    constructor(drawingService: DrawingService, private selectionMoverService: SelectionMoverService, private selectionHandler: EllipseSelectionHandlerService, private selectionService: SelectionService) {
        super(drawingService);
        this.shapeType = ShapeType.Contoured;
        this.key = 'ellipse';
    }

    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
    }

    onToolDeselect():void{
        this.selectionService.isSelectionBeingMoved.next(false);
    }

    isSelectionBeingManipulated(): boolean{
        return this.selectionService.isSelectionBeingMoved.getValue();
    }

    onMouseDown(event: MouseEvent): void {
        if (this.selectionService.isSelectionBeingMoved.getValue()) {
            this.selectionMoverService.onMouseDown(event);
        }
        else{
            this.mouseDown = event.button === MouseButton.Left;
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.lastMousePosition = this.mouseDownCoord;
            this.startPoint = this.mouseDownCoord;
        }
    }

     onMouseUp(event: MouseEvent): void {
        if (this.selectionService.isSelectionBeingMoved.getValue()) {
            this.selectionMoverService.onMouseUp(event);
            console.log("stillInMover");
        }
        else {
            if (this.mouseDown) {
                console.log("notInMoverAnymore");
                const mousePosition = this.getPositionFromMouse(event);
                this.lastMousePosition = mousePosition;
                this.select(this.startPoint, mousePosition, true);
                this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.startPoint, mousePosition)
            }
            this.mouseDown = false;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.selectionService.isSelectionBeingMoved.getValue()) {
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
        if (this.selectionService.isSelectionBeingMoved.getValue()) {
            this.selectionMoverService.onKeyDown(event);
        }
        if (event.key === 'Shift') {
            this.selectionService.isShiftDown = true;
            if (!this.selectionService.isSelectionBeingMoved.getValue()) {
                if (this.mouseDown) {
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.select(this.startPoint, this.lastMousePosition,false);
                    this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.startPoint, this.lastMousePosition);
                }
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.selectionService.isSelectionBeingMoved.getValue()) {
            this.selectionMoverService.onKeyUp(event);
        }
        if (event.key === 'Shift') {
            this.selectionService.isShiftDown = false;
            if (!this.selectionService.isSelectionBeingMoved.getValue()) {
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
            console.log("setting to true");
            this.selectionService.isSelectionBeingMoved.next(true);
            this.selectionMoverService.setSelection(topLeft, this.finalEndPoint);
        }
        }
    }
