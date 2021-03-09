import { Injectable } from '@angular/core';
import { HandlerMemento } from '@app/app/classes/handler-memento';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { SelectionHelperService } from '@app/tools/services/selection/selection-base/selection-helper.service';

export enum ResizingMode {
    off = 0,
    towardsRight = 1,
    towardsLeft = 2,
    towardsTop = 3,
    towardsBottom = 4,
}

@Injectable({
    providedIn: 'root',
})
export abstract class SelectionHandlerService {
    protected readonly CIRCLE_MAX_ANGLE: number = 360;

    selection: HTMLCanvasElement;
    originalSelection: HTMLCanvasElement;

    selectionCtx: CanvasRenderingContext2D;
    originalSelectionCtx: CanvasRenderingContext2D;

    topLeftRelativeToMiddle: Vec2 = { x: 0, y: 0 };
    offset: Vec2 = { x: 0, y: 0 };

    originalWidth: number;
    originalHeight: number;
    originalCenter: Vec2 = { x: 0, y: 0 };
    originalVertices: Vec2[] = [];
    originalTopLeftOnBaseCanvas: Vec2 = { x: 0, y: 0 };

    hasBeenManipulated: boolean;
    needWhitePostDrawing: boolean;
    
    currentHorizontalScaling: number = 1;
    currentVerticalScaling: number = 1;

    constructor(protected drawingService: DrawingService, protected selectionService: SelectionHelperService) {
        this.selection = document.createElement('canvas');
        this.selectionCtx = this.selection.getContext('2d') as CanvasRenderingContext2D;
        this.originalSelection = document.createElement('canvas');
        this.originalSelectionCtx = this.originalSelection.getContext('2d') as CanvasRenderingContext2D;
    }

    abstract extractSelectionFromSource(sourceCanvas: HTMLCanvasElement): void;
    abstract whiteFillAtOriginalLocation(): void;

    makeWhiteBehindSelection(): void{
        if(this.needWhitePostDrawing){
            this.whiteFillAtOriginalLocation();
        }
    }

    initAllProperties(vertices: Vec2[]): void {
        this.originalVertices = vertices;
        this.originalWidth = vertices[1].x - vertices[0].x;
        this.originalHeight = vertices[1].y - vertices[0].y;
        this.topLeftRelativeToMiddle.x = this.selection.width / 2 - this.originalWidth / 2;
        this.topLeftRelativeToMiddle.y = this.selection.height / 2 - this.originalHeight / 2;
        this.offset = { x: 0, y: 0 };

        this.originalTopLeftOnBaseCanvas = { x: vertices[0].x, y: vertices[0].y };
        this.originalCenter = { x: (vertices[0].x + vertices[1].x) / 2, y: (vertices[0].y + vertices[1].y) / 2 };

        this.hasBeenManipulated = false;
        this.needWhitePostDrawing = true;

        this.currentHorizontalScaling = 1;
        this.currentVerticalScaling = 1;
    }

    select(sourceCanvas: HTMLCanvasElement, vertices: Vec2[]): void {
        this.clearAndResetAllCanvas();
        this.initAllProperties(vertices);
        this.extractSelectionFromSource(sourceCanvas);
        this.drawACanvasOnAnother(this.selection, this.originalSelectionCtx);
    }

    drawSelection(destination: CanvasRenderingContext2D, topLeftOnDestination: Vec2): boolean {

        if (!this.hasSelectionBeenManipulated(topLeftOnDestination)) {
            return false;
        }

       /* if (this.needWhitePostDrawing) {
            this.whiteFillAtOriginalLocation();
        }*/
        this.makeWhiteBehindSelection();
        
        const topLeft: Vec2 = {
            x: topLeftOnDestination.x - this.topLeftRelativeToMiddle.x + this.offset.x,
            y: topLeftOnDestination.y - this.topLeftRelativeToMiddle.y + this.offset.y,
        };
        this.drawACanvasOnAnother(this.selection, destination, topLeft);
        return true;
    }

    resizeSelection(topLeftOnSource: Vec2, bottomRightOnSource: Vec2, isHorizontal: boolean): void {
        let newlength;
        this.hasBeenManipulated = true;

        if (isHorizontal) {
            newlength = bottomRightOnSource.x - topLeftOnSource.x;
            this.currentHorizontalScaling = newlength / this.originalWidth;
            this.updateHorizontalOffset(newlength);
        }
        else {
            newlength = bottomRightOnSource.y - topLeftOnSource.y;
            this.currentVerticalScaling = newlength / this.originalHeight;
            this.updateVerticalOffset(newlength);
        }

        this.overwriteACanvasWithAnother(this.originalSelection, this.selectionCtx, this.currentHorizontalScaling, this.currentVerticalScaling);
    }

