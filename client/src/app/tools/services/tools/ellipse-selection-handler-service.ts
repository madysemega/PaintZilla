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

export class EllipseSelectionHandlerService {
  private readonly CIRCLE_MAX_ANGLE: number = 360;

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
  private newWidth: number;///////////////////////

  private hasBeenManipulated: boolean;
  private needWiteEllipse: boolean;
  private selectionOriginalStartPoint: Vec2;
  private selectionOriginalCenter: Vec2;
  private selectionOriginalRadii: Vec2;

  constructor(private drawingService: DrawingService, private selectionService: SelectionService) {
    this.selectionCanvas = document.createElement('canvas');
    this.selectionCtx = this.selectionCanvas.getContext('2d') as CanvasRenderingContext2D
    this.originalCanvasCopy = document.createElement('canvas');
    this.originalCanvasCopyCtx = this.originalCanvasCopy.getContext('2d') as CanvasRenderingContext2D;
    this.horizontalModificationCanvas = document.createElement('canvas');
    this.horizontalModificationCtx = this.horizontalModificationCanvas.getContext('2d') as CanvasRenderingContext2D
    this.verticalModificationCanvas = document.createElement('canvas');
    this.verticalModificationCtx = this.verticalModificationCanvas.getContext('2d') as CanvasRenderingContext2D

  }

  selectArea(sourceCanvas: HTMLCanvasElement, selectionStartPoint: Vec2, center: Vec2, radii: Vec2): void {
    this.clearAndResetAllCanvas();
    this.drawRegion(sourceCanvas, selectionStartPoint, radii);
    this.drawCanvas(this.selectionCanvas, this.horizontalModificationCtx);
    this.drawCanvas(this.selectionCanvas, this.verticalModificationCtx);
    this.drawCanvas(this.selectionCanvas, this.originalCanvasCopyCtx);
    this.initProperties(selectionStartPoint, center, radii);
  }

  reselectArea(selectionStartPoint: Vec2, center: Vec2, radii: Vec2): void {
    this.selectArea(this.drawingService.previewCanvas, selectionStartPoint, center, radii);
    this.hasBeenManipulated = true;
    this.needWiteEllipse = false;
  }

  drawSelection(position: Vec2, target: CanvasRenderingContext2D): void {
    if (this.hasSelectionBeenManipulated(position)) {
      target.imageSmoothingEnabled = false;
      if (this.needWiteEllipse) {
        this.selectionService.drawPostSelectionEllipse(this.selectionOriginalCenter, this.selectionOriginalRadii);
      }
      this.drawCanvas(this.selectionCanvas, target, { x: position.x - this.topLeft.x + this.offset.x, y: position.y - this.topLeft.y + this.offset.y });
    }
  }

  resizeSelection(topLeft: Vec2, bottomRight: Vec2, isHorizontal: boolean): void {
    let scaling;
    let newlength;
    this.hasBeenManipulated = true;

    if (isHorizontal) {
      newlength = (bottomRight.x - topLeft.x);
      scaling = newlength / this.originalWidth;
      this.drawResized(this.horizontalModificationCanvas, this.selectionCtx, scaling, isHorizontal);
      this.drawResized(this.originalCanvasCopy, this.verticalModificationCtx, scaling, isHorizontal);
      this.updateHorizontalOffset(newlength);
      return;
    }

    newlength = (bottomRight.y - topLeft.y);
    scaling = newlength / this.originalHeight;
    this.drawResized(this.verticalModificationCanvas, this.selectionCtx, scaling, isHorizontal);
    this.drawResized(this.originalCanvasCopy, this.horizontalModificationCtx, scaling, isHorizontal);
    this.updateVerticalOffset(newlength);
  }

  resizeSelectionHorizontally(topLeft: Vec2, bottomRight: Vec2): void {
    this.newWidth = (bottomRight.x - topLeft.x);
    let horizontalScaling = this.newWidth / this.originalWidth;

    this.drawResized(this.horizontalModificationCanvas, this.selectionCtx, horizontalScaling, true);
    this.drawResized(this.originalCanvasCopy, this.verticalModificationCtx, horizontalScaling, true);

    this.hasBeenManipulated = true;
    this.updateHorizontalOffset(this.newWidth);
  }

