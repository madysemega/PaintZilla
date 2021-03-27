import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ClipboardService } from '@app/tools/services/selection/clipboard/clipboard.service';
import { RectangleSelectionHelperService } from '@app/tools/services/selection/rectangle/rectangle-selection-helper.service';
import { RectangleSelectionManipulatorService } from '@app/tools/services/selection/rectangle/rectangle-selection-manipulator.service';
import { SelectionCreatorService } from '@app/tools/services/selection/selection-base/selection-creator.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleSelectionCreatorService extends SelectionCreatorService {
    constructor(
        public drawingService: DrawingService,
        selectionManipulator: RectangleSelectionManipulatorService,
        public selectionHelper: RectangleSelectionHelperService,
        clipboardService: ClipboardService,
    ) {
        super(drawingService, selectionManipulator, selectionHelper, clipboardService);
        this.key = 'rectangle-selection';
    }

    drawSelectionOutline(endPoint: Vec2): void {
        if (this.isShiftDown) {
            endPoint = this.selectionHelper.getSquareAdjustedPerimeter(this.startPoint, endPoint);
        }
        this.selectionHelper.drawPerimeter(this.drawingService.previewCtx, this.startPoint, endPoint);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.ctrlKey && event.key === 'a') {
            this.selectEntireCanvas();
            return;
        }
        super.onKeyDown(event);
    }

    selectEntireCanvas(): void {
        this.selectionManipulator.historyService.isLocked = true;
        this.createSelection({ x: 0, y: 0 }, { x: this.drawingService.canvasSize.x, y: this.drawingService.canvasSize.y });
    }
}
