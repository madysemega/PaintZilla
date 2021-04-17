import { Vec2 } from './vec2';

export class HandlerMemento {

    selection: HTMLCanvasElement = document.createElement('canvas');
    originalSelection: HTMLCanvasElement  = document.createElement('canvas');
    selectionCtx: CanvasRenderingContext2D = this.selection.getContext('2d') as CanvasRenderingContext2D;
    originalSelectionCtx: CanvasRenderingContext2D = this.originalSelection.getContext('2d') as CanvasRenderingContext2D;

    topLeftRelativeToMiddle: Vec2 = { x: 0, y: 0 };
    offset: Vec2 = { x: 0, y: 0 };
    originalWidth: number =0;
    originalHeight: number =0;
    hasBeenManipulated: boolean = false;
    needWhitePostDrawing: boolean = false;
    originalTopLeftOnBaseCanvas: Vec2 = { x: 0, y: 0 };
    originalCenter: Vec2 = { x: 0, y: 0 };
    originalVertices: Vec2[] = [];
    currentHorizontalScaling: number =1;
    currentVerticalScaling: number =1;

    constructor(width: number, height: number) {
        this.selection.width = width;
        this.selection.height = height;
        this.originalSelection.width = width;
        this.originalSelection.height = height;
    }
}
