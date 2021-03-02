import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { SelectionService } from './selection.service';
import { HandlerMemento } from '@app/app/classes/handlerMemento'

export enum ResizingMode {
  off = 0,
  towardsRight = 1,
  towardsLeft = 2,
  towardsTop = 3,
  towardsBottom = 4,
}

@Injectable({
  providedIn: 'root'
})

export abstract class SelectionHandlerService {
  protected readonly CIRCLE_MAX_ANGLE: number = 360;

  public selectionCanvas: HTMLCanvasElement;
  public horizontalModificationCanvas: HTMLCanvasElement;
  public verticalModificationCanvas: HTMLCanvasElement;
  public originalCanvasCopy: HTMLCanvasElement;

  public selectionCtx: CanvasRenderingContext2D;
  public horizontalModificationCtx: CanvasRenderingContext2D;
  public verticalModificationCtx: CanvasRenderingContext2D;
  public originalCanvasCopyCtx: CanvasRenderingContext2D;

  public fixedTopLeft: Vec2 = { x: 0, y: 0 };
  public offset: Vec2 = { x: 0, y: 0 };

  public originalWidth: number;
  public originalHeight: number;
  public originalCenter: Vec2;
  public originalVertices: Vec2[];

  protected hasBeenManipulated: boolean;
  protected needWhiteEllipsePostDrawing: boolean;
  protected originalTopLeftOnBaseCanvas: Vec2;

  constructor(protected drawingService: DrawingService, protected selectionService: SelectionService) {
    this.selectionCanvas = document.createElement('canvas');
    this.selectionCtx = this.selectionCanvas.getContext('2d') as CanvasRenderingContext2D
    this.originalCanvasCopy = document.createElement('canvas');
    this.originalCanvasCopyCtx = this.originalCanvasCopy.getContext('2d') as CanvasRenderingContext2D;
    this.horizontalModificationCanvas = document.createElement('canvas');
    this.horizontalModificationCtx = this.horizontalModificationCanvas.getContext('2d') as CanvasRenderingContext2D
    this.verticalModificationCanvas = document.createElement('canvas');
    this.verticalModificationCtx = this.verticalModificationCanvas.getContext('2d') as CanvasRenderingContext2D
  }

  initAllProperties(vertices: Vec2[]): void {
    this.originalVertices = vertices;
    this.originalWidth = vertices[1].x - vertices[0].x;
    this.originalHeight = vertices[1].y - vertices[0].y
    this.fixedTopLeft.x = this.selectionCanvas.width / 2 - this.originalWidth / 2;
    this.fixedTopLeft.y = this.selectionCanvas.height / 2 - this.originalHeight / 2;
    this.offset = { x: 0, y: 0 };

    this.originalTopLeftOnBaseCanvas = { x: vertices[0].x, y: vertices[0].y };
    this.originalCenter = { x: (vertices[0].x + vertices[1].x) / 2, y: (vertices[0].y + vertices[1].y) / 2 };

    this.hasBeenManipulated = false;
    this.needWhiteEllipsePostDrawing = true;
  }

  abstract extractSelectionFromSource(sourceCanvas: HTMLCanvasElement): void;
  abstract drawWhitePostSelection(): void;

  select(sourceCanvas: HTMLCanvasElement, vertices: Vec2[]): void {
    this.clearAndResetAllCanvas();
    this.initAllProperties(vertices);
    this.extractSelectionFromSource(sourceCanvas);
    this.drawACanvasOnAnother(this.selectionCanvas, this.horizontalModificationCtx);
    this.drawACanvasOnAnother(this.selectionCanvas, this.verticalModificationCtx);
    this.drawACanvasOnAnother(this.selectionCanvas, this.originalCanvasCopyCtx);
  }

  /*quickDraw(previousSelection: HTMLCanvasElement, target: CanvasRenderingContext2D,  fixedTopLeft: Vec2, offset: Vec2, topLeftOnTarget: Vec2){
    this.clearAndResetAllCanvas();
    this.selectionCanvas = previousSelection;
    this.fixedTopLeft = fixedTopLeft;
    this.offset = offset;
    this.drawSelection(target, topLeftOnTarget);
  }*/

  drawSelection(target: CanvasRenderingContext2D, topLeftOnTarget: Vec2): void {
    if (!this.hasSelectionBeenManipulated(topLeftOnTarget)) {
      return;
    }

    if (this.needWhiteEllipsePostDrawing) {
      this.drawWhitePostSelection();
    }
    let topLeft: Vec2= { x: topLeftOnTarget.x - this.fixedTopLeft.x + this.offset.x, y: topLeftOnTarget.y - this.fixedTopLeft.y + this.offset.y };
    this.drawACanvasOnAnother(this.selectionCanvas, target, topLeft);
  }

  resizeSelection(topLeftOnSource: Vec2, bottomRightOnSource: Vec2, isHorizontal: boolean): void {
    let scaling;
    let newlength;
    this.hasBeenManipulated = true;

    if (isHorizontal) {
      newlength = (bottomRightOnSource.x - topLeftOnSource.x);
      scaling = newlength / this.originalWidth;
      this.overwriteACanvasWithAnother(this.horizontalModificationCanvas, this.selectionCtx, scaling, isHorizontal);
      this.overwriteACanvasWithAnother(this.originalCanvasCopy, this.verticalModificationCtx, scaling, isHorizontal);
      this.updateHorizontalOffset(newlength);
      return;
    }

    newlength = (bottomRightOnSource.y - topLeftOnSource.y);
    scaling = newlength / this.originalHeight;
    this.overwriteACanvasWithAnother(this.verticalModificationCanvas, this.selectionCtx, scaling, isHorizontal);
    this.overwriteACanvasWithAnother(this.originalCanvasCopy, this.horizontalModificationCtx, scaling, isHorizontal);
    this.updateVerticalOffset(newlength);
  }

