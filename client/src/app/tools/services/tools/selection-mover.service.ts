import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { Tool } from '@app/tools/classes/tool';
import { EllipseSelectionHandlerService } from './ellipse-selection-handler-service';
import { SelectionService } from './selection.service';

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

@Injectable({
  providedIn: 'root'
})
export class SelectionMoverService extends Tool {
  public readonly OUTSIDE_DETECTION_OFFSET: number = 15;

  public topLeft: Vec2;
  public bottomRight: Vec2;

  private diagonalSlope: number;
  private diagonalYIntercept: number;

  private mouseLastPos: Vec2 = { x: 0, y: 0 };
  private mouseDownLastPos: Vec2 = { x: 0, y: 0 };

  public resizingMode: ResizingMode = ResizingMode.off;

  private isShiftDown: boolean;
  private isReversedX: boolean;
  private isReversedY: boolean;

  constructor(drawingService: DrawingService, public selectionService: SelectionService, private selectionHandler: EllipseSelectionHandlerService) {
    super(drawingService);
    this.key = 'selection-manipulator';
  }

  setSelection(topLeft: Vec2, bottomRight: Vec2) {
    this.topLeft = topLeft;
    this.bottomRight = bottomRight;
    this.computeDiagonalEquation();
  }

  onMouseDown(event: MouseEvent): void {
    this.mouseDown = event.button === MouseButton.Left;
    let mousePos = this.getPositionFromMouse(event);

    if (this.mouseDown) {
      if (this.isClickOutsideSelection(event)) {
        this.selectionService.setIsSelectionBeingManipulated(false);
        this.mouseDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.selectionHandler.drawSelection(this.drawingService.baseCtx, this.topLeft);
      }
      else {
        this.computeDiagonalEquation();
      }
      this.registerMousePos(mousePos, true);
    }
  }

  isClickInsideSelection(event: MouseEvent): boolean {
    const mousePosition = this.getPositionFromMouse(event);
    const xInSelection: boolean = (mousePosition.x > this.topLeft.x) && (mousePosition.x < this.bottomRight.x);
    const yInSelection: boolean = (mousePosition.y > this.topLeft.y) && (mousePosition.y < this.bottomRight.y);
    return (xInSelection && yInSelection);
  }

  isClickOutsideSelection(event: MouseEvent): boolean {
    const mousePosition = this.getPositionFromMouse(event);
    const xOutsideSelection: boolean = (mousePosition.x < this.topLeft.x - this.OUTSIDE_DETECTION_OFFSET)
      || (mousePosition.x > this.bottomRight.x + this.OUTSIDE_DETECTION_OFFSET);
    const yOutsideSelection: boolean = (mousePosition.y < this.topLeft.y - this.OUTSIDE_DETECTION_OFFSET)
      || (mousePosition.y > this.bottomRight.y + this.OUTSIDE_DETECTION_OFFSET);
    return (xOutsideSelection || yOutsideSelection);
  }

  onMouseUp(event: MouseEvent): void {
    this.mouseDown = false;
    this.resizingMode = ResizingMode.off;

    if (this.isReversedX || this.isReversedY) {
      this.reselect(this.isReversedX, this.isReversedY);
    }
  }

  onMouseMove(event: MouseEvent): void {
    const mousePosition = this.getPositionFromMouse(event);
    if (this.mouseDown) {
      this.registerMousePos(mousePosition, false);
      if (this.resizingMode != ResizingMode.off) {
        this.resize(mousePosition, this.resizingMode);
        return;
      }
      this.moveSelection(mousePosition);
    }
  }

  moveSelection(mousePos: Vec2): void {
    this.drawingService.clearCanvas(this.drawingService.previewCtx);
    const mouseMovement: Vec2 = { x: mousePos.x - this.mouseDownLastPos.x, y: mousePos.y - this.mouseDownLastPos.y }

    this.addMovementToPositions(mouseMovement);
    this.selectionHandler.drawSelection(this.drawingService.previewCtx, this.topLeft);
    this.drawSelectionOutline();
  }

  addMovementToPositions(mouseMovement: Vec2) {

    let futureTopLeft = {x: this.topLeft.x + mouseMovement.x, y: this.topLeft.y + mouseMovement.y};
    let futureBottomRight = {x: this.bottomRight.x + mouseMovement.x, y: this.bottomRight.y + mouseMovement.y};

    this.adjustIfWillBeOutside(this.topLeft, this.bottomRight, mouseMovement);

    this.mouseDownLastPos.x += mouseMovement.x;
    this.mouseDownLastPos.y += mouseMovement.y;
    this.adjustIfOutsideCanvas(this.mouseDownLastPos);
    this.topLeft.x += mouseMovement.x;
    this.topLeft.y += mouseMovement.y;
    this.adjustIfOutsideCanvas(this.topLeft);
    this.bottomRight.x += mouseMovement.x;
    this.bottomRight.y += mouseMovement.y;
    this.adjustIfOutsideCanvas(this.bottomRight);
  }

  registerMousePos(mousePos: Vec2, isMouseDownLastPos: boolean) {
    this.mouseLastPos.x = mousePos.x;
    this.mouseLastPos.y = mousePos.y;
    if (isMouseDownLastPos) {
      this.mouseDownLastPos.x = mousePos.x;
      this.mouseDownLastPos.y = mousePos.y;
    }
  }

