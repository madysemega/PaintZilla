import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';


@Injectable({
  providedIn: 'root'
})
export class EllipseSelectionHandlerService {
  private readonly CIRCLE_MAX_ANGLE: number = 360;

  /* public targetTopLeft : Vec2 = {x:0, y:0};
   public targetBottomRight : Vec2 = {x:0, y:0};
   public sourceTopLeft : Vec2 = {x:0, y:0};
   public sourceBottomRight : Vec2 = {x:0, y:0}
   public center: Vec2={x:0, y:0};
   public radii: Vec2={x:0, y:0};
   public isFillWhiteBehindSelection: boolean;*/

  public selectionCanvas: HTMLCanvasElement;
  public modificationCanvas: HTMLCanvasElement;

  public selectionCtx: CanvasRenderingContext2D;
  public modificationCtx: CanvasRenderingContext2D;

  public topLeft: Vec2 ={x: 0, y: 0};
  public offset: Vec2 ={x: 0, y: 0};
  public originalWidth : number;
  public originalHeight: number;

  constructor(private drawingService: DrawingService) {
    this.selectionCanvas = document.createElement('canvas');
    //this.selectionCanvas.width = 1000;
    //this.selectionCanvas.height = 1000;
    this.selectionCtx = this.selectionCanvas.getContext('2d') as CanvasRenderingContext2D

    this.modificationCanvas = document.createElement('canvas');
    //this.modificationCanvas.width = 1000;
    //this.modificationCanvas.height = 1000;
    this.modificationCtx = this.modificationCanvas.getContext('2d') as CanvasRenderingContext2D
   }

  selectArea(selectionStartPoint: Vec2, radii: Vec2): void {
    this.selectionCtx.save();
    this.selectionCtx.beginPath();
    this.selectionCtx.ellipse(this.selectionCanvas.width / 2, this.selectionCanvas.height / 2, radii.x, radii.y, 0, 0, this.CIRCLE_MAX_ANGLE);
    this.selectionCtx.clip();
    this.selectionCtx.drawImage(this.drawingService.canvas, this.selectionCanvas.width/2-radii.x- selectionStartPoint.x , this.selectionCanvas.height/2-radii.y- selectionStartPoint.y);
    this.selectionCtx.closePath();
    this.selectionCtx.restore();

    this.modificationCtx.beginPath();
    this.modificationCtx.drawImage(this.selectionCanvas, 0,0);
    this.modificationCtx.closePath();

    this.topLeft.x = this.selectionCanvas.width / 2 -radii.x;
    this.topLeft.y = this.selectionCanvas.height / 2 -radii.y;
    this.originalWidth = radii.x*2;
    this.originalHeight = radii.y*2;
    this.offset = {x:0 ,y:0};
  }

  drawSelection(position : Vec2, ctx : CanvasRenderingContext2D): void{
    ctx.beginPath();
    ctx.drawImage(this.selectionCanvas, position.x-this.topLeft.x+this.offset.x, position.y-this.topLeft.y+this.offset.y);
    //ctx.drawImage(this.selectionCanvas, position.x-this.topLeft.x, position.y-this.topLeft.y);
    ctx.closePath();
  }

  resizeSelectionHorizontally(topLeft : Vec2, topRight: Vec2, isTowardsRight: boolean): void{
    let newWidth = Math.abs(topRight.x - topLeft.x);
    let increaseRatio = newWidth/this.originalWidth;

    this.drawingService.clearCanvas(this.selectionCtx);
    this.selectionCtx.beginPath();
    this.selectionCtx.translate(this.selectionCanvas.width/2, this.selectionCanvas.height/2);
    this.selectionCtx.transform(increaseRatio,0,0,1,0,0);
    this.selectionCtx.translate(-this.selectionCanvas.width/2, -this.selectionCanvas.height/2);
    this.selectionCtx.drawImage(this.modificationCanvas, 0,0);
    this.selectionCtx.closePath();
    this.selectionCtx.resetTransform();

    if(isTowardsRight){
      this.offset.x = (newWidth-this.originalWidth)/2;
    }
    else{
      this.offset.x = (newWidth-this.originalWidth)/2
    }
  }
}