  transform(contextToTransform: CanvasRenderingContext2D, scaling: number, isHorizontal: boolean): void {
    contextToTransform.translate(this.selectionCanvas.width / 2, this.selectionCanvas.height / 2);
    if (isHorizontal) {
      contextToTransform.transform(scaling, 0, 0, 1, 0, 0);
    }
    else {
      contextToTransform.transform(1, 0, 0, scaling, 0, 0);
    }
    contextToTransform.translate(-this.selectionCanvas.width / 2, -this.selectionCanvas.height / 2);
  }

  drawACanvasOnAnother(source: HTMLCanvasElement, target: CanvasRenderingContext2D, topLeftOnTarget?: Vec2): void {
    let definedPosition: Vec2;
    if (topLeftOnTarget == undefined) {
      definedPosition = { x: 0, y: 0 };
    }
    else {
      definedPosition = { x: topLeftOnTarget.x, y: topLeftOnTarget.y };
    }
    target.beginPath();
    target.imageSmoothingEnabled = false;
    target.drawImage(source, definedPosition.x, definedPosition.y);
    target.closePath();
  }

  overwriteACanvasWithAnother(source: HTMLCanvasElement, target: CanvasRenderingContext2D, scaling: number, isHorizontalResizing: boolean): void {
    this.drawingService.clearCanvas(target);
    target.beginPath();
    this.transform(target, scaling, isHorizontalResizing);
    target.imageSmoothingEnabled = false;
    target.drawImage(source, 0, 0);
    target.closePath();
    target.resetTransform();
  }

  updateHorizontalOffset(newWidth: number): void {
    this.offset.x = (newWidth - this.originalWidth) / 2
  }

  updateVerticalOffset(newHeight: number): void {
    this.offset.y = (newHeight - this.originalHeight) / 2;
  }

  clearAndResetAllCanvas(): void { //changing canvas size clears it
    this.selectionCanvas.width = this.drawingService.canvas.width;
    this.selectionCanvas.height = this.drawingService.canvas.height;
    this.originalCanvasCopy.width = this.drawingService.canvas.width;
    this.originalCanvasCopy.height = this.drawingService.canvas.height;
    this.horizontalModificationCanvas.width = this.drawingService.canvas.width;
    this.horizontalModificationCanvas.height = this.drawingService.canvas.height;
    this.verticalModificationCanvas.width = this.drawingService.canvas.width;
    this.verticalModificationCanvas.height = this.drawingService.canvas.height; //=2000?
  }

  hasSelectionBeenManipulated(topLeftOnTarget: Vec2): boolean {
    if (this.hasBeenManipulated) {
      return true;
    }
    return this.hasBeenManipulated = (this.originalTopLeftOnBaseCanvas.x != topLeftOnTarget.x || this.originalTopLeftOnBaseCanvas.y != topLeftOnTarget.y);
  }

  createMemento(): HandlerMemento {
    let memento: HandlerMemento = new HandlerMemento(this.drawingService.canvasSize.x, this.drawingService.canvasSize.y);

    memento.fixedTopLeft = this.fixedTopLeft;
    memento.offset = this.offset;

    memento.originalWidth = this.originalWidth;
    memento.originalHeight = this.originalHeight;

    memento.hasBeenManipulated = true;
    memento.needWhiteEllipsePostDrawing = true;//////
    memento.originalTopLeftOnBaseCanvas = this.originalTopLeftOnBaseCanvas;
    memento.originalCenter = this.originalCenter;
    memento.originalVertices = this.originalVertices;
   
    this.drawACanvasOnAnother(this.selectionCanvas, memento.selectionCtx, {x:0, y:0});
    this.drawACanvasOnAnother(this.horizontalModificationCanvas, memento.horizontalModificationCtx);
    this.drawACanvasOnAnother(this.verticalModificationCanvas, this.verticalModificationCtx);
    this.drawACanvasOnAnother(this.originalCanvasCopy, this.originalCanvasCopyCtx);
    return memento;
  }

  restoreFromMemento(memento: HandlerMemento): void {
    this.selectionCanvas = memento.selectionCanvas;
    this.horizontalModificationCanvas = memento.horizontalModificationCanvas;
    this.verticalModificationCanvas = memento.verticalModificationCanvas;
    this.originalCanvasCopy = memento.originalCanvasCopy;

    this.selectionCtx = memento.selectionCtx;
    this.horizontalModificationCtx = memento.horizontalModificationCtx;
    this.verticalModificationCtx = memento.verticalModificationCtx;
    this.originalCanvasCopyCtx = memento.originalCanvasCopyCtx;

    this.fixedTopLeft = memento.fixedTopLeft;
    this.offset = memento.offset;

    this.originalWidth = memento.originalWidth;
    this.originalHeight = memento.originalHeight;

    this.hasBeenManipulated = true;
    this.needWhiteEllipsePostDrawing = true;//////
    this.originalTopLeftOnBaseCanvas = memento.originalTopLeftOnBaseCanvas;

    this.originalCenter = memento.originalCenter;
    this.originalVertices = memento.originalVertices;

    //this.drawACanvasOnAnother(this.selectionCanvas, this.drawingService.baseCtx, {x:0, y:0});
  }

}
