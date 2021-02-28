import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { SelectionService } from './selection.service';

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

  public topLeft: Vec2 = { x: 0, y: 0 };
  public offset: Vec2 = { x: 0, y: 0 };

  public originalWidth: number;
  public originalHeight: number;

  protected hasBeenManipulated: boolean;
  protected needWhiteEllipsePostDrawing: boolean;
  protected originalTopLeft: Vec2;

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

  abstract initAllProperties(vertices: Vec2[]): void;
  abstract drawRegion(sourceCanvas: HTMLCanvasElement): void;
  abstract drawPostSelectionRegion(): void;

 select(sourceCanvas: HTMLCanvasElement, vertices: Vec2[]): void {
    this.clearAndResetAllCanvas();
    this.initAllProperties(vertices);
    this.drawRegion(sourceCanvas);
    this.drawCanvas(this.selectionCanvas, this.horizontalModificationCtx);
    this.drawCanvas(this.selectionCanvas, this.verticalModificationCtx);
    this.drawCanvas(this.selectionCanvas, this.originalCanvasCopyCtx);
  }

  drawSelection(target: CanvasRenderingContext2D, positionOnTarget: Vec2): void {
    if (!this.hasSelectionBeenManipulated(positionOnTarget)) {
      return;
    }

    if (this.needWhiteEllipsePostDrawing) {
      this.drawPostSelectionRegion();
    }
    this.drawCanvas(this.selectionCanvas, target, { x: positionOnTarget.x - this.topLeft.x + this.offset.x, y: positionOnTarget.y - this.topLeft.y + this.offset.y });
  }

  resizeSelection(topLeftOnSource: Vec2, bottomRightOnSource: Vec2, isHorizontal: boolean): void {
    let scaling;
    let newlength;
    this.hasBeenManipulated = true;

    if (isHorizontal) {
      newlength = (bottomRightOnSource.x - topLeftOnSource.x);
      scaling = newlength / this.originalWidth;
      this.drawResized(this.horizontalModificationCanvas, this.selectionCtx, scaling, isHorizontal);
      this.drawResized(this.originalCanvasCopy, this.verticalModificationCtx, scaling, isHorizontal);
      this.updateHorizontalOffset(newlength);
      return;
    }

    newlength = (bottomRightOnSource.y - topLeftOnSource.y);
    scaling = newlength / this.originalHeight;
    this.drawResized(this.verticalModificationCanvas, this.selectionCtx, scaling, isHorizontal);
    this.drawResized(this.originalCanvasCopy, this.horizontalModificationCtx, scaling, isHorizontal);
    this.updateVerticalOffset(newlength);
  }

  transform(contextToTransform: CanvasRenderingContext2D, scaling: number, isHorizontal: boolean) {
    contextToTransform.translate(this.selectionCanvas.width / 2, this.selectionCanvas.height / 2);
    if (isHorizontal) {
      contextToTransform.transform(scaling, 0, 0, 1, 0, 0);
    }
    else {
      contextToTransform.transform(1, 0, 0, scaling, 0, 0);
    }
    contextToTransform.translate(-this.selectionCanvas.width / 2, -this.selectionCanvas.height / 2);
  }

  drawCanvas(source: HTMLCanvasElement, target: CanvasRenderingContext2D, topLeftOnTarget?: Vec2) {
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

  drawResized(source: HTMLCanvasElement, target: CanvasRenderingContext2D, scaling: number, isHorizontalResizing: boolean) {
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

  clearAndResetAllCanvas() { //changing canvas size clears it
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
    return this.hasBeenManipulated = (this.originalTopLeft.x != topLeftOnTarget.x || this.originalTopLeft.y != topLeftOnTarget.y);
  }
}
