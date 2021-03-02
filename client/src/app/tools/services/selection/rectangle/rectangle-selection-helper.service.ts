import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { SelectionService } from '@app/tools/services/selection/selection-base/selection.service';
import { ColourToolService } from '@app/tools/services/tools/colour-tool.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleSelectionHelperService extends SelectionService {
    constructor(drawingService: DrawingService, colourService: ColourToolService) {
        super(drawingService, colourService);
    }

    drawPostSelectionRectangle(topLeft: Vec2, originalWidth: number, originalHeight: number): void {
        const ctx: CanvasRenderingContext2D = this.drawingService.baseCtx;
        ctx.save();
        ctx.beginPath();
        ctx.rect(topLeft.x, topLeft.y, originalWidth, originalHeight);
        ctx.clip();
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}
