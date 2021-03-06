import { Injectable } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { SelectionManipulatorService } from '@app/tools/services/selection/selection-base/selection-manipulator.service';
import { RectangleSelectionHandlerService } from './rectangle-selection-handler.service';
import { RectangleSelectionHelperService } from './rectangle-selection-helper.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleSelectionManipulatorService extends SelectionManipulatorService {
    constructor(
        drawingService: DrawingService,
        protected selectionHelper: RectangleSelectionHelperService,
        selectionHandler: RectangleSelectionHandlerService,
        historyService: HistoryService,
    ) {
        super(drawingService, selectionHelper, selectionHandler, historyService);
    }

    drawSelectionOutline(): void {
        this.selectionHelper.drawPerimeter(this.drawingService.previewCtx, this.topLeft, this.bottomRight);
    }
}
