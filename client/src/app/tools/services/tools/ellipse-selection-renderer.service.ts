import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';

@Injectable({
  providedIn: 'root'
})
export class EllipseSelectionRendererService {
  private readonly CIRCLE_MAX_ANGLE: number = 360;

  public targetTopLeft : Vec2 = {x:0, y:0};
  public targetBottomRight : Vec2 = {x:0, y:0};

  public sourceTopLeft : Vec2 = {x:0, y:0};
  public sourceBottomRight : Vec2 = {x:0, y:0}

  public center: Vec2={x:0, y:0};
  public radii: Vec2={x:0, y:0};
  
  public isFillWhiteBehindSelection: boolean;
  public selectionCanvas : HTMLCanvasElement;

  public ctx : CanvasRenderingContext2D;

  constructor(private drawingService: DrawingService) { }

  render():void{
    if(this.isFillWhiteBehindSelection){
      this.fillWhiteBehindSelection();
    }
    this.pasteSelectionOnBaseCanvas();
  }

  pasteSelectionOnBaseCanvas():void{
      this.ctx.drawImage(
      this.selectionCanvas, this.sourceTopLeft.x, this.sourceTopLeft.y,
      this.selectionCanvas.width, this.selectionCanvas.height,
      this.targetTopLeft.x, this.targetTopLeft.y,
      this.selectionCanvas.width, this.selectionCanvas.height);
  }

  fillWhiteBehindSelection(){
    let ctx : CanvasRenderingContext2D = this.drawingService.baseCtx;
    ctx.save();
    ctx.beginPath();
    
    this.radii.x = this.radii.x>=1?  this.radii.x-1: 0;
    this.radii.y = this.radii.y>=1? this.radii.y-1: 0;
    ctx.ellipse(this.center.x, this.center.y, this.radii.x, this.radii.y, 0, 0, this.CIRCLE_MAX_ANGLE);
    ctx.clip();
    ctx.fillStyle="white";
    ctx.fill();
    ctx.restore();
}
}
