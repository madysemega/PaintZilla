import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { SelectionManipulatorService } from '@app/tools/services/selection/selection-base/selection-manipulator.service';
import { EllipseSelectionHandlerService } from './ellipse-selection-handler-service';
import { EllipseSelectionHelperService } from './ellipse-selection-helper.service';

@Injectable({
    providedIn: 'root',
})
export class EllipseSelectionManipulatorService extends SelectionManipulatorService {
    constructor(
        drawingService: DrawingService,
        protected selectionHelper: EllipseSelectionHelperService,
        selectionHandler: EllipseSelectionHandlerService,
        historyService: HistoryService,
    ) {
        super(drawingService, selectionHelper, selectionHandler, historyService);
    }

    drawSelectionOutline(): void {
        const center: Vec2 = { x: 0, y: 0 };
        const radii = { x: 0, y: 0 };

        this.selectionHelper.getEllipseParam(this.topLeft, this.bottomRight, center, radii);
        this.selectionHelper.drawSelectionEllipse(center, radii);
        this.selectionHelper.drawPerimeter(this.drawingService.previewCtx, this.topLeft, this.bottomRight);
    }
}
