import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { Tool } from '@app/tools/classes/tool';
import { SelectionService } from './selection.service';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { SelectionHandlerService } from './selection-handler.service';

export enum ResizingMode {
  off = 0,
  towardsRight = 1,
  towardsLeft = 2,
  towardsTop = 3,
  towardsBottom = 4,
  towardsTopRight = 5,
  towardsBottomRight = 6,
  towardsTopLeft = 7,
  towardsBottomLeft = 8,
}

export enum Arrow {
  down = 0,
  up = 1,
  left = 2,
  right = 3,
}
@Injectable({
  providedIn: 'root'
})
export abstract class SelectionManipulatorService extends Tool {
  public readonly MOVEMENT_PX: number = 3;
  public readonly TIME_BEFORE_START_MOV: number = 500;
  public readonly TIME_BETWEEN_MOV: number = 100;
  public readonly OUTSIDE_DETECTION_OFFSET_PX: number = 15;

  public readonly MOVEMENT_DOWN = { x: 0, y: this.MOVEMENT_PX };
  public readonly MOVEMENT_UP = { x: 0, y: -this.MOVEMENT_PX };
  public readonly MOVEMENT_LEFT = { x: -this.MOVEMENT_PX, y: 0 };
  public readonly MOVEMENT_RIGHT = { x: this.MOVEMENT_PX, y: 0 };

  public topLeft: Vec2;
  public bottomRight: Vec2;

  private diagonalSlope: number;
  private diagonalYIntercept: number;

  private mouseLastPos: Vec2 = { x: 0, y: 0 };
  private mouseDownLastPos: Vec2 = { x: 0, y: 0 };

  public resizingMode: ResizingMode = ResizingMode.off;

  protected isShiftDown: boolean;
  private isReversedX: boolean;
  private isReversedY: boolean;

  private arrowKeyDown: boolean[] = [false, false, false, false];
  private subscriptions: Array<Subscription>;

  private isContinousMovementByKeyboardOn: boolean[] = [false, false, false, false];

  constructor(protected drawingService: DrawingService, protected selectionService: SelectionService, protected selectionHandler: SelectionHandlerService) {
    super(drawingService);
    this.key = 'selection-manipulator';
    this.subscriptions = new Array<Subscription>(3);
  }

  abstract drawSelectionOutline(): void;

  onMouseDown(event: MouseEvent): void {
    this.mouseDown = event.button === MouseButton.Left;
    let mousePos = this.getPositionFromMouse(event);

    console.log("down");

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

    if (this.resizingMode != ResizingMode.off) {
      this.resizeSelection(mousePosition, this.resizingMode);
      return;
    }

    this.moveSelection(this.convertToMovement(mousePosition), true);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Shift') {
      this.isShiftDown = true;
    }

    if (this.isShiftDown && this.isSelectionBeingResizedDiagonally()) {
      this.resizeSelection(this.mouseLastPos, this.resizingMode);
    }

    if (event.key == 'ArrowUp' && !this.arrowKeyDown[Arrow.up]) {
      this.moveIfPressLongEnough(this.MOVEMENT_UP, Arrow.up);
    }

    if (event.key == 'ArrowDown' && !this.arrowKeyDown[Arrow.down]) {
      this.moveIfPressLongEnough(this.MOVEMENT_DOWN, Arrow.down);
    }

    if (event.key == 'ArrowLeft' && !this.arrowKeyDown[Arrow.left]) {
      this.moveIfPressLongEnough(this.MOVEMENT_LEFT, Arrow.left);
    }

    if (event.key == 'ArrowRight' && !this.arrowKeyDown[Arrow.right]) {
      this.moveIfPressLongEnough(this.MOVEMENT_RIGHT, Arrow.right);
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Shift') {
      this.isShiftDown = false;
    }

    if (event.key == 'Shift' && this.isSelectionBeingResizedDiagonally()) {
      this.resizeSelection(this.mouseLastPos, this.resizingMode);
    }

