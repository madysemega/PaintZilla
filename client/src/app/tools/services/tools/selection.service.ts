import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ColourToolService } from './colour-tool.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {
  private readonly CIRCLE_MAX_ANGLE: number = 360;
  public isShiftDown: boolean;
  public isSelectionBeingMoved: boolean;
  constructor(private drawingService : DrawingService, private colourService: ColourToolService) { }

  getSquareAjustedPerimeter(startPoint: Vec2, endPoint: Vec2): Vec2 {
    const endPointWithRespectToStartPoint: Vec2 = {
      x: endPoint.x - startPoint.x,
      y: endPoint.y - startPoint.y,
    };

    const endPointShortestComponent = Math.min(Math.abs(endPointWithRespectToStartPoint.x), Math.abs(endPointWithRespectToStartPoint.y));

    const isXComponentPositive: boolean = startPoint.x < endPoint.x;
    const isYComponentPositive: boolean = startPoint.y < endPoint.y;

    return {
      x: startPoint.x + (isXComponentPositive ? endPointShortestComponent : -endPointShortestComponent),
      y: startPoint.y + (isYComponentPositive ? endPointShortestComponent : -endPointShortestComponent),
    };
  }

  drawPerimeter(ctx: CanvasRenderingContext2D, startPoint: Vec2, endPoint: Vec2): void {
    const DASH_NUMBER = 8;

    if (this.isShiftDown) {
        endPoint = this.getSquareAjustedPerimeter(startPoint, endPoint);
    }

    const topLeft: Vec2 = {
        x: Math.min(startPoint.x, endPoint.x),
        y: Math.min(startPoint.y, endPoint.y),
    };

    const dimensions: Vec2 = {
        x: Math.abs(endPoint.x - startPoint.x),
        y: Math.abs(endPoint.y - startPoint.y),
    };

    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([DASH_NUMBER]);
    ctx.strokeStyle = '#888';
    ctx.rect(topLeft.x, topLeft.y, dimensions.x, dimensions.y);
    ctx.stroke();
    ctx.restore();
}

getEllipseParam(startPoint: Vec2, endPoint: Vec2, center: Vec2, radii: Vec2): void {
    center.x = (startPoint.x + endPoint.x) / 2;
    center.y = (startPoint.y + endPoint.y) / 2;
    radii.x=Math.abs(endPoint.x - startPoint.x) / 2;
    radii.y= Math.abs(endPoint.y - startPoint.y) / 2;
  }

drawSelectionEllipse(center: Vec2, radii: Vec2): void{
    let ctx : CanvasRenderingContext2D = this.drawingService.previewCtx;
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = this.colourService.secondaryColour;
    ctx.ellipse(center.x, center.y, radii.x, radii.y, 0, 0, this.CIRCLE_MAX_ANGLE);
    ctx.stroke();
    ctx.restore();
}

drawPostSelectionEllipse(center: Vec2, radii: Vec2){
    let ctx : CanvasRenderingContext2D = this.drawingService.baseCtx;
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = this.colourService.secondaryColour;
    ctx.ellipse(center.x, center.y, radii.x, radii.y, 0, 0, this.CIRCLE_MAX_ANGLE);
    ctx.clip();
    ctx.fillStyle="white";
    ctx.fill();
    ctx.restore();
}
}

