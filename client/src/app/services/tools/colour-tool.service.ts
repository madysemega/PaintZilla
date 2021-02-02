import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColourToolService {
  
  public mousedown: boolean = false;
  private selectedHeight: number;
 
  colour: EventEmitter<string> = new EventEmitter();
  draw(width: number, height:number, ctx: CanvasRenderingContext2D) {
    
    ctx.clearRect(0, 0, width, height);
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
    gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
    if (this.selectedHeight) { 
      ctx.beginPath();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 5;
      ctx.rect(0, this.selectedHeight - 5, width, 10);
      ctx.stroke();
      ctx.closePath();
    }
  }
  

  onMouseDown(evt: MouseEvent, height: number, width: number, ctx: CanvasRenderingContext2D) {

    this.mousedown = true;
    this.selectedHeight = evt.offsetY;
    this.draw(height, width, ctx);
    this.emitColor(evt.offsetX, evt.offsetY, ctx);
  }

  onMouseMove(evt: MouseEvent, height: number, width: number, ctx: CanvasRenderingContext2D) {
    if (this.mousedown) {
      this.selectedHeight = evt.offsetY
      this.draw(height, width, ctx);
      this.emitColor(evt.offsetX, evt.offsetY, ctx)
    }
  }

  emitColor(x: number, y: number, ctx: CanvasRenderingContext2D) {
    const rgbaColor = this.getColorAtPosition(x, y, ctx);
    this.colour.emit(rgbaColor)
  }

  getColorAtPosition(x: number, y: number, ctx: CanvasRenderingContext2D) {
    const imageData = ctx.getImageData(x, y, 1, 1).data;
    return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
  }

  constructor() { }
}
