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
import { GridMovement } from './grid-movement';
import { ResizingMode } from './resizing-mode';
import {
    Arrow,
    GridMovementAnchor,
    MAGNETISM_OFF,
    MOVEMENT_DOWN,
    MOVEMENT_LEFT,
    MOVEMENT_RIGHT,
    MOVEMENT_UP,
    NUMBER_OF_ARROW_TYPES,
    TIME_BEFORE_START_MOV,
    TIME_BETWEEN_MOV,
} from './selection-constants';
import { SelectionHandlerService } from './selection-handler.service';

@Injectable({
    providedIn: 'root',
})
export abstract class SelectionManipulatorService extends Tool {
    isMagnetismActivated: boolean = false;
    gridCellSize: number = 50;
    gridMovementAnchor: GridMovementAnchor = GridMovementAnchor.topL;
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

    abstract drawSelectionOutline(): void;

    constructor(
        protected drawingService: DrawingService,
        protected selectionHelper: SelectionHelperService,
        public selectionHandler: SelectionHandlerService,
        public historyService: HistoryService,
    ) {
        super(drawingService);
        this.key = 'selection-manipulator';
        this.subscriptions = new Array<Subscription>(NUMBER_OF_ARROW_TYPES);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (!this.mouseDown) {
            return;
        }
        if (this.isClickOutsideSelection(event)) {
            this.stopManipulation(true);
            return;
        }
        this.computeDiagonalEquation();
        this.registerMousePos(this.getPositionFromMouse(event), true);
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
        this.moveSelection(this.selectionHelper.sub(mousePosition, this.mouseDownLastPos), true);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.isShiftDown = true;
        }
        if (this.isShiftDown && this.isSelectionBeingResizedDiagonally()) {
            this.resizeSelection(this.mouseLastPos, this.resizingMode);
        }
        if (event.key === 'ArrowUp' && !this.arrowKeyDown[Arrow.up]) {
            this.moveIfPressLongEnough(MOVEMENT_UP, Arrow.up);
        }
        if (event.key === 'ArrowDown' && !this.arrowKeyDown[Arrow.down]) {
            this.moveIfPressLongEnough(MOVEMENT_DOWN, Arrow.down);
        }
        if (event.key === 'ArrowLeft' && !this.arrowKeyDown[Arrow.left]) {
            this.moveIfPressLongEnough(MOVEMENT_LEFT, Arrow.left);
        }
        if (event.key === 'ArrowRight' && !this.arrowKeyDown[Arrow.right]) {
            this.moveIfPressLongEnough(MOVEMENT_RIGHT, Arrow.right);
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
            this.singleMove(Arrow.down, MOVEMENT_DOWN);
        }
        if (event.key === 'ArrowUp') {
            this.singleMove(Arrow.up, MOVEMENT_UP);
        }
        if (event.key === 'ArrowLeft') {
            this.singleMove(Arrow.left, MOVEMENT_LEFT);
        }
        if (event.key === 'ArrowRight') {
            this.singleMove(Arrow.right, MOVEMENT_RIGHT);
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
        this.drawSelectionOutline();
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
            this.updatePositions(false, newPos, false);
        }
        if (direction === ResizingMode.towardsTop || direction === ResizingMode.towardsTopRight || direction === ResizingMode.towardsTopLeft) {
            this.updatePositions(true, newPos, false);
        }
        if (direction === ResizingMode.towardsRight || direction === ResizingMode.towardsTopRight || direction === ResizingMode.towardsBottomRight) {
            this.updatePositions(false, newPos, true);
        }
        if (direction === ResizingMode.towardsLeft || direction === ResizingMode.towardsTopLeft || direction === ResizingMode.towardsBottomLeft) {
            this.updatePositions(true, newPos, true);
        }
        this.selectionHandler.drawSelection(this.drawingService.previewCtx, this.topLeft);
        this.drawSelectionOutline();
    }

    updatePositions(isTopLeftUpdate: boolean, newPos: Vec2, isUpdateX: boolean): void {
        const corners: Vec2[] = isTopLeftUpdate ? [this.topLeft, this.bottomRight] : [this.bottomRight, this.topLeft];
        if (isUpdateX) {
            corners[0].x = newPos.x;
            this.isReversedX = this.topLeft.x > this.bottomRight.x;
        } else {
            corners[0].y = newPos.y;
            this.isReversedY = this.topLeft.y > this.bottomRight.y;
        }
        this.selectionHandler.resizeSelection(this.topLeft, this.bottomRight, isUpdateX);
    }

    delete(): void {
        if (this.selectionHandler.makeWhiteBehindSelection()) {
            this.registerAction(true);
        }
        this.stopManipulation(false);
    }

    stopManipulation(needDrawSelection: boolean): void {
        this.selectionHelper.setIsSelectionBeingManipulated(false);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (needDrawSelection) {
            if (this.selectionHandler.drawSelection(this.drawingService.baseCtx, this.topLeft)) {
                this.registerAction(false);
            }
        }
        this.historyService.isLocked = false;
        this.subscriptions.forEach((sub) => {
            sub.unsubscribe();
        });
        this.resetProperties();
    }

    registerAction(allWhite: boolean): void {
        const memento: HandlerMemento = this.selectionHandler.createMemento();
        const userAction: UserActionRenderSelection = new UserActionRenderSelection(
            this.drawingService,
            this.selectionHandler,
            memento,
            {
                x: this.topLeft.x,
                y: this.topLeft.y,
            },
            allWhite,
        );
        this.historyService.register(userAction);
    }

    startMovingSelectionContinous(movement: Vec2, arrowIndex: number): void {
        this.subscriptions[arrowIndex].unsubscribe();
        const source = interval(TIME_BETWEEN_MOV).pipe(takeWhile(() => this.arrowKeyDown[arrowIndex]));
        this.subscriptions[arrowIndex] = source.subscribe(() => this.moveSelection(movement, false));
        this.isContinousMovementByKeyboardOn[arrowIndex] = true;
    }

    addMovementToPositions(movement: Vec2, isMouseMovement: boolean): void {
        const cellSize: number = this.isMagnetismActivated ? this.gridCellSize : MAGNETISM_OFF;
        const gridMovement: GridMovement = {
            movement,
            isMouseMovement,
            gridCellSize: cellSize,
            anchor: this.gridMovementAnchor,
            topLeft: this.topLeft,
            bottomRight: this.bottomRight,
            isReversed: [this.isReversedX, this.isReversedY],
        };
        movement = this.selectionHelper.moveAlongTheGrid(gridMovement);
        this.selectionHelper.addInPlace(this.topLeft, movement);
        this.selectionHelper.addInPlace(this.bottomRight, movement);
        if (isMouseMovement) {
            this.selectionHelper.addInPlace(this.mouseDownLastPos, movement);
        }
    }

    moveIfPressLongEnough(movement: Vec2, arrowIndex: number): void {
        this.arrowKeyDown[arrowIndex] = true;
        this.subscriptions[arrowIndex] = interval(TIME_BEFORE_START_MOV).subscribe((val) => {
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
        this.mouseLastPos = { x: mousePos.x, y: mousePos.y };
        this.mouseDownLastPos = isMouseDownLastPos ? { x: mousePos.x, y: mousePos.y } : { x: this.mouseDownLastPos.x, y: this.mouseDownLastPos.y };
    }

    computeDiagonalEquation(): void {
        this.diagonalSlope = (this.topLeft.y - this.bottomRight.y) / (this.bottomRight.x - this.topLeft.x);
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
        return this.selectionHelper.isClickOutsideSelection(positions, this.isReversedX, this.isReversedY);
    }

    isAnArrowKeyPressed(): boolean {
        for (const b of this.arrowKeyDown)
            if (b) {
                return true;
            }
        return false;
    }

    resetProperties(): void {
        this.selectionHelper.resetManipulatorProperties(this);
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
