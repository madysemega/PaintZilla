import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { SelectionHandlerService } from '../selection-base/selection-handler.service';
import { EllipseSelectionHelperService } from './ellipse-selection-helper.service';

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

  constructor(drawingService: DrawingService, protected selectionService: EllipseSelectionHelperService) {
    super(drawingService, selectionService);
  }

  extractSelectionFromSource(sourceCanvas: HTMLCanvasElement): void {
    let originalRadii: Vec2 = {x: this.originalWidth/2, y: this.originalHeight/2};
    this.selectionCtx.save();
    this.selectionCtx.beginPath();
    this.selectionCtx.ellipse(this.selectionCanvas.width / 2, this.selectionCanvas.height / 2, originalRadii.x, originalRadii.y, 0, 0, this.CIRCLE_MAX_ANGLE);
    this.selectionCtx.clip();
    this.selectionCtx.imageSmoothingEnabled = false;
    this.selectionCtx.drawImage(sourceCanvas, this.fixedTopLeft.x - this.originalTopLeftOnBaseCanvas.x, this.fixedTopLeft.y - this.originalTopLeftOnBaseCanvas.y);
    this.selectionCtx.closePath();
    this.selectionCtx.restore();
  }

 drawWhitePostSelection(): void {
    let originalRadii: Vec2 = {x: this.originalWidth/2, y: this.originalHeight/2};
    this.selectionService.drawPostSelectionEllipse(this.originalCenter, originalRadii);
  }
}