  resizeSelectionVertically(topLeft: Vec2, bottomRight: Vec2): void {
    let newHeight = (bottomRight.y - topLeft.y);
    let verticalScaling = newHeight / this.originalHeight;

    this.drawResized(this.verticalModificationCanvas, this.selectionCtx, verticalScaling, false);
    this.drawResized(this.originalCanvasCopy, this.horizontalModificationCtx, verticalScaling, false);

    this.hasBeenManipulated = true;
    this.updateVerticalOffset(newHeight);
  }




  transform(target: CanvasRenderingContext2D, scaling: number, isHorizontal: boolean) {
    target.translate(this.selectionCanvas.width / 2, this.selectionCanvas.height / 2);
    if (isHorizontal) {
      target.transform(scaling, 0, 0, 1, 0, 0);
    }
    else {
      target.transform(1, 0, 0, scaling, 0, 0);
    }
    target.translate(-this.selectionCanvas.width / 2, -this.selectionCanvas.height / 2);
  }

  drawCanvas(source: HTMLCanvasElement, target: CanvasRenderingContext2D, position?: Vec2) {
    let definedPosition: Vec2;
    if (position == undefined) {
      definedPosition = { x: 0, y: 0 };
    }
    else {
      definedPosition = { x: position.x, y: position.y };
    }
    target.beginPath();
    target.imageSmoothingEnabled = false;
    target.drawImage(source, definedPosition.x, definedPosition.y);
    target.closePath();
  }

  drawRegion(sourceCanvas: HTMLCanvasElement, selectionStartPoint: Vec2, radii: Vec2) {
    this.selectionCtx.save();
    this.selectionCtx.beginPath();
    this.selectionCtx.ellipse(this.selectionCanvas.width / 2, this.selectionCanvas.height / 2, radii.x, radii.y, 0, 0, this.CIRCLE_MAX_ANGLE);
    this.selectionCtx.clip();
    this.selectionCtx.imageSmoothingEnabled = false;
    this.selectionCtx.drawImage(sourceCanvas, this.selectionCanvas.width / 2 - radii.x - selectionStartPoint.x, this.selectionCanvas.height / 2 - radii.y - selectionStartPoint.y);
    this.selectionCtx.closePath();
    this.selectionCtx.restore();
  }

  drawResized(source: HTMLCanvasElement, target: CanvasRenderingContext2D, scaling: number, isHorizontal: boolean) {
    this.drawingService.clearCanvas(target);
    target.beginPath();
    this.transform(target, scaling, isHorizontal);
    target.imageSmoothingEnabled = false;//////////////
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

  initProperties(selectionStartPoint: Vec2, center: Vec2, radii: Vec2) {
    this.topLeft.x = this.selectionCanvas.width / 2 - radii.x;
    this.topLeft.y = this.selectionCanvas.height / 2 - radii.y;
    this.originalWidth = radii.x * 2;
    this.originalHeight = radii.y * 2;
    this.offset = { x: 0, y: 0 };

    this.selectionOriginalStartPoint = { x: selectionStartPoint.x, y: selectionStartPoint.y };
    this.selectionOriginalCenter = center;
    this.selectionOriginalRadii = radii;
    this.hasBeenManipulated = false;
    this.needWiteEllipse = true;
  }

  clearAndResetAllCanvas() {
    this.selectionCanvas.width = this.drawingService.canvas.width;
    this.selectionCanvas.height = this.drawingService.canvas.height;
    this.originalCanvasCopy.width = this.drawingService.canvas.width;
    this.originalCanvasCopy.height = this.drawingService.canvas.height;
    this.horizontalModificationCanvas.width = this.drawingService.canvas.width;
    this.horizontalModificationCanvas.height = this.drawingService.canvas.height;
    this.verticalModificationCanvas.width = this.drawingService.canvas.width;
    this.verticalModificationCanvas.height = this.drawingService.canvas.height;
  }

  hasSelectionBeenManipulated(newStartPos: Vec2): boolean {
    if (this.hasBeenManipulated) {
      return true;
    }
    return this.hasBeenManipulated = (this.selectionOriginalStartPoint.x != newStartPos.x || this.selectionOriginalStartPoint.y != newStartPos.y);
  }
}
