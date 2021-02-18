import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { Tool } from '@app/tools/classes/tool';
import { SelectionService } from './selection.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionMoverService extends Tool {
  private selectionCanvas: HTMLCanvasElement;

  private selectionAnchorPoint: Vec2;

  private selectionPointA: Vec2;
  private selectionPointB: Vec2;

  private mouseLastPos: Vec2 = { x: 0, y: 0 };

  constructor(drawingService: DrawingService, private selectionService : SelectionService) {
    super(drawingService);
    this.key = 'selection-mover';
  }

  setSelection(selectionCanvas: HTMLCanvasElement, selectionStartPoint: Vec2, selectionEndPoint: Vec2 ) {
    this.selectionCanvas = selectionCanvas;
    this.selectionAnchorPoint = {x: selectionStartPoint.x, y: selectionStartPoint.y};
    this.selectionPointA =  {x: selectionStartPoint.x, y: selectionStartPoint.y};
    this.selectionPointB =  {x: selectionEndPoint.x, y: selectionEndPoint.y};
  }

  onMouseDown(event: MouseEvent): void {
    this.mouseDown = event.button === MouseButton.Left;
    const mousePosition = this.getPositionFromMouse(event);
    if (this.mouseDown) {
      if(!this.isClickOnSelection(event)){
        console.log("ooooout");
         this.selectionService.isSelectionBeingMoved = false;
      }
        this.mouseLastPos.x = mousePosition.x;
        this.mouseLastPos.y = mousePosition.y;
    }

  }

  isClickOnSelection(event: MouseEvent): boolean {
    const mousePosition = this.getPositionFromMouse(event);
    const xInSelection: boolean = mousePosition.x > Math.min(this.selectionPointA.x, this.selectionPointB.x)
      && mousePosition.x < Math.max(this.selectionPointA.x, this.selectionPointB.x);
    const yInSelection: boolean = mousePosition.y > Math.min(this.selectionPointA.y, this.selectionPointB.y)
      && mousePosition.y < Math.max(this.selectionPointA.y, this.selectionPointB.y);
    return (xInSelection && yInSelection);
  }

  onMouseUp(event: MouseEvent): void {
    this.mouseDown = false;
  }

  onMouseMove(event: MouseEvent): void {
    const mousePosition = this.getPositionFromMouse(event);

    if(this.mouseDown){
      this.drawingService.clearCanvas(this.drawingService.previewCtx);
      const mouseMovement: Vec2 = { x:   mousePosition.x - this.mouseLastPos.x, y:  mousePosition.y - this.mouseLastPos.y  }
      
      this.mouseLastPos.x += mouseMovement.x;
      this.mouseLastPos.y += mouseMovement.y;

      this.selectionPointA.x += mouseMovement.x;
      this.selectionPointA.y += mouseMovement.y;
      
      this.selectionPointB.x += mouseMovement.x;
      this.selectionPointB.y += mouseMovement.y;


      this.drawingService.previewCtx.drawImage(
        this.selectionCanvas, this.selectionAnchorPoint.x, this.selectionAnchorPoint.y,
        this.selectionCanvas.width, this.selectionCanvas.height,
        this.selectionPointA.x, this.selectionPointA.y,
        this.selectionCanvas.width, this.selectionCanvas.height);
    }
/*
    if (this.mouseDown && this.state == SelectionState.Selecting) {

      this.lastMousePosition = mousePosition;

      this.drawingService.clearCanvas(this.drawingService.previewCtx);
      this.drawEllipse(false, this.startPoint, mousePosition);
      this.drawPerimeter(this.drawingService.previewCtx, this.startPoint, mousePosition);
    }
    else if (this.mouseDown && this.firstTime && this.state == SelectionState.Standby) {
      console.log("dddddddddd")
      this.anchorPoint.x = mousePosition.x;
      this.anchorPoint.y = mousePosition.y;
      this.firstTime = false;
    }

    else if (this.mouseDown && this.state == SelectionState.Standby) {
      this.drawingService.clearCanvas(this.drawingService.previewCtx);
      const movX = mousePosition.x - this.anchorPoint.x;
      const movY = mousePosition.y - this.anchorPoint.y;

      this.selectionPos.x = this.startPoint.x + movX;
      this.selectionPos.y = this.startPoint.y + movY;

      this.drawingService.previewCtx.drawImage(
        this.selectionCanvas, this.startPoint.x, this.startPoint.y,
        this.selectionCanvas.width, this.selectionCanvas.height,
        this.selectionPos.x, this.selectionPos.y,
        this.selectionCanvas.width, this.selectionCanvas.height);
    }*/
  }

  onKeyDown(event: KeyboardEvent): void {
   /* if (event.key === 'Shift') {
      this.isShiftDown = true;

      if (this.mouseDown) {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawEllipse(false, this.startPoint, this.lastMousePosition);
        this.drawPerimeter(this.drawingService.previewCtx, this.startPoint, this.lastMousePosition);
      }
    }*/
  }

  onKeyUp(event: KeyboardEvent): void {
   /* if (event.key === 'Shift') {
      this.isShiftDown = false;

      if (this.mouseDown) {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawEllipse(false, this.startPoint, this.lastMousePosition);
        this.drawPerimeter(this.drawingService.previewCtx, this.startPoint, this.lastMousePosition);
      }
    }*/
  }

  getSquareAjustedPerimeter(startPoint: Vec2, endPoint: Vec2): Vec2 {
    const endPointWithRespectToStartPoint: Vec2 = {
      x: endPoint.x - startPoint.x,
      y: endPoint.y - startPoint.y,
    };

    const endPointShortestComponent = Math.min(Math.abs(endPointWithRespectToStartPoint.x), Math.abs(endPointWithRespectToStartPoint.y));

    const isXComponentPositive: boolean = startPoint.x < endPoint.x;
    const isYComponentPositive: boolean = startPoint.y < endPoint.y;

    return {
      x: startPoint.x + (isXComponentPositive ? endPointShortestComponent : -endPointShortestComponent),
      y: startPoint.y + (isYComponentPositive ? endPointShortestComponent : -endPointShortestComponent),
    };
  }

  drawPerimeter(ctx: CanvasRenderingContext2D, startPoint: Vec2, endPoint: Vec2): void {
   /* const DASH_NUMBER = 8;

    if (this.isShiftDown) {
      endPoint = this.getSquareAjustedPerimeter(startPoint, endPoint);
    }

    const topLeft: Vec2 = {
      x: Math.min(startPoint.x, endPoint.x),
      y: Math.min(startPoint.y, endPoint.y),
    };

    const dimensions: Vec2 = {
      x: Math.abs(endPoint.x - startPoint.x),
      y: Math.abs(endPoint.y - startPoint.y),
    };

    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([DASH_NUMBER]);
    ctx.strokeStyle = '#888';
    ctx.rect(topLeft.x, topLeft.y, dimensions.x, dimensions.y);
    ctx.stroke();
    ctx.restore();*/
  }

  drawEllipse(isFinalDrawing: boolean, startPoint: Vec2, endPoint: Vec2): void {
   /* let ctx: CanvasRenderingContext2D = this.drawingService.previewCtx;
    this.selectionCanvas.width = this.drawingService.canvas.width;
    this.selectionCanvas.height = this.drawingService.canvas.height;

    //console.log(startPoint.x +" "+ startPoint.y +"    "+ endPoint.x +" "+endPoint.y);

    if (this.isShiftDown) {
      endPoint = this.getSquareAjustedPerimeter(startPoint, endPoint);
    }

    const center: Vec2 = {
      x: (startPoint.x + endPoint.x) / 2,
      y: (startPoint.y + endPoint.y) / 2,
    };

    const radii: Vec2 = {
      x: Math.abs(endPoint.x - startPoint.x) / 2,
      y: Math.abs(endPoint.y - startPoint.y) / 2,
    };

    if (isFinalDrawing) {
      this.selectionCanvasCTX.beginPath();
      this.selectionCanvasCTX.ellipse(center.x, center.y, radii.x, radii.y, 0, 0, this.CIRCLE_MAX_ANGLE);
      this.selectionCanvasCTX.clip();
      this.selectionCanvasCTX.drawImage(this.drawingService.canvas, 0, 0);
      this.endPoint = endPoint;
      this.selectionPos.x = this.startPoint.x; //
      this.selectionPos.y = this.startPoint.y; //
      //this.selectionCanvasCTX.clearRect(0,0,this.selectionCanvas.width, this.selectionCanvas.height);
    }

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = this.colourService.secondaryColour;
    ctx.ellipse(center.x, center.y, radii.x, radii.y, 0, 0, this.CIRCLE_MAX_ANGLE);
    ctx.stroke();
    ctx.restore();*/
  }
}
