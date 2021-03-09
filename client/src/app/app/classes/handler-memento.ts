import { Vec2 } from './vec2';

export class HandlerMemento {
    constructor(width: number, height: number) {
        this.selection = document.createElement('canvas');
        this.selectionCtx = this.selection.getContext('2d') as CanvasRenderingContext2D;

        this.originalSelection = document.createElement('canvas');
        this.originalSelectionCtx = this.originalSelection.getContext('2d') as CanvasRenderingContext2D;

    
        this.selection.width = width;
        this.selection.height = height;
        this.originalSelection.width = width;
        this.originalSelection.height = height;
    }

    selection: HTMLCanvasElement;
    originalSelection: HTMLCanvasElement;

    selectionCtx: CanvasRenderingContext2D;
    originalSelectionCtx: CanvasRenderingContext2D;
    
    topLeftRelativeToMiddle: Vec2 = { x: 0, y: 0 };
    offset: Vec2 = { x: 0, y: 0 };
    originalWidth: number;
    originalHeight: number;
    hasBeenManipulated: boolean;
    needWhitePostDrawing: boolean;
    originalTopLeftOnBaseCanvas: Vec2 = { x: 0, y: 0 };
    originalCenter: Vec2 = { x: 0, y: 0 };
    originalVertices: Vec2[] = [];
    currentHorizontalScaling: number;
    currentVerticalScaling: number;

}
