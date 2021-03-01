import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { RectangleSelectionHelperService } from '@app/tools/services/selection/rectangle/rectangle-selection-helper.service';
import { SelectionCreatorService } from '@app/tools/services/selection/selection-base/selection-creator.service'
import { Vec2 } from '@app/app/classes/vec2';
import { Injectable } from '@angular/core';
import { RectangleSelectionManipulatorService } from '../selection/rectangle/rectangle-selection-manipulator.service';
import { RectangleSelectionHandlerService } from '../selection/rectangle/rectangle-selection-handler.service';

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

  onKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key==='a') {
      this.createSelection({x:0, y:0}, {x: this.drawingService.canvasSize.x, y: this.drawingService.canvasSize.y});
      return;
    }
    super.onKeyDown(event);
}
}



