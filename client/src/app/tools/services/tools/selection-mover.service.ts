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
  public resizingMode: ResizingMode = ResizingMode.off;
  private mouseLastPos: Vec2 = { x: 0, y: 0 };
  private mouseDownLastPos: Vec2 = { x: 0, y: 0 };
  private isShiftDown: boolean;
  private isReversedX: boolean;
  private isReversedY: boolean;

  private slope: number;
  private yIntercept: number;

  constructor(drawingService: DrawingService, public selectionService: SelectionService, private selectionHandler: EllipseSelectionHandlerService) {
    super(drawingService);
    this.key = 'selection-manipulator';
  }

  setSelection(topLeft: Vec2, bottomRight: Vec2) {
    this.topLeft = topLeft;
    this.bottomRight = bottomRight;
    this.computeDiagonalLine();
  }

  onMouseDown(event: MouseEvent): void {
    this.mouseDown = event.button === MouseButton.Left;
    const mousePosition = this.getPositionFromMouse(event);

    if (this.mouseDown) {
      if (this.isClickOutsideSelection(event)) {
        this.selectionService.isSelectionBeingManipulated.next(false);
        this.mouseDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.selectionHandler.drawSelection(this.topLeft, this.drawingService.baseCtx);
      }
      else {
        this.computeDiagonalLine();
      }
      this.mouseDownLastPos.x = mousePosition.x;
      this.mouseDownLastPos.y = mousePosition.y;
      this.mouseLastPos.x = mousePosition.x;
      this.mouseLastPos.y = mousePosition.y;
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
    if(this.isReversedX && this.isReversedY){
      console.log("reversed X,Y");
      this.drawingService.clearCanvas(this.drawingService.previewCtx);
      this.selectionHandler.drawSelection(this.topLeft, this.drawingService.previewCtx);
      let tempX = this.topLeft.x;
      this.topLeft.x = this.bottomRight.x;
      this.bottomRight.x = tempX;
      let tempY = this.topLeft.y;
      this.topLeft.y = this.bottomRight.y;
      this.bottomRight.y = tempY;

      this.isReversedX = false;
      this.isReversedY = false;

      let center: Vec2 = { x: 0, y: 0 }, radii: Vec2 = { x: 0, y: 0 };
      this.selectionService.getEllipseParam(this.topLeft, this.bottomRight, center, radii);
      this.selectionHandler.selectArea2(this.topLeft, center, radii, this.drawingService.previewCanvas);
      this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.topLeft, this.bottomRight, false);
      this.selectionService.drawSelectionEllipse(center, radii);
      return;
    }

    if (this.isReversedX) {
      console.log("reversedX");
      this.drawingService.clearCanvas(this.drawingService.previewCtx);
      this.selectionHandler.drawSelection(this.topLeft, this.drawingService.previewCtx);
      let tempX = this.topLeft.x;
      this.topLeft.x = this.bottomRight.x;
      this.bottomRight.x = tempX;
      this.isReversedX = false;

      let center: Vec2 = { x: 0, y: 0 }, radii: Vec2 = { x: 0, y: 0 };
      this.selectionService.getEllipseParam(this.topLeft, this.bottomRight, center, radii);
      this.selectionHandler.selectArea2(this.topLeft, center, radii, this.drawingService.previewCanvas);
      this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.topLeft, this.bottomRight, false);
      this.selectionService.drawSelectionEllipse(center, radii);
      //this.selec
      //this.selectionHandler.adjust();
    }
    if(this.isReversedY){
      console.log("reversedY");
      this.drawingService.clearCanvas(this.drawingService.previewCtx);
      this.selectionHandler.drawSelection(this.topLeft, this.drawingService.previewCtx);
      let tempY = this.topLeft.y;
      this.topLeft.y = this.bottomRight.y;
      this.bottomRight.y = tempY;
      this.isReversedY = false;

      let center: Vec2 = { x: 0, y: 0 }, radii: Vec2 = { x: 0, y: 0 };
      this.selectionService.getEllipseParam(this.topLeft, this.bottomRight, center, radii);
      this.selectionHandler.selectArea2(this.topLeft, center, radii, this.drawingService.previewCanvas);
      this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.topLeft, this.bottomRight, false);
      this.selectionService.drawSelectionEllipse(center, radii);
    }
  }

  onMouseMove(event: MouseEvent): void {
    let mousePosition = this.getPositionFromMouse(event);

    if (this.mouseDown) {
      this.mouseLastPos.x = mousePosition.x;
      this.mouseLastPos.y = mousePosition.y;
      if (this.resizingMode != ResizingMode.off) {
        if (this.isShiftDown) {
          mousePosition = this.adjustMousePosition(mousePosition);
        }
        this.resize(mousePosition, this.resizingMode);
      }
      else {

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const mouseMovement: Vec2 = { x: mousePosition.x - this.mouseDownLastPos.x, y: mousePosition.y - this.mouseDownLastPos.y }

        this.updatePositions(mouseMovement);

        let center: Vec2 = { x: 0, y: 0 };
        let radii: Vec2 = { x: 0, y: 0 };

        this.selectionHandler.drawSelection(this.topLeft, this.drawingService.previewCtx);
        this.selectionService.getEllipseParam(this.topLeft, this.bottomRight, center, radii);
        this.selectionService.drawSelectionEllipse(center, radii);
        this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.topLeft, this.bottomRight, false);
      }
    }
  }

  updatePositions(mouseMovement: Vec2) {
    this.mouseDownLastPos.x += mouseMovement.x;
    this.mouseDownLastPos.y += mouseMovement.y;

    this.topLeft.x += mouseMovement.x;
    this.topLeft.y += mouseMovement.y;

    this.bottomRight.x += mouseMovement.x;
    this.bottomRight.y += mouseMovement.y;
  }

  resize(newPos: Vec2, direction: ResizingMode): void {
    this.drawingService.clearCanvas(this.drawingService.previewCtx);

    if (direction === ResizingMode.towardsBottom || direction == ResizingMode.towardsBottomRight || direction == ResizingMode.towardsBottomLeft) {
      this.bottomRight.y = newPos.y;
      if (newPos.y < this.topLeft.y) {
        this.isReversedY = true;
      }
      else {
        this.isReversedY = false;
      }
      this.selectionHandler.resizeSelectionVertically(this.topLeft, newPos);
    }
    if (direction === ResizingMode.towardsTop || direction == ResizingMode.towardsTopRight || direction == ResizingMode.towardsTopLeft) {
      this.topLeft.y = newPos.y;
      if (newPos.y > this.bottomRight.y) {
        this.isReversedY = true;
      }
      else {
        this.isReversedY = false;
      }
      this.selectionHandler.resizeSelectionVertically(newPos, this.bottomRight);
    }
    if (direction === ResizingMode.towardsRight || direction == ResizingMode.towardsTopRight || direction == ResizingMode.towardsBottomRight) {
      this.bottomRight.x = newPos.x;
      if (newPos.x < this.topLeft.x) {
        this.isReversedX = true;
      }
      else {
        this.isReversedX = false;
      }
      this.selectionHandler.resizeSelectionHorizontally(this.topLeft, newPos);
    }
    if (direction === ResizingMode.towardsLeft || direction == ResizingMode.towardsTopLeft || direction === ResizingMode.towardsBottomLeft) {
      this.topLeft.x = newPos.x;
      if (newPos.x > this.bottomRight.x) {
        this.isReversedX = true;
      }
      else {
        this.isReversedX = false;
      }
      this.selectionHandler.resizeSelectionHorizontally(newPos, this.bottomRight);
    }

    /*switch (direction) {
      case ResizingMode.towardsBottom:
        this.bottomRight.y = newPos.y;
        this.selectionHandler.resizeSelectionVertically(this.topLeft, newPos);
        break;
      case ResizingMode.towardsTop:

        this.topLeft.y = newPos.y;
        this.selectionHandler.resizeSelectionVertically(newPos, this.bottomRight);
        break;
      case ResizingMode.towardsRight:
      case ResizingMode.towardsRightTop:
        this.bottomRight.x = newPos.x;
        this.selectionHandler.resizeSelectionHorizontally(this.topLeft, newPos);
        break;
      case ResizingMode.towardsLeft:
        this.topLeft.x = newPos.x;
        this.selectionHandler.resizeSelectionHorizontally(newPos, this.bottomRight);
        break;*/

    this.drawingService.clearCanvas(this.drawingService.previewCtx);
    this.selectionHandler.drawSelection(this.topLeft, this.drawingService.previewCtx);

    let center: Vec2 = { x: 0, y: 0 };
    let radii: Vec2 = { x: 0, y: 0 };
    this.selectionService.getEllipseParam(this.topLeft, this.bottomRight, center, radii);
    this.selectionService.drawSelectionEllipse(center, radii);
    this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.topLeft, this.bottomRight, false);
  }

  computeDiagonalLine() {
    this.slope = (this.topLeft.y - this.bottomRight.y) / (this.bottomRight.x - this.topLeft.x);
    if (this.resizingMode === ResizingMode.towardsBottomRight || this.resizingMode === ResizingMode.towardsTopLeft) {
      this.slope *= -1;
      this.yIntercept = this.topLeft.y - this.topLeft.x * this.slope;
      return;
    }
    this.yIntercept = this.bottomRight.y - this.topLeft.x * this.slope;
  }

  adjustMousePosition(mousePos: Vec2): Vec2 {
    return { x: mousePos.x, y: mousePos.x * this.slope + this.yIntercept };
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Shift') {
      this.isShiftDown = true;
      if (this.resizingMode != ResizingMode.off) {
        let adjustedMousePos: Vec2 = this.adjustMousePosition(this.mouseLastPos);
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

}
