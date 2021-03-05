import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { EllipseSelectionHelperService } from '@app/tools/services/selection/ellipse/ellipse-selection-helper.service';
import { EllipseSelectionManipulatorService } from '@app/tools/services/selection/ellipse/ellipse-selection-manipulator.service';
import { SelectionCreatorService } from '@app/tools/services/selection/selection-base/selection-creator.service';

@Injectable({
    providedIn: 'root',
})
export class EllipseSelectionCreatorService extends SelectionCreatorService {
    constructor(
        drawingService: DrawingService,
        selectionManipulatorService: EllipseSelectionManipulatorService,
        public selectionService: EllipseSelectionHelperService,
    ) {
        super(drawingService, selectionManipulatorService, selectionService);
        this.key = 'ellipse-selection';
    }

    drawSelectionOutline(endPoint: Vec2): void {
        const center: Vec2 = { x: 0, y: 0 };
        const radii = { x: 0, y: 0 };
        if (this.isShiftDown) {
            endPoint = this.selectionService.getSquareAdjustedPerimeter(this.startPoint, endPoint);
        }
        this.selectionService.getEllipseParam(this.startPoint, endPoint, center, radii);
        this.selectionService.drawSelectionEllipse(center, radii);
        this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.startPoint, endPoint);
    }
}
