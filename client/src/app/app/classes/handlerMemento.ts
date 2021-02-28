import { Vec2 } from './vec2';

export class HandlerMemento {

  constructor(width: number, height: number){
    this.selectionCanvas = document.createElement('canvas');
    this.selectionCtx = this.selectionCanvas.getContext('2d') as CanvasRenderingContext2D;
    this.originalCanvasCopy = document.createElement('canvas');
    this.originalCanvasCopyCtx = this.originalCanvasCopy.getContext('2d') as CanvasRenderingContext2D;
    this.horizontalModificationCanvas = document.createElement('canvas');
    this.horizontalModificationCtx = this.horizontalModificationCanvas.getContext('2d') as CanvasRenderingContext2D;
    this.verticalModificationCanvas = document.createElement('canvas');
    this.verticalModificationCtx = this.verticalModificationCanvas.getContext('2d') as CanvasRenderingContext2D;

    this.selectionCanvas.width = width;
    this.selectionCanvas.height = height;
    this.originalCanvasCopy.width = width;
    this.originalCanvasCopy.height = height;
    this.horizontalModificationCanvas.width = width;
    this.horizontalModificationCanvas.height = height;
    this.verticalModificationCanvas.width = width;
    this.verticalModificationCanvas.height = height; 
  }
  
  public selectionCanvas: HTMLCanvasElement;
  public horizontalModificationCanvas: HTMLCanvasElement;
  public verticalModificationCanvas: HTMLCanvasElement;
  public originalCanvasCopy: HTMLCanvasElement;
  public selectionCtx: CanvasRenderingContext2D;
  public horizontalModificationCtx: CanvasRenderingContext2D;
  public verticalModificationCtx: CanvasRenderingContext2D;
  public originalCanvasCopyCtx: CanvasRenderingContext2D;
  
  public fixedTopLeft: Vec2 = { x: 0, y: 0 };
  public offset: Vec2 = { x: 0, y: 0 };
  public originalWidth: number;
  public originalHeight: number;
  public hasBeenManipulated: boolean;
  public needWhiteEllipsePostDrawing: boolean;
  public originalTopLeftOnBaseCanvas: Vec2;
  public originalCenter: Vec2;
  public originalVertices: Vec2[];
}