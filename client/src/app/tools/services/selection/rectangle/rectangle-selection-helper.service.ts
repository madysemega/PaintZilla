import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MathsHelper } from '@app/shapes/helper/maths-helper.service';
import { SelectionHelperService } from '@app/tools/services/selection/selection-base/selection-helper.service';
import { EllipseService } from '@app/tools/services/tools/ellipse-service';

@Injectable({
    providedIn: 'root',
})
export class RectangleSelectionHelperService extends SelectionHelperService {
    constructor(drawingService: DrawingService, colourService: ColourService, ellipseService: EllipseService, mathsHelper: MathsHelper) {
        super(drawingService, colourService, ellipseService, mathsHelper);
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
