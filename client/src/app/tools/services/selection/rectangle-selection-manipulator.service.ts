import { Injectable } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { RectangleSelectionHandlerService } from './rectangle-selection-handler.service';
import { RectangleSelectionHelperService } from './rectangle-selection-helper.service';
import { SelectionManipulatorService } from './selection-manipulator.service';

@Injectable({
  providedIn: 'root'
})
export class RectangleSelectionManipulatorService extends SelectionManipulatorService{

  constructor(drawingService: DrawingService, protected selectionService: RectangleSelectionHelperService, selectionHandler: RectangleSelectionHandlerService) { 
    super(drawingService, selectionService, selectionHandler);
  }

  drawSelectionOutline(): void {
    this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.topLeft, this.bottomRight, this.isShiftDown);
}
}