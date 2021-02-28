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

  initAllProperties(vertices: Vec2[]): void {
    this.originalWidth = vertices[1].x - vertices[0].x;
    this.originalHeight = vertices[1].y - vertices[0].y
    this.fixedTopLeft.x = this.selectionCanvas.width / 2 - this.originalWidth/2;
    this.fixedTopLeft.y = this.selectionCanvas.height / 2 - this.originalHeight/2;
    this.offset = { x: 0, y: 0 };

    this.originalTopLeftOnBaseCanvas = { x: vertices[0].x, y: vertices[0].y };

    this.hasBeenManipulated = false;
    this.needWhiteEllipsePostDrawing = true;
  }

  extractSelectionFromSource(sourceCanvas: HTMLCanvasElement) { 
    this.selectionCtx.save();
    this.selectionCtx.beginPath();
    this.selectionCtx.rect(this.fixedTopLeft.x, this.fixedTopLeft.y, this.originalWidth, this.originalHeight);
    this.selectionCtx.clip();
    this.selectionCtx.imageSmoothingEnabled = false;
    this.selectionCtx.drawImage(sourceCanvas, this.fixedTopLeft.x - this.originalTopLeftOnBaseCanvas.x, this.fixedTopLeft.y - this.originalTopLeftOnBaseCanvas.y);
    this.selectionCtx.closePath();
    this.selectionCtx.restore();
  }

  drawWhitePostSelection() {
    this.selectionService.drawPostSelectionRectangle(this.originalTopLeftOnBaseCanvas, this.originalWidth, this.originalHeight);
  }
}
