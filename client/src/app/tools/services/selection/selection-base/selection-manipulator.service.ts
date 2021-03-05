import { Injectable } from '@angular/core';
import { HandlerMemento } from '@app/app/classes/handler-memento';
import { ManipulatorMemento } from '@app/app/classes/manipulator-memento';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { UserActionRenderSelection } from '@app/history/user-actions/user-action-render-selection';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { Tool } from '@app/tools/classes/tool';
import { SelectionHelperService } from '@app/tools/services/selection/selection-base/selection-helper.service';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { Arrow } from './arrow';
import { ResizingMode } from './resizing-mode';
import { SelectionHandlerService } from './selection-handler.service';

@Injectable({
    providedIn: 'root',
})
export abstract class SelectionManipulatorService extends Tool {
    readonly MOVEMENT_PX: number = 3;
    readonly TIME_BEFORE_START_MOV: number = 500;
    readonly TIME_BETWEEN_MOV: number = 100;
    readonly OUTSIDE_DETECTION_OFFSET_PX: number = 15;
    readonly NUMBER_OF_ARROW_TYPES: number = 4;
    readonly MOVEMENT_DOWN: Vec2 = { x: 0, y: this.MOVEMENT_PX };
    readonly MOVEMENT_UP: Vec2 = { x: 0, y: -this.MOVEMENT_PX };
    readonly MOVEMENT_LEFT: Vec2 = { x: -this.MOVEMENT_PX, y: 0 };
    readonly MOVEMENT_RIGHT: Vec2 = { x: this.MOVEMENT_PX, y: 0 };

    topLeft: Vec2 = { x: 0, y: 0 };
    bottomRight: Vec2 = { x: 0, y: 0 };
    diagonalSlope: number = 0;
    diagonalYIntercept: number = 0;
    mouseLastPos: Vec2 = { x: 0, y: 0 };
    mouseDownLastPos: Vec2 = { x: 0, y: 0 };
    resizingMode: ResizingMode = ResizingMode.off;
    isShiftDown: boolean = false;
    isReversedX: boolean = false;
    isReversedY: boolean = false;
    arrowKeyDown: boolean[] = [false, false, false, false];
    subscriptions: Subscription[] = [];
    isContinousMovementByKeyboardOn: boolean[] = [false, false, false, false];

    constructor(
        protected drawingService: DrawingService,
        protected selectionService: SelectionHelperService,
        protected selectionHandler: SelectionHandlerService,
        protected historyService: HistoryService,
    ) {
        super(drawingService);
        this.key = 'selection-manipulator';
        this.subscriptions = new Array<Subscription>(this.NUMBER_OF_ARROW_TYPES);
    }

    abstract drawSelectionOutline(): void;

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        const mousePos = this.getPositionFromMouse(event);
        if (!this.mouseDown) {
            return;
        }

        if (this.isClickOutsideSelection(event)) {
            this.stopManipulation(true);
            return;
        }

