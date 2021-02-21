import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { Tool } from '@app/tools/classes/tool';
import { EllipseSelectionHandlerService } from './ellipse-selection-handler-service';
import { SelectionService } from './selection.service';


export enum ResizingMode{
  off = 0,
  towardsRight = 1,
  towardsLeft = 2,
  towardsTop = 3,
  towardsBottom = 4,
}

@Injectable({
  providedIn: 'root'
})

export class SelectionMoverService extends Tool {

  public topLeft: Vec2;
  public bottomRight: Vec2;
  public resizingMode: ResizingMode = ResizingMode.off;
  private mouseLastPos: Vec2 = { x: 0, y: 0 };

  constructor(drawingService: DrawingService, private selectionService: SelectionService, private selectionHandler: EllipseSelectionHandlerService) {
    super(drawingService);
    this.key = 'selection-mover';
  }

  setSelection(topLeft: Vec2, bottomRight: Vec2) {
    this.topLeft = topLeft;
    this.bottomRight = bottomRight;
  }

  onMouseDown(event: MouseEvent): void {
    this.mouseDown = event.button === MouseButton.Left;
    const mousePosition = this.getPositionFromMouse(event);

    if (this.mouseDown) {
      /*if (this.resizingMode) {
        let newTopRight: Vec2 = {x: mousePosition.x, y: this.topLeft.y};
        this.selectionHandler.resizeSelectionHorizontally(this.topLeft, newTopRight, true );
        this.resizingMode = false;
      }
      else{*/

      if (this.isClickOutsideSelection(event)) {
        console.log("outside");
        this.selectionService.isSelectionBeingMoved = false;
        this.mouseDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.selectionHandler.drawSelection(this.topLeft, this.drawingService.baseCtx);
      }
      this.mouseLastPos.x = mousePosition.x;
      this.mouseLastPos.y = mousePosition.y;
    }
  }


  //change logic bc we know topLeft is left and bottomRight is right
  isClickInsideSelection(event: MouseEvent): boolean {
    //console.log(this.topLeft.x +" "+ this.topLeft.y +" "+ this.bottomRight.x +" "+ this.bottomRight.y);
    const mousePosition = this.getPositionFromMouse(event);
    const xInSelection: boolean = mousePosition.x > Math.min(this.topLeft.x + 40, this.bottomRight.x + 40)
      && mousePosition.x < Math.max(this.topLeft.x - 40, this.bottomRight.x - 40);
    const yInSelection: boolean = mousePosition.y > Math.min(this.topLeft.y + 40, this.bottomRight.y + 40)
      && mousePosition.y < Math.max(this.topLeft.y - 40, this.bottomRight.y - 40);
    return (xInSelection && yInSelection);
  }

  isClickOutsideSelection(event: MouseEvent): boolean {
    //console.log(this.topLeft.x +" "+ this.topLeft.y +" "+ this.bottomRight.x +" "+ this.bottomRight.y);
    const mousePosition = this.getPositionFromMouse(event);
    const xOutsideSelection: boolean = mousePosition.x < Math.min(this.topLeft.x - 40, this.bottomRight.x - 40)
      || mousePosition.x > Math.max(this.topLeft.x + 40, this.bottomRight.x + 40);
    console.log(mousePosition.x + " " + this.bottomRight.x);
    const yOutsideSelection: boolean = mousePosition.y < Math.min(this.topLeft.y - 40, this.bottomRight.y - 40)
      || mousePosition.y > Math.max(this.topLeft.y + 40, this.bottomRight.y + 40);
    return (xOutsideSelection || yOutsideSelection);
  }

  onMouseUp(event: MouseEvent): void {
    this.mouseDown = false;
  }

  onMouseMove(event: MouseEvent): void {
    const mousePosition = this.getPositionFromMouse(event);

    if (this.mouseDown) {
      if (this.resizingMode != ResizingMode.off) {
        this.resize(mousePosition, this.resizingMode);
      }
      else if (this.isClickInsideSelection(event)) {

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const mouseMovement: Vec2 = { x: mousePosition.x - this.mouseLastPos.x, y: mousePosition.y - this.mouseLastPos.y }

        this.mouseLastPos.x += mouseMovement.x;
        this.mouseLastPos.y += mouseMovement.y;

        this.topLeft.x += mouseMovement.x;
        this.topLeft.y += mouseMovement.y;

        this.bottomRight.x += mouseMovement.x;
        this.bottomRight.y += mouseMovement.y;

        let center: Vec2 = { x: 0, y: 0 };
        let radii: Vec2 = { x: 0, y: 0 };

        this.selectionHandler.drawSelection(this.topLeft, this.drawingService.previewCtx);
        this.selectionService.getEllipseParam(this.topLeft, this.bottomRight, center, radii);
        this.selectionService.drawSelectionEllipse(center, radii);
        this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.topLeft, this.bottomRight);
      }
    }
  }

  resize(newPos: Vec2, direction: ResizingMode): void {

    this.drawingService.clearCanvas(this.drawingService.previewCtx);
    switch(direction){
      case ResizingMode.towardsBottom:
        this.bottomRight.y = newPos.y;
        this.selectionHandler.resizeSelectionHorizontally(this.topLeft, newPos, true);
        this.selectionHandler.drawSelection(this.topLeft, this.drawingService.previewCtx);
        break;
      case ResizingMode.towardsTop:
        this.topLeft.y = newPos.y;
        this.selectionHandler.resizeSelectionHorizontally(this.topLeft, newPos, true);
        this.selectionHandler.drawSelection(this.topLeft, this.drawingService.previewCtx);
        break;
      case ResizingMode.towardsRight:
        this.bottomRight.x = newPos.x;
        this.selectionHandler.resizeSelectionHorizontally(this.topLeft, newPos, true);
        this.selectionHandler.drawSelection(this.topLeft, this.drawingService.previewCtx);
        break;
      case ResizingMode.towardsLeft:
        this.topLeft.x = newPos.x;
        this.selectionHandler.resizeSelectionHorizontally(this.topLeft, newPos, true);
        this.selectionHandler.drawSelection(this.topLeft, this.drawingService.previewCtx);
        break;
    }

    let center: Vec2 = { x: 0, y: 0 };
    let radii: Vec2 = { x: 0, y: 0 };
    
    this.selectionService.getEllipseParam(this.topLeft, this.bottomRight, center, radii);
    this.selectionService.drawSelectionEllipse(center, radii);
    this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.topLeft, this.bottomRight);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key == 'z') {
      //this.resizingMode = true;
    }

  }

  onKeyUp(event: KeyboardEvent): void {
  }

}
