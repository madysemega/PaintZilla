import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { EllipseSelectionHandlerService } from './ellipse-selection-handler-service';
import { SelectionManipulatorService } from './selection-manipulator.service';
import { SelectionService } from './selection.service';

@Injectable({
  providedIn: 'root'
})
export class EllipseSelectionManipulatorService extends SelectionManipulatorService{

  constructor(drawingService: DrawingService, selectionService: SelectionService, selectionHandler: EllipseSelectionHandlerService) { 
    super(drawingService, selectionService, selectionHandler);
  }

  drawSelectionOutline(): void {
    let center: Vec2 = { x: 0, y: 0 }, radii = { x: 0, y: 0 };

    this.selectionService.getEllipseParam(this.topLeft, this.bottomRight, center, radii);
    this.selectionService.drawSelectionEllipse(center, radii);
    this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.topLeft, this.bottomRight, this.isShiftDown);
}
}
