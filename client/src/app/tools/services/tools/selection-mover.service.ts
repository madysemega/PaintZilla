import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { Tool } from '@app/tools/classes/tool';
import { EllipseSelectionRendererService } from './ellipse-selection-renderer.service';
import { SelectionService } from './selection.service';

@Injectable({
  providedIn: 'root'
})

export class SelectionMoverService extends Tool {
  private selectionCanvas: HTMLCanvasElement;
  private selectionCanvasCtx: CanvasRenderingContext2D;

  private selectionAnchorPoint: Vec2;

  private selectionTopLeft: Vec2;
  private selectionBottomRight: Vec2;

  private targetTopLeft: Vec2;

  private accumulatedMovement: Vec2;
  private modificationCanvas: HTMLCanvasElement;
  private modificationCanvasCtx: CanvasRenderingContext2D;

  public initialPos : Vec2;
  public canvasClone: HTMLCanvasElement;
  public canvasCloneCtx: CanvasRenderingContext2D;


  private mouseLastPos: Vec2 = { x: 0, y: 0 };

  constructor(drawingService: DrawingService, private selectionService: SelectionService, private ellipseSelectionRenderer: EllipseSelectionRendererService) {
    super(drawingService);
    this.key = 'selection-mover';
  }

  setSelection(selectionCanvas: HTMLCanvasElement, selectionCanvasCtx: CanvasRenderingContext2D, selectionStartPoint: Vec2, selectionEndPoint: Vec2, targetTopLeft: Vec2) {
    this.selectionCanvas = selectionCanvas;
    this.selectionCanvasCtx = selectionCanvasCtx;
    this.selectionAnchorPoint = { x: selectionStartPoint.x, y: selectionStartPoint.y };
    this.selectionTopLeft = { x: selectionStartPoint.x, y: selectionStartPoint.y };
    this.selectionBottomRight = { x: selectionEndPoint.x, y: selectionEndPoint.y };
    this.accumulatedMovement = { x: 0, y: 0 };
    this.modificationCanvas = document.createElement('canvas');
    this.modificationCanvasCtx = this.modificationCanvas.getContext('2d') as CanvasRenderingContext2D;
    this.modificationCanvas.width = this.drawingService.canvas.width;
    this.modificationCanvas.height = this.drawingService.canvas.height;
    this.targetTopLeft = targetTopLeft;
  }

