import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '../drawing/drawing.service';
import { MouseButton } from './pencil-service';

@Injectable({
  providedIn: 'root'
})
export class EllipseService extends Tool {

  private startPoint: Vec2;

  constructor(drawingService: DrawingService) {
      super(drawingService);
  }

  onMouseDown(event: MouseEvent): void {
      this.mouseDown = event.button === MouseButton.Left;
      if (this.mouseDown) {
          this.mouseDownCoord = this.getPositionFromMouse(event);
          this.startPoint = this.mouseDownCoord;
      }
  }

  onMouseUp(event: MouseEvent): void {
      if (this.mouseDown) {
          const mousePosition = this.getPositionFromMouse(event);
          this.drawEllipse(this.drawingService.baseCtx, this.startPoint, mousePosition);
      }
      this.mouseDown = false;
  }

  onMouseMove(event: MouseEvent): void {
      if (this.mouseDown) {
          const mousePosition = this.getPositionFromMouse(event);
          
          this.drawingService.clearCanvas(this.drawingService.previewCtx);
          this.drawEllipse(this.drawingService.previewCtx, this.startPoint, mousePosition);
      }
  }

  private drawEllipse(ctx: CanvasRenderingContext2D, startPoint: Vec2, endPoint: Vec2): void {
      let center: Vec2 = {
        x: (startPoint.x + endPoint.x) / 2,
        y: (startPoint.y + endPoint.y) / 2
      };

      let radii: Vec2 = {
        x: Math.abs(endPoint.x - startPoint.x) / 2,
        y: Math.abs(endPoint.y - startPoint.y) / 2
      };

      ctx.beginPath();
      ctx.ellipse(center.x, center.y, radii.x, radii.y, 0, 0, 360);
      ctx.stroke();
  }
  
}
