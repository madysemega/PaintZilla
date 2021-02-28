import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';
import { SelectionManipulatorService } from '@app/tools/services/selection/selection-base/selection-manipulator.service'
import { IDeselectableTool } from '@app/tools/classes/deselectable-tool';
import { SelectionHandlerService } from './selection-handler.service';
import { Tool } from '@app/tools/classes/tool';
import { SelectionService } from './selection.service';

@Injectable({
    providedIn: 'root',
})
export abstract class SelectionCreatorService extends Tool implements ISelectableTool, IDeselectableTool {
    private readonly MINIMUM_SELECTION_WIDTH: number = 5;
    protected startPoint: Vec2 = { x: 0, y: 0 };
    private lastMousePosition: Vec2 = { x: 0, y: 0 };
    protected isShiftDown: boolean;

    constructor(drawingService: DrawingService, protected selectionManipulatorService: SelectionManipulatorService, protected selectionHandler: SelectionHandlerService, protected selectionService: SelectionService) {
        super(drawingService);
        this.key = 'ellipse-selection';
    }

    abstract drawSelectionOutline(endPoint: Vec2): void;

    onMouseDown(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.mouseDown = event.button === MouseButton.Left;

        this.registerMousePosition(mousePosition, true);

        if (this.isSelectionBeingManipulated()) {
            this.selectionManipulatorService.onMouseDown(event);
        }
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.adjustPositionToStayInCanvas(mousePosition);

        if (this.isSelectionBeingManipulated()) {
            this.selectionManipulatorService.onMouseMove(event);
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
            this.selectionManipulatorService.onMouseUp(event);
            this.mouseDown = false;
            return;
        }

        if (this.mouseDown && this.startPointIsFarEnoughFrom(mousePosition)) {
            this.registerMousePosition(mousePosition, false);
            this.createSelection(this.startPoint, mousePosition);
            this.resetProperties();
        }

        this.mouseDown = false;
    }

    onKeyDown(event: KeyboardEvent): void {

        //////////////////FOR TESTING PURPOSES/////////////////////
        if (event.key == 'k') {
            this.selectionHandler.restoreFromMemento(this.selectionService.memento);
            this.selectionHandler.drawSelection(this.drawingService.baseCtx, this.selectionService.where);
        }
        //////////////////FOR TESTING PURPOSES/////////////////////

        if (this.isSelectionBeingManipulated()) {
            this.selectionManipulatorService.onKeyDown(event);
            return;
        }

        if (event.key === 'Shift') {
            this.isShiftDown = true;
        }

        if (this.isShiftDown && this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawSelectionOutline(this.lastMousePosition);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.isSelectionBeingManipulated()) {
            this.selectionManipulatorService.onKeyUp(event);
            return;
        }

        if (event.key === 'Shift') {
            this.isShiftDown = false;
        }

        if (event.key === 'Shift' && this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawSelectionOutline(this.lastMousePosition);
        }
    }

    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
    }

    onToolDeselect(): void {
        this.resetProperties();
        this.stopManipulatingSelection();
    }

    createSelection(startPoint: Vec2, endPoint: Vec2): void {
        if (this.isShiftDown) {
            endPoint = this.selectionService.getSquareAjustedPerimeter(startPoint, endPoint);
        }

        this.convertToTopLeftAndBottomRight(startPoint, endPoint);

        let vertices: Vec2[] = [];
        vertices.push(startPoint);
        vertices.push(endPoint);
        this.selectionHandler.select(this.drawingService.canvas, vertices);

        this.selectionService.setIsSelectionBeingManipulated(true);
        this.selectionManipulatorService.initialize(startPoint, endPoint);
    }

    stopManipulatingSelection() {
        if (this.isSelectionBeingManipulated()) {
            this.selectionManipulatorService.stopManipulation(true);
            this.selectionService.setIsSelectionBeingManipulated(false);
            return;
        }
        this.selectionManipulatorService.stopManipulation(false);
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

    resetProperties() {
        this.startPoint = { x: 0, y: 0 };
        this.lastMousePosition = { x: 0, y: 0 };
        this.mouseDown = false;
        this.isShiftDown = false;
    }
}
