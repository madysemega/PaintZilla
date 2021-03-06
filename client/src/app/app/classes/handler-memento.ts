import { Vec2 } from './vec2';

export class HandlerMemento {
    constructor(width: number, height: number) {
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

    selectionCanvas: HTMLCanvasElement;
    horizontalModificationCanvas: HTMLCanvasElement;
    verticalModificationCanvas: HTMLCanvasElement;
    originalCanvasCopy: HTMLCanvasElement;
    selectionCtx: CanvasRenderingContext2D;
    horizontalModificationCtx: CanvasRenderingContext2D;
    verticalModificationCtx: CanvasRenderingContext2D;
    originalCanvasCopyCtx: CanvasRenderingContext2D;

    fixedTopLeft: Vec2 = { x: 0, y: 0 };
    offset: Vec2 = { x: 0, y: 0 };
    originalWidth: number;
    originalHeight: number;
    hasBeenManipulated: boolean;
    needWhiteEllipsePostDrawing: boolean;
    originalTopLeftOnBaseCanvas: Vec2 = { x: 0, y: 0 };
    originalCenter: Vec2 = { x: 0, y: 0 };
    originalVertices: Vec2[] = [];
}
