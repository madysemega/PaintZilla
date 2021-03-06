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
export class EllipseSelectionHelperService extends SelectionHelperService {
    private readonly CIRCLE_MAX_ANGLE: number = 360;

    constructor(public drawingService: DrawingService, colourService: ColourService, ellipseService: EllipseService, mathsHelper: MathsHelper) {
        super(drawingService, colourService, ellipseService, mathsHelper);
    }

    getEllipseParam(startPoint: Vec2, endPoint: Vec2, center: Vec2, radii: Vec2): void {
        this.mathsHelper.computeCenterInPlace(center, startPoint, endPoint);
        radii.x = Math.abs(endPoint.x - startPoint.x) / 2;
        radii.y = Math.abs(endPoint.y - startPoint.y) / 2;
    }

    drawSelectionEllipse(center: Vec2, radii: Vec2): void {
        const ctx: CanvasRenderingContext2D = this.drawingService.previewCtx;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = '#888';
        ctx.ellipse(center.x, center.y, radii.x, radii.y, 0, 0, this.CIRCLE_MAX_ANGLE);
        ctx.stroke();
        ctx.restore();
    }

    whiteEllipseFill(center: Vec2, radii: Vec2): void {
        const ctx: CanvasRenderingContext2D = this.drawingService.baseCtx;
        const radiiCopy = { x: radii.x, y: radii.y };
        ctx.save();
        ctx.beginPath();
        radiiCopy.x -= radiiCopy.x >= 1 ? 1 : 0;
        radiiCopy.y -= radiiCopy.y >= 1 ? 1 : 0;
        ctx.ellipse(center.x, center.y, radiiCopy.x, radiiCopy.y, 0, 0, this.CIRCLE_MAX_ANGLE);
        ctx.clip();
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    whiteFill(vertices: Vec2[]): void {
        const topLeft: Vec2 = vertices[0];
        const bottomRight: Vec2 = vertices[1];

        const center: Vec2 = { x: 0, y: 0 };
        const radii: Vec2 = { x: 0, y: 0 };

        this.getEllipseParam(topLeft, bottomRight, center, radii);
        this.whiteEllipseFill(center, radii);
    }
}
