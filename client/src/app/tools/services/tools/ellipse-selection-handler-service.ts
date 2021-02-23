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
  private hasBeenResized: boolean;
  private hasBeenMoved: boolean;
  private selectionOriginalStartPoint: Vec2;
  private selectionOriginalCenter: Vec2;
  private selectionOriginalRadii: Vec2;

  constructor(private drawingService: DrawingService, private selectionService: SelectionService) {
    this.selectionCanvas = document.createElement('canvas');
    this.selectionCtx = this.selectionCanvas.getContext('2d') as CanvasRenderingContext2D
    this.originalCanvasCopy =  document.createElement('canvas');
    this.originalCanvasCopyCtx = this.originalCanvasCopy.getContext('2d') as CanvasRenderingContext2D;
    this.horizontalModificationCanvas = document.createElement('canvas');
    this.horizontalModificationCtx = this.horizontalModificationCanvas.getContext('2d') as CanvasRenderingContext2D
    this.verticalModificationCanvas = document.createElement('canvas');
    this.verticalModificationCtx = this.verticalModificationCanvas.getContext('2d') as CanvasRenderingContext2D
  }

  selectArea(selectionStartPoint: Vec2, center: Vec2, radii: Vec2): void {

    this.clearAndResetCanvas();
    this.selectionCtx.save();
    this.selectionCtx.beginPath();
    this.selectionCtx.ellipse(this.selectionCanvas.width / 2, this.selectionCanvas.height / 2, radii.x, radii.y, 0, 0, this.CIRCLE_MAX_ANGLE);
    this.selectionCtx.clip();
    this.selectionCtx.imageSmoothingEnabled = false;
    this.selectionCtx.drawImage(this.drawingService.canvas, this.selectionCanvas.width / 2 - radii.x - selectionStartPoint.x, this.selectionCanvas.height / 2 - radii.y - selectionStartPoint.y);
    this.selectionCtx.closePath();
    this.selectionCtx.restore();

    this.horizontalModificationCtx.beginPath();
    this.horizontalModificationCtx.imageSmoothingEnabled = false;
    this.horizontalModificationCtx.drawImage(this.selectionCanvas, 0, 0);
    this.horizontalModificationCtx.closePath();

    this.verticalModificationCtx.beginPath();
    this.verticalModificationCtx.imageSmoothingEnabled = false;
    this.verticalModificationCtx.drawImage(this.selectionCanvas, 0, 0);
    this.verticalModificationCtx.closePath();

    this.originalCanvasCopyCtx.beginPath();
    this.originalCanvasCopyCtx.imageSmoothingEnabled = false;
    this.originalCanvasCopyCtx.drawImage(this.selectionCanvas, 0, 0);
    this.originalCanvasCopyCtx.closePath();

    this.topLeft.x = this.selectionCanvas.width / 2 - radii.x;
    this.topLeft.y = this.selectionCanvas.height / 2 - radii.y;
    this.originalWidth = radii.x * 2;
    this.originalHeight = radii.y * 2;
    this.offset = { x: 0, y: 0 };

    this.selectionOriginalStartPoint = { x: selectionStartPoint.x, y: selectionStartPoint.y };
    this.selectionOriginalCenter = center;
    this.selectionOriginalRadii = radii;
    this.hasBeenResized = false;
    this.hasBeenMoved = false;
  }

  drawSelection(position: Vec2, ctx: CanvasRenderingContext2D): void {
    if (this.hasSelectionBeenMoved(position)) {
      ctx.imageSmoothingEnabled = false;
      this.selectionService.drawPostSelectionEllipse(this.selectionOriginalCenter, this.selectionOriginalRadii);
      ctx.beginPath();
      ctx.drawImage(this.selectionCanvas, position.x - this.topLeft.x + this.offset.x, position.y - this.topLeft.y + this.offset.y);
      ctx.closePath();
    }
  }

  resizeSelectionHorizontally(topLeft: Vec2, bottomRight: Vec2): void {
    let newWidth = Math.abs(topLeft.x - bottomRight.x);
    let increaseRatio = newWidth / this.originalWidth;

    this.drawingService.clearCanvas(this.selectionCtx);
    this.selectionCtx.beginPath();
    this.selectionCtx.translate(this.selectionCanvas.width / 2, this.selectionCanvas.height / 2);
    this.selectionCtx.transform(increaseRatio, 0, 0, 1, 0, 0);
    this.selectionCtx.translate(-this.selectionCanvas.width / 2, -this.selectionCanvas.height / 2);
    this.selectionCtx.drawImage(this.horizontalModificationCanvas, 0, 0);
    this.selectionCtx.closePath();
    this.selectionCtx.resetTransform();

    this.drawingService.clearCanvas(this.verticalModificationCtx);
    this.verticalModificationCtx.beginPath();
    this.verticalModificationCtx.translate(this.selectionCanvas.width / 2, this.selectionCanvas.height / 2);
    this.verticalModificationCtx.transform(increaseRatio, 0, 0, 1, 0, 0);
    this.verticalModificationCtx.translate(-this.selectionCanvas.width / 2, -this.selectionCanvas.height / 2);
    this.verticalModificationCtx.drawImage(this.originalCanvasCopy,0,0);
    this.verticalModificationCtx.closePath();
    this.verticalModificationCtx.resetTransform();

    this.hasBeenResized = true;
    this.updateHorizontalOffset(newWidth);
  }

  resizeSelectionVertically(topLeft: Vec2, bottomRight: Vec2): void {
    let newHeight = Math.abs(topLeft.y - bottomRight.y);
    let increaseRatio = newHeight / this.originalHeight;

    this.drawingService.clearCanvas(this.selectionCtx);
    this.selectionCtx.beginPath();
    this.selectionCtx.translate(this.selectionCanvas.width / 2, this.selectionCanvas.height / 2);
    this.selectionCtx.transform(1, 0, 0, increaseRatio, 0, 0);
    this.selectionCtx.translate(-this.selectionCanvas.width / 2, -this.selectionCanvas.height / 2);
    this.selectionCtx.drawImage(this.verticalModificationCanvas, 0, 0);
    this.selectionCtx.closePath();
    this.selectionCtx.resetTransform();

    this.drawingService.clearCanvas(this.horizontalModificationCtx);
    this.horizontalModificationCtx.beginPath();
    this.horizontalModificationCtx.translate(this.selectionCanvas.width / 2, this.selectionCanvas.height / 2);
    this.horizontalModificationCtx.transform(1, 0, 0, increaseRatio, 0, 0);
    this.horizontalModificationCtx.translate(-this.selectionCanvas.width / 2, -this.selectionCanvas.height / 2);
    this.horizontalModificationCtx.drawImage(this.originalCanvasCopy,0,0);
    this.horizontalModificationCtx.closePath();
    this.horizontalModificationCtx.resetTransform();

    this.hasBeenResized = true;
    this.updateVerticalOffset(newHeight);
  }

  updateHorizontalOffset(newWidth: number): void {
     this.offset.x = (newWidth - this.originalWidth) / 2
  }

  updateVerticalOffset(newHeight: number): void {
    this.offset.y = (newHeight - this.originalHeight) / 2;
  }

  clearAndResetCanvas() {
    this.selectionCanvas.width = this.drawingService.canvas.width;
    this.selectionCanvas.height = this.drawingService.canvas.height;
    this.originalCanvasCopy.width = this.drawingService.canvas.width;
    this.originalCanvasCopy.height = this.drawingService.canvas.height;
    this.horizontalModificationCanvas.width = this.drawingService.canvas.width;
    this.horizontalModificationCanvas.height = this.drawingService.canvas.height;
    this.verticalModificationCanvas.width = this.drawingService.canvas.width;
    this.verticalModificationCanvas.height = this.drawingService.canvas.height;
  }

  hasSelectionBeenMoved(newStartPos: Vec2): boolean {
    if (this.hasBeenMoved) {
      return true;
    }
    return this.hasBeenMoved = (this.hasBeenResized || this.selectionOriginalStartPoint.x != newStartPos.x || this.selectionOriginalStartPoint.y != newStartPos.y);
  }
}
