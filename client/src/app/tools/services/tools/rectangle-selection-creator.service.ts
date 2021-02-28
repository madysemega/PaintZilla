import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { RectangleSelectionHelperService } from '@app/tools/services/selection/rectangle-selection-helper.service';
import { SelectionCreatorService } from '@app/tools/services/selection/selection-creator.service'
import { Vec2 } from '@app/app/classes/vec2';
import { Injectable } from '@angular/core';
import { RectangleSelectionManipulatorService } from '../selection/rectangle-selection-manipulator.service';
import { RectangleSelectionHandlerService } from '../selection/rectangle-selection-handler.service';

@Injectable({
  providedIn: 'root'
})
export class RectangleSelectionCreatorService extends SelectionCreatorService {

  constructor(drawingService: DrawingService, selectionManipulatorService: RectangleSelectionManipulatorService, selectionHandler: RectangleSelectionHandlerService, protected selectionService: RectangleSelectionHelperService) {
    super(drawingService, selectionManipulatorService, selectionHandler, selectionService);
    this.key = 'rectangle-selection';
  }

  drawSelectionOutline(endPoint: Vec2): void {
    if (this.isShiftDown) {
      endPoint = this.selectionService.getSquareAjustedPerimeter(this.startPoint, endPoint);
    }
    this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.startPoint, endPoint, this.isShiftDown);
  }
}