    if (event.key == 'ArrowDown') {
      this.singleMove(Arrow.down, this.MOVEMENT_DOWN);
    }

    if (event.key == 'ArrowUp') {
      this.singleMove(Arrow.up, this.MOVEMENT_UP);
    }

    if (event.key == 'ArrowLeft') {
      this.singleMove(Arrow.left, this.MOVEMENT_LEFT);
    }

    if (event.key == 'ArrowRight') {
      this.singleMove(Arrow.right, this.MOVEMENT_RIGHT);
    }
  }

  initialize(topLeft: Vec2, bottomRight: Vec2) {
    this.resetProperties();
    this.topLeft = topLeft;
    this.bottomRight = bottomRight;
    this.computeDiagonalEquation();
  }

  moveSelection(movement: Vec2, isMouseMovement: boolean) {
    this.drawingService.clearCanvas(this.drawingService.previewCtx);
    this.addMovementToPositions(movement, isMouseMovement);
    this.drawSelection();
  }

  drawSelection() {
    this.selectionHandler.drawSelection(this.drawingService.previewCtx, this.topLeft);
    this.drawSelectionOutline();
  }

  resizeSelection(newPos: Vec2, direction: ResizingMode): void {
    if (this.isShiftDown && this.isSelectionBeingResizedDiagonally()) {
      newPos = this.getMousePosOnDiagonal(newPos);
    }

    this.drawingService.clearCanvas(this.drawingService.previewCtx);

    if (direction === ResizingMode.towardsBottom || direction == ResizingMode.towardsBottomRight || direction == ResizingMode.towardsBottomLeft) {
      this.bottomRight.y = newPos.y;
      this.isReversedY = newPos.y < this.topLeft.y;
      this.selectionHandler.resizeSelection(this.topLeft, newPos, false);
    }
    if (direction === ResizingMode.towardsTop || direction == ResizingMode.towardsTopRight || direction == ResizingMode.towardsTopLeft) {
      this.topLeft.y = newPos.y;
      this.isReversedY = newPos.y > this.bottomRight.y;
      this.selectionHandler.resizeSelection(newPos, this.bottomRight, false);
    }
    if (direction === ResizingMode.towardsRight || direction == ResizingMode.towardsTopRight || direction == ResizingMode.towardsBottomRight) {
      this.bottomRight.x = newPos.x;
      this.isReversedX = newPos.x < this.topLeft.x;
      this.selectionHandler.resizeSelection(this.topLeft, newPos, true);
    }
    if (direction === ResizingMode.towardsLeft || direction == ResizingMode.towardsTopLeft || direction === ResizingMode.towardsBottomLeft) {
      this.topLeft.x = newPos.x;
      this.isReversedX = newPos.x > this.bottomRight.x;
      this.selectionHandler.resizeSelection(newPos, this.bottomRight, true);
    }

    this.selectionHandler.drawSelection(this.drawingService.previewCtx, this.topLeft);
    this.drawSelectionOutline();
  }

  stopManipulation(needDrawSelection: boolean) {
    this.selectionService.setIsSelectionBeingManipulated(false);

    this.drawingService.clearCanvas(this.drawingService.previewCtx);
    if (needDrawSelection) {
      this.selectionHandler.drawSelection(this.drawingService.baseCtx, this.topLeft);
    }
    this.subscriptions.forEach((sub) => { sub.unsubscribe(); })
    this.resetProperties();
  }

  convertToMovement(mousePos: Vec2): Vec2 {
    const mouseMovement: Vec2 = { x: mousePos.x - this.mouseDownLastPos.x, y: mousePos.y - this.mouseDownLastPos.y }
    return mouseMovement;
  }

  startMovingSelectionContinous(movement: Vec2, arrowIndex: number) {
    this.subscriptions[arrowIndex].unsubscribe();
    const source = interval(this.TIME_BETWEEN_MOV).pipe(takeWhile(() => this.arrowKeyDown[arrowIndex]));
    this.subscriptions[arrowIndex] = source.subscribe(() => this.moveSelection(movement, false));
    this.isContinousMovementByKeyboardOn[arrowIndex] = true;
  }

  addMovementToPositions(mouseMovement: Vec2, isMouseMovement: boolean) {
    if (isMouseMovement) {
      this.add(this.mouseDownLastPos, mouseMovement);
    }
    this.add(this.topLeft, mouseMovement);
    this.add(this.bottomRight, mouseMovement);
  }

  add(vect: Vec2, amount: Vec2) {
    vect.x += amount.x;
    vect.y += amount.y;
  }

  moveIfPressLongEnough(movement: Vec2, arrowIndex: number) {
    this.arrowKeyDown[arrowIndex] = true;
    const source = interval(this.TIME_BEFORE_START_MOV);
    this.subscriptions[arrowIndex] = source.subscribe(val => { this.startMovingSelectionContinous(movement, arrowIndex); })
  }

  stopContinuousMovement(arrowIndex: number) {
    this.subscriptions[arrowIndex].unsubscribe();
    if (this.isContinousMovementByKeyboardOn[arrowIndex]) {
      this.isContinousMovementByKeyboardOn[arrowIndex] = false;
      return;
    }
  }

  singleMove(arrowIndex: number, singleMovement: Vec2) {
    this.arrowKeyDown[arrowIndex] = false;
    this.stopContinuousMovement(arrowIndex);
    this.moveSelection(singleMovement, false);
  }

  registerMousePos(mousePos: Vec2, isMouseDownLastPos: boolean) {
    this.mouseLastPos.x = mousePos.x;
    this.mouseLastPos.y = mousePos.y;
    console.log(this.mouseLastPos.x, this.mouseLastPos.y);
    if (isMouseDownLastPos) {
      this.mouseDownLastPos.x = mousePos.x;
      this.mouseDownLastPos.y = mousePos.y;
    }
  }

  computeDiagonalEquation() {
    let deltaY = this.topLeft.y - this.bottomRight.y;
    let deltaX = this.bottomRight.x - this.topLeft.x;
    this.diagonalSlope = deltaY / deltaX;
    if (this.resizingMode === ResizingMode.towardsBottomRight || this.resizingMode === ResizingMode.towardsTopLeft) {
      this.diagonalSlope *= -1;
      this.diagonalYIntercept = this.topLeft.y - this.topLeft.x * this.diagonalSlope;
      return;
    }
    this.diagonalYIntercept = this.bottomRight.y - this.topLeft.x * this.diagonalSlope;
  }

  getMousePosOnDiagonal(mousePos: Vec2): Vec2 {
    return { x: mousePos.x, y: mousePos.x * this.diagonalSlope + this.diagonalYIntercept };
  }

  isSelectionBeingResizedDiagonally() {
    return this.resizingMode === ResizingMode.towardsBottomLeft
      || this.resizingMode === ResizingMode.towardsBottomRight
      || this.resizingMode === ResizingMode.towardsTopLeft
      || this.resizingMode === ResizingMode.towardsTopRight;
  }

  isClickOutsideSelection(event: MouseEvent): boolean {
    const mousePosition = this.getPositionFromMouse(event);
    let positions: Vec2[] = [];

    positions.push(mousePosition, this.topLeft, this.bottomRight);
    return this.selectionService.isClickOutsideSelection(positions, this.isReversedX, this.isReversedY);
  }

  isAnArrowKeyPressed(): boolean {
    let isAnyArrowKeyDown: boolean = false;

    this.arrowKeyDown.forEach(element => {
      if (element) {
        isAnyArrowKeyDown = true;
      }
    });

    return isAnyArrowKeyDown;
  }

  resetProperties() {
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
}