    transform(contextToTransform: CanvasRenderingContext2D, horizontalScaling: number, verticalScaling: number): void {
        contextToTransform.translate(this.selection.width / 2, this.selection.height / 2);
        contextToTransform.transform(horizontalScaling, 0, 0, verticalScaling, 0, 0);
        contextToTransform.translate(-this.selection.width / 2, -this.selection.height / 2);
    }

    drawACanvasOnAnother(source: HTMLCanvasElement, destination: CanvasRenderingContext2D, topLeftOnDestination?: Vec2): void {
        let definedPosition: Vec2;
        if (topLeftOnDestination == undefined) {
            definedPosition = { x: 0, y: 0 };
        } else {
            definedPosition = { x: topLeftOnDestination.x, y: topLeftOnDestination.y };
        }
        destination.beginPath();
        destination.imageSmoothingEnabled = false;
        destination.drawImage(source, definedPosition.x, definedPosition.y);
        destination.closePath();
    }

    overwriteACanvasWithAnother(source: HTMLCanvasElement, destination: CanvasRenderingContext2D, horizontalScaling: number, verticalScaling: number): void {
        this.drawingService.clearCanvas(destination);
        destination.beginPath();
        this.transform(destination, horizontalScaling, verticalScaling);
        destination.imageSmoothingEnabled = false;
        destination.drawImage(source, 0, 0);
        destination.closePath();
        destination.resetTransform();
    }

    updateHorizontalOffset(newWidth: number): void {
        this.offset.x = (newWidth - this.originalWidth) / 2;
    }

    updateVerticalOffset(newHeight: number): void {
        this.offset.y = (newHeight - this.originalHeight) / 2;
    }

    clearAndResetAllCanvas(): void {
        // changing canvas size clears it
        this.selection.width = this.drawingService.canvas.width;
        this.selection.height = this.drawingService.canvas.height;
        this.originalSelection.width = this.drawingService.canvas.width;
        this.originalSelection.height = this.drawingService.canvas.height;
    }

    hasSelectionBeenManipulated(topLeftOnDestination: Vec2): boolean {
        if (this.hasBeenManipulated) {
            return true;
        }
        return (this.hasBeenManipulated =
            this.originalTopLeftOnBaseCanvas.x !== topLeftOnDestination.x || this.originalTopLeftOnBaseCanvas.y !== topLeftOnDestination.y);
    }

    createMemento(): HandlerMemento {
        const memento: HandlerMemento = new HandlerMemento(this.drawingService.canvasSize.x, this.drawingService.canvasSize.y);

        memento.topLeftRelativeToMiddle = { x: this.topLeftRelativeToMiddle.x, y: this.topLeftRelativeToMiddle.y };
        memento.offset = { x: this.offset.x, y: this.offset.y };

        memento.originalWidth = this.originalWidth;
        memento.originalHeight = this.originalHeight;

        memento.hasBeenManipulated = true;
        memento.needWhitePostDrawing = this.needWhitePostDrawing; //////
        memento.originalTopLeftOnBaseCanvas = { x: this.originalTopLeftOnBaseCanvas.x, y: this.originalTopLeftOnBaseCanvas.y };
        memento.originalCenter = { x: this.originalCenter.x, y: this.originalCenter.y };
        this.originalVertices.forEach((value) => {
            memento.originalVertices.push({ x: value.x, y: value.y });
        });

        memento.currentHorizontalScaling = this.currentHorizontalScaling;
        memento.currentVerticalScaling = this.currentVerticalScaling;

        this.drawACanvasOnAnother(this.selection, memento.selectionCtx);
        this.drawACanvasOnAnother(this.originalSelection, memento.originalSelectionCtx);
        
        return memento;
    }

    restoreFromMemento(memento: HandlerMemento): void {
        this.clearAndResetAllCanvas();
        this.drawACanvasOnAnother(memento.selection, this.selectionCtx);
        this.drawACanvasOnAnother(memento.originalSelection, this.originalSelectionCtx);

        this.topLeftRelativeToMiddle = { x: memento.topLeftRelativeToMiddle.x, y: memento.topLeftRelativeToMiddle.y };
        this.offset = { x: memento.offset.x, y: memento.offset.y };

        this.originalWidth = memento.originalWidth;
        this.originalHeight = memento.originalHeight;

        this.hasBeenManipulated = true;
        this.needWhitePostDrawing = memento.needWhitePostDrawing; //////
        this.originalTopLeftOnBaseCanvas = { x: memento.originalTopLeftOnBaseCanvas.x, y: memento.originalTopLeftOnBaseCanvas.y };

        this.originalCenter = { x: memento.originalCenter.x, y: memento.originalCenter.y };
        this.originalVertices = [];
        memento.originalVertices.forEach((value) => {
            this.originalVertices.push({ x: value.x, y: value.y });
        });

        this.currentHorizontalScaling = memento.currentHorizontalScaling;
        this.currentVerticalScaling = memento.currentVerticalScaling;
    }
}
