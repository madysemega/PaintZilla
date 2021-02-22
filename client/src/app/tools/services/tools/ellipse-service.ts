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
    private lastMousePosition: Vec2 = { x: 0, y: 0 };

    constructor(drawingService: DrawingService, private selectionMoverService: SelectionMoverService, private selectionHandler: EllipseSelectionHandlerService, private selectionService: SelectionService) {
        super(drawingService);
        this.shapeType = ShapeType.Contoured;
        this.key = 'ellipse';
    }

    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
    }

    onToolDeselect(): void {
        this.setIsSelectionBeingManipulated(false);
    }

    onMouseDown(event: MouseEvent): void {
        if (this.isSelectionBeingManipulated()) {
            this.selectionMoverService.onMouseDown(event);
        }
        this.registerMousePosition(event);
        
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.isSelectionBeingManipulated()) {
            this.selectionMoverService.onMouseMove(event);
        }
        else {
            if (this.mouseDown) {
                this.lastMousePosition = mousePosition;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawSelectionOutline(mousePosition);
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.isSelectionBeingManipulated()) {
            this.selectionMoverService.onMouseUp(event);
        }
        else {
            if (this.mouseDown) {
                if(this.startPointIsFarEnoughFrom(mousePosition)){
                    this.lastMousePosition = mousePosition;
                    this.select(this.startPoint, mousePosition);
                    this.drawSelectionOutline(mousePosition);
                }
            }
            this.mouseDown = false;
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.selectionService.isSelectionBeingManipulated.getValue()) {
            this.selectionMoverService.onKeyDown(event);
        }
        if (event.key === 'Shift') {
            this.selectionService.isShiftDown = true;
            if (!this.selectionService.isSelectionBeingManipulated.getValue()) {
                if (this.mouseDown) {
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.select(this.startPoint, this.lastMousePosition);
                    this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.startPoint, this.lastMousePosition);
                }
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.selectionService.isSelectionBeingManipulated.getValue()) {
            this.selectionMoverService.onKeyUp(event);
        }
        if (event.key === 'Shift') {
            this.selectionService.isShiftDown = false;
            if (!this.selectionService.isSelectionBeingManipulated.getValue()) {
                if (this.mouseDown) {
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.select(this.startPoint, this.lastMousePosition);
                    this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.startPoint, this.lastMousePosition);
                }
            }
        }
    }

    drawSelectionOutline(endPoint: Vec2) {
        let center: Vec2 = { x: 0, y: 0 };
        let radii: Vec2 = { x: 0, y: 0 };
        this.selectionService.getEllipseParam(this.startPoint, endPoint, center, radii);
        this.selectionService.drawSelectionEllipse(center, radii);
        this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.startPoint, endPoint);
    }

    select(startPoint: Vec2, endPoint: Vec2): void {

        if (this.selectionService.isShiftDown) {
            endPoint = this.selectionService.getSquareAjustedPerimeter(startPoint, endPoint);
        }

        let startPointCopy: Vec2 = {x: this.startPoint.x, y: this.startPoint.y};
    
        if (startPoint.x > endPoint.x) {
            startPoint.x = endPoint.x;
            endPoint.x = startPointCopy.x;
        }
        if (startPoint.y > endPoint.y) {
            startPoint.y = endPoint.y;
            endPoint.y = startPointCopy.y;
        }

        this.selectionHandler.selectionCanvas.width = this.drawingService.canvas.width;////////////change to 2000?
        this.selectionHandler.selectionCanvas.height = this.drawingService.canvas.height;
        this.selectionHandler.modificationCanvas.width = this.drawingService.canvas.width;
        this.selectionHandler.modificationCanvas.height = this.drawingService.canvas.height;

        let center: Vec2 = { x: 0, y: 0 };
        let radii: Vec2 = { x: 0, y: 0 };
        this.selectionService.getEllipseParam(startPoint, endPoint, center, radii);
    
        this.selectionHandler.selectArea(startPoint, center, radii);
        this.drawSelectionOutline(endPoint);
        this.selectionService.isSelectionBeingManipulated.next(true);
        this.selectionMoverService.setSelection(startPoint, endPoint);
    }

    startPointIsFarEnoughFrom(mousePos : Vec2): boolean{
        return Math.sqrt(Math.pow(this.startPoint.x -mousePos.x,2 )  +  Math.pow(this.startPoint.y - mousePos.y,2)) >5;
    }

    setIsSelectionBeingManipulated(isItBeingManipulated: boolean){
        this.selectionService.isSelectionBeingManipulated.next(isItBeingManipulated);
    }

    isSelectionBeingManipulated(): boolean {
        return this.selectionService.isSelectionBeingManipulated.getValue();
    }

    registerMousePosition(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.lastMousePosition = this.mouseDownCoord;
        this.startPoint = this.mouseDownCoord;
    }
}