  resize(newPos: Vec2, direction: ResizingMode): void {
    this.adjustIfOutsideCanvas(newPos)
    if (this.isShiftDown && this.isSelectionBeingResizedDiagonally()) {
      newPos = this.mousePositionOnDiagonal(newPos);
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

    this.drawingService.clearCanvas(this.drawingService.previewCtx);
    this.selectionHandler.drawSelection(this.drawingService.previewCtx, this.topLeft);
    this.drawSelectionOutline();

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

  mousePositionOnDiagonal(mousePos: Vec2): Vec2 {
    return { x: mousePos.x, y: mousePos.x * this.diagonalSlope + this.diagonalYIntercept };
  }

  drawSelectionOutline(): void {
    let center: Vec2 = { x: 0, y: 0 };
    let radii: Vec2 = { x: 0, y: 0 };
    this.selectionService.getEllipseParam(this.topLeft, this.bottomRight, center, radii);
    this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.topLeft, this.bottomRight, false);
    this.selectionService.drawSelectionEllipse(center, radii);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Shift') {
      this.isShiftDown = true;
      if (this.isSelectionBeingResizedDiagonally()) {
        let adjustedMousePos: Vec2 = this.mousePositionOnDiagonal(this.mouseLastPos);
        this.resize(adjustedMousePos, this.resizingMode);
      }
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Shift') {
      this.isShiftDown = false;
      if (this.isSelectionBeingResizedDiagonally()) {
        this.resize(this.mouseLastPos, this.resizingMode);
      }
    }
  }

  isSelectionBeingResizedDiagonally() {
    return this.resizingMode === ResizingMode.towardsBottomLeft
      || this.resizingMode === ResizingMode.towardsBottomRight
      || this.resizingMode === ResizingMode.towardsTopLeft
      || this.resizingMode === ResizingMode.towardsTopRight;
  }

  reselect(swapX: boolean, swapY: boolean) {
    this.drawingService.clearCanvas(this.drawingService.previewCtx);
    this.selectionHandler.drawSelection(this.drawingService.previewCtx, this.topLeft);
    this.swapTopLeftAndBottomRight(swapX, swapY);
    this.reselectSelection();
  }

  reselectSelection(): void {
    let center: Vec2 = { x: 0, y: 0 }, radii: Vec2 = { x: 0, y: 0 };
    this.selectionService.getEllipseParam(this.topLeft, this.bottomRight, center, radii);
    this.selectionHandler.reselectArea(this.topLeft, center, radii);
    this.drawSelectionOutline();
  }

  swapTopLeftAndBottomRight(swapX: boolean, swapY: boolean): void {
    if (swapX) {
      let tempX = this.topLeft.x;
      this.topLeft.x = this.bottomRight.x;
      this.bottomRight.x = tempX;
      this.isReversedX = false;
    }
    if (swapY) {
      let tempY = this.topLeft.y;
      this.topLeft.y = this.bottomRight.y;
      this.bottomRight.y = tempY;
      this.isReversedY = false;
    }
  }

  isSelectionOutsideCanvas(): boolean {
    let canvasSize: Vec2 = this.drawingService.canvasSize;
    const xOutsideSelection: boolean = (this.topLeft.x < 0)
      || (this.bottomRight.x > canvasSize.x);
    const yOutsideSelection: boolean = (this.topLeft.y < 0)
      || (this.bottomRight.y > canvasSize.y);
    return (xOutsideSelection || yOutsideSelection);
  }

  adjustIfOutsideCanvas(pos: Vec2): void {
    let canvasSize: Vec2 = this.drawingService.canvasSize;
    if (pos.x < 0) {
      pos.x = 0;
    }

    if (pos.x > canvasSize.x) {
      pos.x = canvasSize.x;
    }
    if (pos.y > canvasSize.y) {
      pos.y = canvasSize.y;
    }
    if (pos.y < 0) {
      pos.y = 0;
    }
  }

  adjustIfWillBeOutside(topLeft: Vec2, bottomRight: Vec2, movement: Vec2): void {
    let futureTopLeft = {x: topLeft.x + movement.x, y: topLeft.y + movement.y};
    let futureBottomRight = {x: bottomRight.x + movement.x, y: bottomRight.y + movement.y};
    
    let canvasSize: Vec2 = this.drawingService.canvasSize;
    if (futureTopLeft.x <= 0) {
      movement.x = 0 - topLeft.x;
    }
    if (futureBottomRight.x >= canvasSize.x) {
      movement.x = canvasSize.x - bottomRight.x;
    }
    if (futureTopLeft.y <= 0) {
      movement.y =  0 - topLeft.y;
    }
    if (futureBottomRight.y >= canvasSize.y) {
      movement.y = canvasSize.y - bottomRight.y;
    }
  }

  isOutsideCanvasX(pos: Vec2): boolean {
    let canvasSize: Vec2 = this.drawingService.canvasSize;
    return pos.x < 0 || pos.x > canvasSize.x;
  }

  isOutsideCanvasY(pos: Vec2): boolean {
    let canvasSize: Vec2 = this.drawingService.canvasSize;
    return pos.y > canvasSize.y || pos.y < 0;
  }
}
