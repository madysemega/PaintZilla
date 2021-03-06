import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ClipboardService } from '@app/tools/services/selection/clipboard/clipboard.service';
import { EllipseSelectionHelperService } from '@app/tools/services/selection/ellipse/ellipse-selection-helper.service';
import { EllipseSelectionManipulatorService } from '@app/tools/services/selection/ellipse/ellipse-selection-manipulator.service';
import { SelectionCreatorService } from '@app/tools/services/selection/selection-base/selection-creator.service';

@Injectable({
    providedIn: 'root',
})
export class EllipseSelectionCreatorService extends SelectionCreatorService {
    constructor(
        drawingService: DrawingService,
        selectionManipulator: EllipseSelectionManipulatorService,
        public selectionHelper: EllipseSelectionHelperService,
        clipboardService: ClipboardService,
    ) {
        super(drawingService, selectionManipulator, selectionHelper, clipboardService);
        this.key = 'ellipse-selection';
    }

    drawSelectionOutline(endPoint: Vec2): void {
        const center: Vec2 = { x: 0, y: 0 };
        const radii = { x: 0, y: 0 };
        if (this.isShiftDown) {
            endPoint = this.selectionHelper.getSquareAdjustedPerimeter(this.startPoint, endPoint);
        }
        this.selectionHelper.getEllipseParam(this.startPoint, endPoint, center, radii);
        this.selectionHelper.drawSelectionEllipse(center, radii);
    }
}
