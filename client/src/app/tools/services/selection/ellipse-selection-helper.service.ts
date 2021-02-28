import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ColourToolService } from '../tools/colour-tool.service';
import { SelectionService } from './selection.service';

@Injectable({
  providedIn: 'root'
})
export class EllipseSelectionHelperService extends SelectionService {
  private readonly CIRCLE_MAX_ANGLE: number = 360;
  
  constructor( drawingService : DrawingService,  colourService: ColourToolService) { 
    super(drawingService, colourService);
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
    let radiiCopy = {x:radii.x, y:radii.y};
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = this.colourService.secondaryColour;
    radiiCopy.x += radiiCopy.x>=1 ? -1: 0;
    radiiCopy.y += radiiCopy.y>=1 ? -1: 0;
    ctx.ellipse(center.x, center.y, radiiCopy.x, radiiCopy.y, 0, 0, this.CIRCLE_MAX_ANGLE);
    ctx.clip();
    ctx.fillStyle="white";
    ctx.fill();
    ctx.restore();
}

}
