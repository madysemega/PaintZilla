import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { SelectionManipulatorService } from '@app/tools/services/selection/selection-base/selection-manipulator.service';
import * as Constants from '@app/tools/services/tools/lasso-selection-creator/lasso-selection-creator.constants';
import { LassoSelectionHandlerService } from './lasso-selection-handler.service';
import { LassoSelectionHelperService } from './lasso-selection-helper.service';

@Injectable({
    providedIn: 'root',
})
export class LassoSelectionManipulatorService extends SelectionManipulatorService {
    constructor(
        drawingService: DrawingService,
        protected selectionHelper: LassoSelectionHelperService,
        selectionHandler: LassoSelectionHandlerService,
        historyService: HistoryService,
    ) {
        super(drawingService, selectionHelper, selectionHandler, historyService);
    }

    translateToGetOriginAtCenter(vertex: Vec2): Vec2 {
        return {
            x: vertex.x - (this.selectionHandler.originalTopLeftOnBaseCanvas.x + this.selectionHandler.originalWidth),
            y: vertex.y - (this.selectionHandler.originalTopLeftOnBaseCanvas.y + this.selectionHandler.originalHeight),
        };
    }

    translateToFinalPosition(vertex: Vec2): Vec2 {
        return {
            x: vertex.x + this.selectionHandler.originalWidth * this.selectionHandler.currentHorizontalScaling + this.topLeft.x,
            y: vertex.y + this.selectionHandler.originalHeight * this.selectionHandler.currentVerticalScaling + this.topLeft.y,
        };
    }

    scale(vertex: Vec2, factor: Vec2): Vec2 {
        return {
            x: vertex.x * factor.x,
            y: vertex.y * factor.y,
        };
    }

    drawSelectionOutline(): void {
        const translatedVertices = (this.selectionHandler as LassoSelectionHandlerService).initialVertices;
        const ctx = this.drawingService.previewCtx;
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.setLineDash([Constants.DASH_SIZE]);
        ctx.beginPath();
        translatedVertices.forEach((vertex) => {
            const scale = {
                x: this.selectionHandler.currentHorizontalScaling,
                y: this.selectionHandler.currentVerticalScaling,
            };
            const originAtCenter = this.translateToGetOriginAtCenter(vertex);
            const scaled = this.scale(originAtCenter, scale);
            const finalPosition = this.translateToFinalPosition(scaled);

            ctx.lineTo(finalPosition.x, finalPosition.y);
        });
        ctx.stroke();
        ctx.restore();
        this.selectionHelper.drawPerimeter(this.drawingService.previewCtx, this.topLeft, this.bottomRight);
    }
}
