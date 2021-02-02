import { ElementRef, EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaletteToolService {

  
  canvas: ElementRef<HTMLCanvasElement>;
  public mousedown: boolean = false;
  public selectedPosition: { x: number; y: number };
  public colour: EventEmitter<string>;
  public hue: string;

  draw(width: number, height: number, ctx: CanvasRenderingContext2D) {
    

    ctx.fillStyle = this.hue || 'rgba(255,255,255,1)';
    ctx.fillRect(0, 0, width, height);

    const whiteGrad = ctx.createLinearGradient(0, 0, width, 0);
    whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
    whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.fillStyle = whiteGrad;
    ctx.fillRect(0, 0, width, height);

    const blackGrad = ctx.createLinearGradient(0, 0, 0, height);
    blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
    blackGrad.addColorStop(1, 'rgba(0,0,0,1)');

    ctx.fillStyle = blackGrad;
    ctx.fillRect(0, 0, width, height);

    if (this.selectedPosition) {
      ctx.strokeStyle = 'white';
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(
        this.selectedPosition.x,
        this.selectedPosition.y,
        10,
        0,
        2 * Math.PI
      );
      ctx.lineWidth = 5;
      ctx.stroke();
    }
  }
  
  onMouseUp(evt: MouseEvent) {
    this.mousedown = false;
  }

  emitColour(x: number, y: number, ctx: CanvasRenderingContext2D) {
    const rgbaColor = this.getColourAtPosition(x, y, ctx)
    this.colour.emit(rgbaColor)
  }

  getColourAtPosition(x: number, y: number, ctx: CanvasRenderingContext2D) {
    const imageData = ctx.getImageData(x, y, 1, 1).data
    return (
      'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)'
    )
  }

  constructor() { }
}