  onMouseDown(event: MouseEvent): void {
    this.mouseDown = event.button === MouseButton.Left;
    const mousePosition = this.getPositionFromMouse(event);
    if (this.mouseDown) {
      if (!this.isClickOnSelection(event)) {
        this.selectionService.isSelectionBeingMoved = false;
        this.mouseDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        this.ellipseSelectionRenderer.sourceTopLeft = { x: 0, y: 0 };
        this.ellipseSelectionRenderer.targetTopLeft = { x: this.targetTopLeft.x, y: this.targetTopLeft.y };
        this.ellipseSelectionRenderer.isFillWhiteBehindSelection = true;
        this.ellipseSelectionRenderer.selectionCanvas = this.selectionCanvas;
        this.ellipseSelectionRenderer.ctx = this.drawingService.baseCtx;
        this.ellipseSelectionRenderer.render();

        this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.selectionTopLeft, this.selectionBottomRight);
      }
      this.mouseLastPos.x = mousePosition.x;
      this.mouseLastPos.y = mousePosition.y;
    }
  }

  isClickOnSelection(event: MouseEvent): boolean {
    const mousePosition = this.getPositionFromMouse(event);
    const xInSelection: boolean = mousePosition.x > Math.min(this.selectionTopLeft.x, this.selectionBottomRight.x)
      && mousePosition.x < Math.max(this.selectionTopLeft.x, this.selectionBottomRight.x);
    const yInSelection: boolean = mousePosition.y > Math.min(this.selectionTopLeft.y, this.selectionBottomRight.y)
      && mousePosition.y < Math.max(this.selectionTopLeft.y, this.selectionBottomRight.y);
    return (xInSelection && yInSelection);
  }

  onMouseUp(event: MouseEvent): void {
    this.mouseDown = false;
  }

  onMouseMove(event: MouseEvent): void {
    const mousePosition = this.getPositionFromMouse(event);

    if (this.mouseDown) {
      this.drawingService.clearCanvas(this.drawingService.previewCtx);
      const mouseMovement: Vec2 = { x: mousePosition.x - this.mouseLastPos.x, y: mousePosition.y - this.mouseLastPos.y }

      this.mouseLastPos.x += mouseMovement.x;
      this.mouseLastPos.y += mouseMovement.y;

      this.selectionTopLeft.x += mouseMovement.x;
      this.selectionTopLeft.y += mouseMovement.y;

      this.selectionBottomRight.x += mouseMovement.x;
      this.selectionBottomRight.y += mouseMovement.y;

      this.targetTopLeft.x += mouseMovement.x;
      this.targetTopLeft.y += mouseMovement.y;

      this.ellipseSelectionRenderer.sourceTopLeft = { x: 0, y: 0 };
      this.ellipseSelectionRenderer.targetTopLeft = { x: this.targetTopLeft.x, y: this.targetTopLeft.y };
      this.ellipseSelectionRenderer.isFillWhiteBehindSelection = false;
      this.ellipseSelectionRenderer.selectionCanvas = this.selectionCanvas;
      this.ellipseSelectionRenderer.ctx = this.drawingService.previewCtx;
      this.ellipseSelectionRenderer.render();
      this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.selectionTopLeft, this.selectionBottomRight);

      //this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.selectionTopLeft, this.selectionBottomRight);
      //let center: Vec2 = { x: 0, y: 0 };
      //let radii: Vec2 = { x: 0, y: 0 };
      //this.selectionService.getEllipseParam(this.selectionTopLeft, this.selectionBottomRight, center, radii);
      //this.selectionService.drawSelectionEllipse(center, radii);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key == 'z') {
      console.log("d");

      //this.drawingService.clearCanvas(this.drawingService.baseCtx);
      this.drawingService.clearCanvas(this.drawingService.previewCtx);

      this.modificationCanvasCtx.beginPath();
      this.modificationCanvasCtx.translate(this.drawingService.canvas.width/2, this.drawingService.canvas.height/2);
      this.modificationCanvasCtx.rotate((45*Math.PI)/180);
      this.modificationCanvasCtx.translate(-this.drawingService.canvas.width/2, -this.drawingService.canvas.height/2);
      this.modificationCanvasCtx.drawImage(this.selectionCanvas, 0,0);
      this.modificationCanvasCtx.closePath();
      this.drawingService.clearCanvas(this.selectionCanvasCtx);

      this.selectionCanvasCtx.beginPath();
      this.selectionCanvasCtx.drawImage(this.modificationCanvas, 0,0);
      this.selectionCanvasCtx.closePath();

      this.drawingService.baseCtx.beginPath();
      this.drawingService.baseCtx.drawImage(this.selectionCanvas, 0,0);
      this.drawingService.baseCtx.closePath();




      //this.drawingService.clearCanvas(this.selectionCanvasCtx);
      //this.modificationCanvasCtx.translate(this.selectionCanvas.width / 2, this.selectionCanvas.height / 2);
     /* this.modificationCanvasCtx.beginPath();
      this.modificationCanvasCtx.drawImage(this.selectionCanvas, 0,0);
      this.modificationCanvasCtx.closePath();

     /* this.drawingService.clearCanvas(this.drawingService.baseCtx);
      this.drawingService.baseCtx.beginPath();
      this.drawingService.baseCtx.drawImage(this.modificationCanvas, 0,0);*/

      //this.drawingService.clearCanvas(this.selectionCanvasCtx);
    /*  this.drawingService.clearCanvas(this.drawingService.baseCtx);
      this.drawingService.clearCanvas(this.drawingService.previewCtx);*/
     /* this.selectionCanvasCtx.beginPath();
      this.selectionCanvasCtx.translate(this.drawingService.canvas.width/2, this.drawingService.canvas.height/2);
      this.selectionCanvasCtx.rotate((45*Math.PI)/180);
      this.selectionCanvasCtx.translate(-this.drawingService.canvas.width/2, -this.drawingService.canvas.height/2);
      this.selectionCanvasCtx.drawImage(this.modificationCanvas,0,0);
      this.selectionCanvasCtx.closePath();*/

    /*  this.drawingService.baseCtx.beginPath();
      this.drawingService.baseCtx.drawImage(this.modificationCanvas,0,0);
      this.drawingService.baseCtx.closePath();*/

      //this.drawingService.clearCanvas(this.drawingService.baseCtx);
     // this.drawingService.clearCanvas(this.drawingService.previewCtx);

     /* this.drawingService.clearCanvas(this.drawingService.baseCtx);
      this.drawingService.baseCtx.beginPath();
      this.drawingService.baseCtx.drawImage(this.selectionCanvas, 0,0);
      this.drawingService.baseCtx.closePath();*/

      /*this.selectionCanvasCtx.beginPath();
      this.selectionCanvasCtx.ellipse( this.selectionCanvas.width/2,  this.selectionCanvas.height/2, radii.x, radii.y, 0, 0, this.CIRCLE_MAX_ANGLE);
      this.selectionCanvasCtx.clip();
      this.selectionCanvasCtx.drawImage(this.canvasClone, this.initialPos.x , this.initialPos.y);
      this.selectionCanvasCtx.closePath();*/

     /* this.selectionCanvasCtx.translate(this.selectionCanvas.width / 2, this.selectionCanvas.height / 2);
      this.selectionCanvasCtx.transform(2, 0, 0, 1, 0, 0);
      this.selectionCanvasCtx.translate(-this.selectionCanvas.width / 2, -this.selectionCanvas.height / 2);
      this.selectionCanvasCtx.drawImage(this.canvasClone, this.initialPos.x , this.initialPos.y);*/

      //this.selectionCanvasCtx.drawImage(this.drawingService.canvas, this.selectionCanvas.width/2-radii.x- this.startPoint.x , this.selectionCanvas.height/2-radii.y- this.startPoint.y);
      /*
      this.modificationCanvas.width = this.drawingService.canvas.width;
      this.modificationCanvas.height = this.drawingService.canvas.height;
      this.drawingService.clearCanvas(this.modificationCanvasCtx);
     /* this.modificationCanvasCtx.translate(this.drawingService.canvas.width / 2, this.drawingService.canvas.height / 2);
      this.modificationCanvasCtx.rotate(45 * Math.PI / 180);
      this.modificationCanvasCtx.translate(-this.drawingService.canvas.width / 2, -this.drawingService.canvas.height / 2);
      this.modificationCanvasCtx.drawImage(this.selectionCanvas, 0, 0);
      this.drawingService.clearCanvas(this.selectionCanvasCtx);
      this.selectionCanvasCtx.drawImage(this.modificationCanvas, 0, 0);*/
    }

  }

  onKeyUp(event: KeyboardEvent): void {
  }

  drawPerimeter(ctx: CanvasRenderingContext2D, startPoint: Vec2, endPoint: Vec2): void {
  }

  drawEllipse(isFinalDrawing: boolean, startPoint: Vec2, endPoint: Vec2): void {
  }
}