        this.computeDiagonalEquation();
        this.registerMousePos(mousePos, true);
    }

    onMouseUp(event: MouseEvent): void {
        this.mouseDown = false;
        this.resizingMode = ResizingMode.off;
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);

        if (!this.mouseDown) {
            return;
        }

        this.registerMousePos(mousePosition, false);

        if (this.resizingMode !== ResizingMode.off) {
            this.resizeSelection(mousePosition, this.resizingMode);
            return;
        }
        this.moveSelection(this.selectionService.convertToMovement(mousePosition, this.mouseDownLastPos), true);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.isShiftDown = true;
        }

        if (this.isShiftDown && this.isSelectionBeingResizedDiagonally()) {
            this.resizeSelection(this.mouseLastPos, this.resizingMode);
        }

        if (event.key === 'ArrowUp' && !this.arrowKeyDown[Arrow.up]) {
            this.moveIfPressLongEnough(this.MOVEMENT_UP, Arrow.up);
        }

        if (event.key === 'ArrowDown' && !this.arrowKeyDown[Arrow.down]) {
            this.moveIfPressLongEnough(this.MOVEMENT_DOWN, Arrow.down);
        }

        if (event.key === 'ArrowLeft' && !this.arrowKeyDown[Arrow.left]) {
            this.moveIfPressLongEnough(this.MOVEMENT_LEFT, Arrow.left);
        }

        if (event.key === 'ArrowRight' && !this.arrowKeyDown[Arrow.right]) {
            this.moveIfPressLongEnough(this.MOVEMENT_RIGHT, Arrow.right);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.isShiftDown = false;
        }

        if (event.key === 'Shift' && this.isSelectionBeingResizedDiagonally()) {
            this.resizeSelection(this.mouseLastPos, this.resizingMode);
        }

        if (event.key === 'ArrowDown') {
            this.singleMove(Arrow.down, this.MOVEMENT_DOWN);
        }

        if (event.key === 'ArrowUp') {
            this.singleMove(Arrow.up, this.MOVEMENT_UP);
        }

        if (event.key === 'ArrowLeft') {
            this.singleMove(Arrow.left, this.MOVEMENT_LEFT);
        }

        if (event.key === 'ArrowRight') {
            this.singleMove(Arrow.right, this.MOVEMENT_RIGHT);
        }
    }

    initialize(vertices: Vec2[]): void {
        this.resetProperties();
        const topLeft = vertices[0];
        const bottomRight = vertices[1];
        this.topLeft = { x: topLeft.x, y: topLeft.y };
        this.bottomRight = { x: bottomRight.x, y: bottomRight.y };
        this.computeDiagonalEquation();
        this.selectionHandler.select(this.drawingService.canvas, vertices);
    }

    moveSelection(movement: Vec2, isMouseMovement: boolean): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.addMovementToPositions(movement, isMouseMovement);
        this.drawSelection();
    }

    drawSelection(): void {
        this.selectionHandler.drawSelection(this.drawingService.previewCtx, this.topLeft);
        this.drawSelectionOutline();
    }

    resizeSelection(newPos: Vec2, direction: ResizingMode): void {
        if (this.isShiftDown && this.isSelectionBeingResizedDiagonally()) {
            newPos = this.getMousePosOnDiagonal(newPos);
        }

        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        if (
            direction === ResizingMode.towardsBottom ||
            direction === ResizingMode.towardsBottomRight ||
            direction === ResizingMode.towardsBottomLeft
        ) {
            this.bottomRight.y = newPos.y;
            this.isReversedY = newPos.y < this.topLeft.y;
            this.selectionHandler.resizeSelection(this.topLeft, newPos, false);
        }
        if (direction === ResizingMode.towardsTop || direction === ResizingMode.towardsTopRight || direction === ResizingMode.towardsTopLeft) {
            this.topLeft.y = newPos.y;
            this.isReversedY = newPos.y > this.bottomRight.y;
            this.selectionHandler.resizeSelection(newPos, this.bottomRight, false);
        }
        if (direction === ResizingMode.towardsRight || direction === ResizingMode.towardsTopRight || direction === ResizingMode.towardsBottomRight) {
            this.bottomRight.x = newPos.x;
            this.isReversedX = newPos.x < this.topLeft.x;
            this.selectionHandler.resizeSelection(this.topLeft, newPos, true);
        }
        if (direction === ResizingMode.towardsLeft || direction === ResizingMode.towardsTopLeft || direction === ResizingMode.towardsBottomLeft) {
            this.topLeft.x = newPos.x;
            this.isReversedX = newPos.x > this.bottomRight.x;
            this.selectionHandler.resizeSelection(newPos, this.bottomRight, true);
        }
        this.selectionHandler.drawSelection(this.drawingService.previewCtx, this.topLeft);
        this.drawSelectionOutline();
    }

    stopManipulation(needDrawSelection: boolean): void {
        this.selectionService.setIsSelectionBeingManipulated(false);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (needDrawSelection) {
            if (this.selectionHandler.drawSelection(this.drawingService.baseCtx, this.topLeft)) {
                const memento: HandlerMemento = this.selectionHandler.createMemento();
                const userAction: UserActionRenderSelection = new UserActionRenderSelection(this.drawingService, this.selectionHandler, memento, {
                    x: this.topLeft.x,
                    y: this.topLeft.y,
                });
                this.historyService.register(userAction);
            }
        }
        this.subscriptions.forEach((sub) => {
            sub.unsubscribe();
        });
        this.resetProperties();
    }

    startMovingSelectionContinous(movement: Vec2, arrowIndex: number): void {
        this.subscriptions[arrowIndex].unsubscribe();
        const source = interval(this.TIME_BETWEEN_MOV).pipe(takeWhile(() => this.arrowKeyDown[arrowIndex]));
        this.subscriptions[arrowIndex] = source.subscribe(() => this.moveSelection(movement, false));
        this.isContinousMovementByKeyboardOn[arrowIndex] = true;
    }

    addMovementToPositions(mouseMovement: Vec2, isMouseMovement: boolean): void {
        if (isMouseMovement) {
            this.selectionService.add(this.mouseDownLastPos, mouseMovement);
        }
        this.selectionService.add(this.topLeft, mouseMovement);
        this.selectionService.add(this.bottomRight, mouseMovement);
    }

    moveIfPressLongEnough(movement: Vec2, arrowIndex: number): void {
        this.arrowKeyDown[arrowIndex] = true;
        const source = interval(this.TIME_BEFORE_START_MOV);
        this.subscriptions[arrowIndex] = source.subscribe((val) => {
            this.startMovingSelectionContinous(movement, arrowIndex);
        });
    }

    stopContinuousMovement(arrowIndex: number): void {
        this.subscriptions[arrowIndex].unsubscribe();
        if (this.isContinousMovementByKeyboardOn[arrowIndex]) {
            this.isContinousMovementByKeyboardOn[arrowIndex] = false;
            return;
        }
    }

    singleMove(arrowIndex: number, singleMovement: Vec2): void {
        this.arrowKeyDown[arrowIndex] = false;
        this.stopContinuousMovement(arrowIndex);
        this.moveSelection(singleMovement, false);
    }

    registerMousePos(mousePos: Vec2, isMouseDownLastPos: boolean): void {
        this.mouseLastPos.x = mousePos.x;
        this.mouseLastPos.y = mousePos.y;

        if (isMouseDownLastPos) {
            this.mouseDownLastPos.x = mousePos.x;
            this.mouseDownLastPos.y = mousePos.y;
        }
    }

    computeDiagonalEquation(): void {
        const deltaY = this.topLeft.y - this.bottomRight.y;
        const deltaX = this.bottomRight.x - this.topLeft.x;
        this.diagonalSlope = deltaY / deltaX;
        if (this.resizingMode === ResizingMode.towardsBottomRight || this.resizingMode === ResizingMode.towardsTopLeft) {
            this.diagonalSlope = -this.diagonalSlope;
            this.diagonalYIntercept = this.topLeft.y - this.topLeft.x * this.diagonalSlope;
            return;
        }
        this.diagonalYIntercept = this.bottomRight.y - this.topLeft.x * this.diagonalSlope;
    }

    getMousePosOnDiagonal(mousePos: Vec2): Vec2 {
        return { x: mousePos.x, y: mousePos.x * this.diagonalSlope + this.diagonalYIntercept };
    }

    isSelectionBeingResizedDiagonally(): boolean {
        return (
            this.resizingMode === ResizingMode.towardsBottomLeft ||
            this.resizingMode === ResizingMode.towardsBottomRight ||
            this.resizingMode === ResizingMode.towardsTopLeft ||
            this.resizingMode === ResizingMode.towardsTopRight
        );
    }

    isClickOutsideSelection(event: MouseEvent): boolean {
        const mousePosition = this.getPositionFromMouse(event);
        const positions: Vec2[] = [];
        positions.push(mousePosition, this.topLeft, this.bottomRight);
        return this.selectionService.isClickOutsideSelection(positions, this.isReversedX, this.isReversedY);
    }

    isAnArrowKeyPressed(): boolean {
        let isAnyArrowKeyDown = false;
        this.arrowKeyDown.forEach((element) => {
            if (element) {
                isAnyArrowKeyDown = true;
            }
        });
        return isAnyArrowKeyDown;
    }

    resetProperties(): void {
        this.diagonalSlope = 0;
        this.diagonalYIntercept = 0;
        this.topLeft = { x: 0, y: 0 };
        this.bottomRight = { x: 0, y: 0 };
        this.mouseLastPos = { x: 0, y: 0 };
        this.mouseDownLastPos = { x: 0, y: 0 };
        this.resizingMode = ResizingMode.off;
        this.mouseDown = false;
        this.isShiftDown = false;
        this.isReversedY = false;
        this.isReversedX = false;
    }

    createMemento(): ManipulatorMemento {
        const memento: ManipulatorMemento = new ManipulatorMemento();
        memento.topLeft = { x: this.topLeft.x, y: this.topLeft.y };
        memento.bottomRight = { x: this.bottomRight.x, y: this.bottomRight.y };
        memento.diagonalSlope = this.diagonalSlope;
        memento.diagonalYIntercept = this.diagonalYIntercept;
        memento.mouseLastPos = { x: this.mouseLastPos.x, y: this.mouseLastPos.y };
        memento.isReversedX = this.isReversedX;
        memento.isReversedY = this.isReversedY;
        return memento;
    }

    restoreFromMemento(memento: ManipulatorMemento): void {
        this.resetProperties();
        this.stopManipulation(false);
        this.topLeft = { x: memento.topLeft.x, y: memento.topLeft.y };
        this.bottomRight = { x: memento.bottomRight.x, y: memento.bottomRight.y };
        this.diagonalSlope = memento.diagonalSlope;
        this.diagonalYIntercept = memento.diagonalYIntercept;
        this.mouseLastPos = { x: memento.mouseLastPos.x, y: memento.mouseLastPos.y };
        this.isReversedX = memento.isReversedX;
        this.isReversedY = memento.isReversedY;
    }
}
