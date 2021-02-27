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
    private readonly MINIMUM_SELECTION_WIDTH: number = 5;
    private startPoint: Vec2 = { x: 0, y: 0 };
    private lastMousePosition: Vec2 = { x: 0, y: 0 };
    private isShiftDown: boolean;

    constructor(drawingService: DrawingService, private selectionMoverService: SelectionMoverService, private selectionHandler: EllipseSelectionHandlerService, private selectionService: SelectionService) {
        super(drawingService);
        this.shapeType = ShapeType.Contoured;
        this.key = 'ellipse'; //selection-creator
    }

    onMouseDown(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.mouseDown = event.button === MouseButton.Left;

        this.registerMousePosition(mousePosition, true);

        if (this.isSelectionBeingManipulated()) {
            this.selectionMoverService.onMouseDown(event);
        }
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.adjustPositionToStayInCanvas(mousePosition);

        if (this.isSelectionBeingManipulated()) {
            this.selectionMoverService.onMouseMove(event);
            return;
        }

        if (this.mouseDown) {
            this.registerMousePosition(mousePosition, false);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawSelectionOutline(mousePosition);
        }
    }

    onMouseUp(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.adjustPositionToStayInCanvas(mousePosition);
        
        if (this.isSelectionBeingManipulated()) {
            this.selectionMoverService.onMouseUp(event);
            this.mouseDown = false;
            return;
        }

        if (this.mouseDown && this.startPointIsFarEnoughFrom(mousePosition)) {
            this.registerMousePosition(mousePosition, false);
            this.createSelection(this.startPoint, mousePosition);
            this.drawSelectionOutline(mousePosition);
            this.resetProperties();
        }

        this.mouseDown = false;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.isSelectionBeingManipulated()) {
            this.selectionMoverService.onKeyDown(event);
            return;
        }

        if (event.key === 'Shift') {
            this.isShiftDown = true;
        }

        if (this.isShiftDown && this.mouseDown ) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawSelectionOutline(this.lastMousePosition);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.isSelectionBeingManipulated()) {
            this.selectionMoverService.onKeyUp(event);
            return;
        }

        if (event.key === 'Shift') {
            this.isShiftDown = false;
        }

        if (this.isShiftDown && this.mouseDown ) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawSelectionOutline(this.lastMousePosition);
        }
    }

    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
    }

    onToolDeselect(): void {///////////////// resize canvas
        if(this.isSelectionBeingManipulated()){
            this.selectionService.setIsSelectionBeingManipulated(false);
            this.selectionMoverService.stopManipulation();
        }
    }

    createSelection(startPoint: Vec2, endPoint: Vec2): void {
        if (this.isShiftDown) {
            endPoint = this.selectionService.getSquareAjustedPerimeter(startPoint, endPoint);
        }

        this.convertToTopLeftAndBottomRight(startPoint, endPoint);

        let center: Vec2 = { x: 0, y: 0 }, radii: Vec2 = { x: 0, y: 0 };
        this.selectionService.getEllipseParam(startPoint, endPoint, center, radii);

        this.selectionHandler.select(this.drawingService.canvas, startPoint, center, radii);

        this.selectionService.setIsSelectionBeingManipulated(true);
        this.selectionMoverService.initialize(startPoint, endPoint);
    }

    stopManipulatingSelection() {
        if (this.isSelectionBeingManipulated()) {
            this.selectionMoverService.stopManipulation();
        }
    }

    drawSelectionOutline(endPoint: Vec2) {
        let center: Vec2 = { x: 0, y: 0 }, radii = { x: 0, y: 0 };

        if (this.isShiftDown) {
            endPoint = this.selectionService.getSquareAjustedPerimeter(this.startPoint, endPoint);
        }

        this.selectionService.getEllipseParam(this.startPoint, endPoint, center, radii);
        this.selectionService.drawSelectionEllipse(center, radii);
        this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.startPoint, endPoint, this.isShiftDown);
    }

    convertToTopLeftAndBottomRight(startPoint: Vec2, endPoint: Vec2) {
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

    registerMousePosition(mousePos: Vec2, isStartPoint: boolean): void {
        this.lastMousePosition = mousePos

        if (isStartPoint) {
            this.mouseDownCoord = mousePos;
            this.startPoint = mousePos;
        }
    }

    startPointIsFarEnoughFrom(mousePos: Vec2): boolean {
        return Math.sqrt(Math.pow(this.startPoint.x - mousePos.x, 2) + Math.pow(this.startPoint.y - mousePos.y, 2)) > this.MINIMUM_SELECTION_WIDTH;
    }

    isSelectionBeingManipulated(): boolean {
        return this.selectionService.isSelectionBeingManipulated.getValue();
    }

    adjustPositionToStayInCanvas(mousePos: Vec2): void {
        let canvasSize: Vec2 = this.drawingService.canvasSize;
        if (mousePos.x < 0) {
            mousePos.x = 0;
        }
        if (mousePos.x > canvasSize.x) {
            mousePos.x = canvasSize.x;
        }
        if (mousePos.y > canvasSize.y) {
            mousePos.y = canvasSize.y;
        }
        if (mousePos.y < 0) {
            mousePos.y = 0;
        }
    }

    resetProperties(){
        this.startPoint = { x: 0, y: 0 };
        this.lastMousePosition = { x: 0, y: 0 };
        this.isShiftDown = false;
    }
}
