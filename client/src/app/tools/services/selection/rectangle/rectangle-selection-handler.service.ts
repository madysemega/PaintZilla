import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { RectangleSelectionHelperService } from './rectangle-selection-helper.service';
import { SelectionHandlerService } from '@app/tools/services/selection/selection-base/selection-handler.service';

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

export class RectangleSelectionHandlerService extends SelectionHandlerService {

  constructor(drawingService: DrawingService, protected selectionService: RectangleSelectionHelperService) {
    super(drawingService, selectionService);
  }

  initAllProperties(vertices: Vec2[]): void {//will be abstract
    this.originalWidth = vertices[1].x - vertices[0].x;
    this.originalHeight = vertices[1].y - vertices[0].y
    this.topLeft.x = this.selectionCanvas.width / 2 - this.originalWidth/2;
    this.topLeft.y = this.selectionCanvas.height / 2 - this.originalHeight/2;
    this.offset = { x: 0, y: 0 };

    this.originalTopLeft = { x: vertices[0].x, y: vertices[0].y };

    this.hasBeenManipulated = false;
    this.needWhiteEllipsePostDrawing = true;
  }

  drawRegion(sourceCanvas: HTMLCanvasElement) { //will be abstract drawRegion
    this.selectionCtx.save();
    this.selectionCtx.beginPath();
    this.selectionCtx.rect(this.topLeft.x, this.topLeft.y, this.originalWidth, this.originalHeight);
    this.selectionCtx.clip();
    this.selectionCtx.imageSmoothingEnabled = false;
    this.selectionCtx.drawImage(sourceCanvas, this.topLeft.x - this.originalTopLeft.x, this.topLeft.y - this.originalTopLeft.y);
    this.selectionCtx.closePath();
    this.selectionCtx.restore();
  }

  drawPostSelectionRegion() {
    this.selectionService.drawPostSelectionRectangle(this.originalTopLeft, this.originalWidth, this.originalHeight);
  }
}
