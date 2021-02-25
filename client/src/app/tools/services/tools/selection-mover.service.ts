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
        this.selectionHandler.drawSelection(this.topLeft, this.drawingService.baseCtx);
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
      this.reselectCurentSelection(this.isReversedX, this.isReversedY);
    }
  }

  onMouseMove(event: MouseEvent): void {
    let mousePosition = this.getPositionFromMouse(event);

    if (this.mouseDown) {
      this.registerMousePos(mousePosition, false);

      if (this.resizingMode != ResizingMode.off) {
        this.resize(mousePosition, this.resizingMode);
      }
      else {
        this.moveSelection(mousePosition);
      }
    }
  }

  moveSelection(mousePos: Vec2): void {
    this.drawingService.clearCanvas(this.drawingService.previewCtx);
    const mouseMovement: Vec2 = { x: mousePos.x - this.mouseDownLastPos.x, y: mousePos.y - this.mouseDownLastPos.y }

    this.addMovementToPositions(mouseMovement);
    this.selectionHandler.drawSelection(this.topLeft, this.drawingService.previewCtx);
    this.drawSelectionOutline();
  }

  addMovementToPositions(mouseMovement: Vec2) {
    this.mouseDownLastPos.x += mouseMovement.x;
    this.mouseDownLastPos.y += mouseMovement.y;
    this.topLeft.x += mouseMovement.x;
    this.topLeft.y += mouseMovement.y;
    this.bottomRight.x += mouseMovement.x;
    this.bottomRight.y += mouseMovement.y;
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
    if (this.isShiftDown) {
      newPos = this.mousePositionOnDiagonal(newPos);
    }
    this.drawingService.clearCanvas(this.drawingService.previewCtx);

    if (direction === ResizingMode.towardsBottom || direction == ResizingMode.towardsBottomRight || direction == ResizingMode.towardsBottomLeft) {
      this.bottomRight.y = newPos.y;
      this.isReversedY = newPos.y < this.topLeft.y;
      this.selectionHandler.resizeSelectionVertically(this.topLeft, newPos);
    }
    if (direction === ResizingMode.towardsTop || direction == ResizingMode.towardsTopRight || direction == ResizingMode.towardsTopLeft) {
      this.topLeft.y = newPos.y;
      this.isReversedY = newPos.y > this.bottomRight.y;
      this.selectionHandler.resizeSelectionVertically(newPos, this.bottomRight);
    }
    if (direction === ResizingMode.towardsRight || direction == ResizingMode.towardsTopRight || direction == ResizingMode.towardsBottomRight) {
      this.bottomRight.x = newPos.x;
      this.isReversedX = newPos.x < this.topLeft.x;
      this.selectionHandler.resizeSelectionHorizontally(this.topLeft, newPos);
    }
    if (direction === ResizingMode.towardsLeft || direction == ResizingMode.towardsTopLeft || direction === ResizingMode.towardsBottomLeft) {
      this.topLeft.x = newPos.x;
      this.isReversedX = newPos.x > this.bottomRight.x;
      this.selectionHandler.resizeSelectionHorizontally(newPos, this.bottomRight);
    }

    this.drawingService.clearCanvas(this.drawingService.previewCtx);
    this.selectionHandler.drawSelection(this.topLeft, this.drawingService.previewCtx);
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

  reselect(): void {
    let center: Vec2 = { x: 0, y: 0 }, radii: Vec2 = { x: 0, y: 0 };
    this.selectionService.getEllipseParam(this.topLeft, this.bottomRight, center, radii);
    this.selectionHandler.selectArea2(this.topLeft, center, radii, this.drawingService.previewCanvas);
    this.drawSelectionOutline();
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
      if (this.resizingMode != ResizingMode.off) {
        let adjustedMousePos: Vec2 = this.mousePositionOnDiagonal(this.mouseLastPos);
        this.resize(adjustedMousePos, this.resizingMode);
      }
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Shift') {
      this.isShiftDown = false;
      if (this.resizingMode != ResizingMode.off) {
        this.resize(this.mouseLastPos, this.resizingMode);
      }
    }
  }

  reselectCurentSelection(swapX: boolean, swapY: boolean) {
    this.drawingService.clearCanvas(this.drawingService.previewCtx);
    this.selectionHandler.drawSelection(this.topLeft, this.drawingService.previewCtx);
    this.swapTopLeftAndBottomRight(swapX, swapY);
    this.reselect();
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
}
