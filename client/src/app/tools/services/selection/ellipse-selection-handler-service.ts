import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { SelectionHandlerService } from './selection-handler.service';
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

export class EllipseSelectionHandlerService extends SelectionHandlerService {

  private originalCenter: Vec2;
  private originalRadii: Vec2;

  constructor(drawingService: DrawingService, selectionService: SelectionService) {
    super(drawingService, selectionService);
  }

  initAllProperties(vertices: Vec2[]): void {//will be abstract
    this.originalRadii = { x: (vertices[1].x - vertices[0].x) / 2, y: (vertices[1].y - vertices[0].y) / 2 };
    this.topLeft.x = this.selectionCanvas.width / 2 - this.originalRadii.x;
    this.topLeft.y = this.selectionCanvas.height / 2 - this.originalRadii.y;
    this.originalWidth = this.originalRadii.x * 2;
    this.originalHeight = this.originalRadii.y * 2;
    this.offset = { x: 0, y: 0 };

    this.originalTopLeft = { x: vertices[0].x, y: vertices[0].y };
    this.originalCenter = { x: (vertices[0].x + vertices[1].x) / 2, y: (vertices[0].y + vertices[1].y) / 2 };

    this.hasBeenManipulated = false;
    this.needWhiteEllipsePostDrawing = true;
  }

  drawRegion(sourceCanvas: HTMLCanvasElement) { //will be abstract drawRegion
    this.selectionCtx.save();
    this.selectionCtx.beginPath();
    this.selectionCtx.ellipse(this.selectionCanvas.width / 2, this.selectionCanvas.height / 2, this.originalRadii.x, this.originalRadii.y, 0, 0, this.CIRCLE_MAX_ANGLE);
    this.selectionCtx.clip();
    this.selectionCtx.imageSmoothingEnabled = false;
    this.selectionCtx.drawImage(sourceCanvas, this.topLeft.x - this.originalTopLeft.x, this.topLeft.y - this.originalTopLeft.y);
    this.selectionCtx.closePath();
    this.selectionCtx.restore();
  }

  drawPostSelectionRegion() {
    this.selectionService.drawPostSelectionEllipse(this.originalCenter, this.originalRadii);
  }
}
