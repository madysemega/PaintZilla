import { Injectable } from '@angular/core';
import { HandlerMemento } from '@app/app/classes/handler-memento';
import { ManipulatorMemento } from '@app/app/classes/manipulator-memento';
import { Vec2 } from '@app/app/classes/vec2';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { IDeselectableTool } from '@app/tools/classes/deselectable-tool';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';
import { Tool } from '@app/tools/classes/tool';
import { SelectionManipulatorService } from '@app/tools/services/selection/selection-base/selection-manipulator.service';
import { ClipboardService } from '../clipboard/clipboard.service';
import { SelectionHelperService } from './selection-helper.service';

@Injectable({
    providedIn: 'root',
})
export abstract class SelectionCreatorService extends Tool implements ISelectableTool, IDeselectableTool {
    readonly MINIMUM_SELECTION_WIDTH: number = 5;

    startPoint: Vec2 = { x: 0, y: 0 };
    lastMousePosition: Vec2 = { x: 0, y: 0 };

    isShiftDown: boolean;

    constructor(
        drawingService: DrawingService,
        public selectionManipulator: SelectionManipulatorService,
        public selectionHelper: SelectionHelperService,
        private clipboardService: ClipboardService
    ) {
        super(drawingService);
    }

    abstract drawSelectionOutline(endPoint: Vec2): void;

    onMouseDown(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.mouseDown = event.button === MouseButton.Left;

        this.registerMousePosition(mousePosition, true);

        if (this.isSelectionBeingManipulated()) {
            this.selectionManipulator.onMouseDown(event);
        } else {
            this.selectionManipulator.historyService.isLocked = true;
        }
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.adjustPositionToStayInCanvas(mousePosition);

        if (this.isSelectionBeingManipulated()) {
            this.selectionManipulator.onMouseMove(event);
            return;
        }

        if (this.mouseDown) {
            this.selectionManipulator.historyService.isLocked = true;
            this.registerMousePosition(mousePosition, false);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawSelectionOutline(mousePosition);
        }
    }

    onMouseUp(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.adjustPositionToStayInCanvas(mousePosition);

        if (this.isSelectionBeingManipulated()) {
            this.selectionManipulator.onMouseUp(event);
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
        if (event.key === 'Escape') {
            this.resetProperties();
            this.stopManipulatingSelection();
        }

        if (this.isSelectionBeingManipulated()) {
            this.selectionManipulator.onKeyDown(event);
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
        const isCtrl: boolean = event.ctrlKey;
        const isC: boolean = event.key === 'c';
        const isX: boolean = event.key === 'x';
        const isDel: boolean = event.key === 'Delete';
        
        if (this.isSelectionBeingManipulated()) {
            if (isCtrl && isC) {
                let manipulatorMemento: ManipulatorMemento = this.selectionManipulator.createMemento();
                let handlerMemento: HandlerMemento = this.selectionManipulator.selectionHandler.createMemento();
                this.clipboardService.copy(manipulatorMemento, handlerMemento, this);
                return;
            }

            if (isCtrl && isX) {
                let manipulatorMemento: ManipulatorMemento = this.selectionManipulator.createMemento();
                let handlerMemento: HandlerMemento = this.selectionManipulator.selectionHandler.createMemento();
                this.clipboardService.cut(manipulatorMemento, handlerMemento, this);
                this.selectionManipulator.stopManipulation(false);
                return;
            }

            if(isDel){
                this.selectionManipulator.delete();
            }

            this.selectionManipulator.onKeyUp(event);
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
            endPoint = this.selectionHelper.getSquareAdjustedPerimeter(startPoint, endPoint);
        }

        this.convertToTopLeftAndBottomRight(startPoint, endPoint);

        const vertices: Vec2[] = [];
        vertices.push(startPoint);
        vertices.push(endPoint);

        this.selectionHelper.setIsSelectionBeingManipulated(true);
        this.selectionManipulator.initialize(vertices);
        this.clipboardService.applyWhiteFill = true;
    }

    stopManipulatingSelection(): void {
        if (this.isSelectionBeingManipulated()) {
            this.selectionManipulator.stopManipulation(true);
            this.selectionHelper.setIsSelectionBeingManipulated(false);
            return;
        }
        this.selectionManipulator.stopManipulation(false);
    }

    convertToTopLeftAndBottomRight(startPoint: Vec2, endPoint: Vec2): void {
        const startPointCopy: Vec2 = { x: startPoint.x, y: startPoint.y }; // was this.startPoint

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
        this.lastMousePosition = mousePos;

        if (isStartPoint) {
            this.mouseDownCoord = mousePos;
            this.startPoint = mousePos;
        }
    }

    startPointIsFarEnoughFrom(mousePos: Vec2): boolean {
        return Math.sqrt(Math.pow(this.startPoint.x - mousePos.x, 2) + Math.pow(this.startPoint.y - mousePos.y, 2)) > this.MINIMUM_SELECTION_WIDTH;
    }

    isSelectionBeingManipulated(): boolean {
        return this.selectionHelper.isSelectionBeingManipulated.getValue();
    }

    adjustPositionToStayInCanvas(mousePos: Vec2): void {
        const canvasSize: Vec2 = this.drawingService.canvasSize;
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

    resetProperties(): void {
        this.startPoint = { x: 0, y: 0 };
        this.lastMousePosition = { x: 0, y: 0 };
        this.mouseDown = false;
        this.isShiftDown = false;
    }
}
