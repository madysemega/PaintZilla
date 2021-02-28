import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ColourToolService } from '../../tools/colour-tool.service';
import { SelectionService } from '../selection-base/selection.service';

@Injectable({
  providedIn: 'root'
})
export class RectangleSelectionHelperService extends SelectionService {
  
  constructor( drawingService : DrawingService,  colourService: ColourToolService) { 
    super(drawingService, colourService);
  }

  drawPostSelectionRectangle(topLeft: Vec2, originalWidth: number, originalHeight: number): void{
    let ctx : CanvasRenderingContext2D = this.drawingService.baseCtx;
    ctx.save();
    ctx.beginPath();
    ctx.rect(topLeft.x, topLeft.y, originalWidth, originalHeight);
    ctx.clip();
    ctx.fillStyle="white";
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}
