import { Vec2 } from './vec2';

export class HandlerMemento {
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