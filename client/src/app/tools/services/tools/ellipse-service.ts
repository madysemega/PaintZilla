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
    private readonly MINIMUM_SELECTION_WIDTH : number = 5;
    private startPoint: Vec2 = { x: 0, y: 0 };
    private lastMousePosition: Vec2 = { x: 0, y: 0 };
    private isShiftDown : boolean;


    constructor(drawingService: DrawingService, private selectionMoverService: SelectionMoverService, private selectionHandler: EllipseSelectionHandlerService, private selectionService: SelectionService) {
        super(drawingService);
        this.shapeType = ShapeType.Contoured;
        this.key = 'ellipse'; //selection-creator
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
            if (this.mouseDown && this.startPointIsFarEnoughFrom(mousePosition)) {
                this.lastMousePosition = mousePosition;
                this.select(this.startPoint, mousePosition);
                this.drawSelectionOutline(mousePosition);
            }
            this.mouseDown = false;
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.isSelectionBeingManipulated()) {
            this.selectionMoverService.onKeyDown(event);
        }
        else if (event.key === 'Shift') {
            this.isShiftDown = true;
            if (!this.selectionService.isSelectionBeingManipulated.getValue()) {
                if (this.mouseDown) {
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    //this.select(this.startPoint, this.lastMousePosition);
                    //this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.startPoint, this.lastMousePosition, this.isShiftDown);
                    this.drawSelectionOutline(this.lastMousePosition);
                }
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.isSelectionBeingManipulated()) {
            this.selectionMoverService.onKeyUp(event);
        }
        else if (event.key === 'Shift') {
            this.isShiftDown = false;
            if (!this.selectionService.isSelectionBeingManipulated.getValue()) {
                if (this.mouseDown) {
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    //this.select(this.startPoint, this.lastMousePosition);
                    this.drawSelectionOutline(this.lastMousePosition);
                }
            }
        }
    }

    drawSelectionOutline(endPoint: Vec2) {
        let center: Vec2 = { x: 0, y: 0 }, radii = { x: 0, y: 0 };
        if(this.isShiftDown){
            endPoint = this.selectionService.getSquareAjustedPerimeter(this.startPoint, endPoint);
        }
        this.selectionService.getEllipseParam(this.startPoint, endPoint, center, radii);
        this.selectionService.drawSelectionEllipse(center, radii);
        this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.startPoint, endPoint, this.isShiftDown );
    }

    select(startPoint: Vec2, endPoint: Vec2): void {
        if (this.isShiftDown) {
            endPoint = this.selectionService.getSquareAjustedPerimeter(startPoint, endPoint);
        }

        this.setTopLeftBottomRight(startPoint, endPoint);

        let center: Vec2 = { x: 0, y: 0 }, radii: Vec2 = { x: 0, y: 0 };
        this.selectionService.getEllipseParam(startPoint, endPoint, center, radii);
        this.selectionHandler.selectArea(startPoint, center, radii);
        this.drawSelectionOutline(endPoint);
        this.setIsSelectionBeingManipulated(true);
        this.selectionMoverService.setSelection(startPoint, endPoint);
    }

    setTopLeftBottomRight(startPoint: Vec2, endPoint: Vec2) {
        let startPointCopy: Vec2 = { x: this.startPoint.x, y: this.startPoint.y };
        if (startPoint.x > endPoint.x) {
            startPoint.x = endPoint.x;
            endPoint.x = startPointCopy.x;
        }
        if (startPoint.y > endPoint.y) {
            startPoint.y = endPoint.y;
            endPoint.y = startPointCopy.y;
        }
    }

    startPointIsFarEnoughFrom(mousePos: Vec2): boolean {
        return Math.sqrt(Math.pow(this.startPoint.x - mousePos.x, 2) + Math.pow(this.startPoint.y - mousePos.y, 2)) > this.MINIMUM_SELECTION_WIDTH;
    }

    setIsSelectionBeingManipulated(isItBeingManipulated: boolean) {
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
