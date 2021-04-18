import { Injectable } from '@angular/core';
import { HandlerMemento } from '@app/app/classes/handler-memento';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { SelectionHelperService } from '@app/tools/services/selection/selection-base/selection-helper.service';
import { CANVAS_SIZE } from '@app/tools/services/selection/selection-constants';

@Injectable({
    providedIn: 'root',
})
export abstract class SelectionHandlerService {

    selection: HTMLCanvasElement = document.createElement('canvas');
    originalSelection: HTMLCanvasElement = document.createElement('canvas');

    selectionCtx: CanvasRenderingContext2D = this.selection.getContext('2d') as CanvasRenderingContext2D;
    originalSelectionCtx: CanvasRenderingContext2D = this.originalSelection.getContext('2d') as CanvasRenderingContext2D;

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

    constructor(protected drawingService: DrawingService, protected selectionService: SelectionHelperService) {}

    abstract extractSelectionFromSource(sourceCanvas: HTMLCanvasElement): void;
    abstract whiteFillAtOriginalLocation(): void;

    makeWhiteBehindSelection(): boolean {
        if (this.needWhitePostDrawing) {
            this.whiteFillAtOriginalLocation();
            return true;
        }
        return false;
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

        if (this.needWhitePostDrawing) {
            this.whiteFillAtOriginalLocation();
        }

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
        } else {
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

    overwriteACanvasWithAnother(
        source: HTMLCanvasElement,
        destination: CanvasRenderingContext2D,
        horizontalScaling: number,
        verticalScaling: number,
    ): void {
        this.drawingService.clearCanvas(destination, { x: CANVAS_SIZE, y: CANVAS_SIZE });
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
        this.selection.width = CANVAS_SIZE;
        this.selection.height = CANVAS_SIZE;
        this.originalSelection.width = CANVAS_SIZE;
        this.originalSelection.height = CANVAS_SIZE;
    }

    hasSelectionBeenManipulated(topLeftOnDestination: Vec2): boolean {
        if (this.hasBeenManipulated) {
            return true;
        }
        return (this.hasBeenManipulated =
            this.originalTopLeftOnBaseCanvas.x !== topLeftOnDestination.x || this.originalTopLeftOnBaseCanvas.y !== topLeftOnDestination.y);
    }

    initializeMementoSize(memento: HandlerMemento): void {
        memento.originalWidth = this.originalWidth;
        memento.originalHeight = this.originalHeight;
    }

    initializeMementoPositions(memento: HandlerMemento): void {
        memento.topLeftRelativeToMiddle = { x: this.topLeftRelativeToMiddle.x, y: this.topLeftRelativeToMiddle.y };
        memento.originalTopLeftOnBaseCanvas = { x: this.originalTopLeftOnBaseCanvas.x, y: this.originalTopLeftOnBaseCanvas.y };
        memento.originalCenter = { x: this.originalCenter.x, y: this.originalCenter.y };
        this.originalVertices.forEach((value) => {
            memento.originalVertices.push({ x: value.x, y: value.y });
        });
    }

    initializeMementoFlags(memento: HandlerMemento): void {
        memento.hasBeenManipulated = true;
        memento.needWhitePostDrawing = this.needWhitePostDrawing;
    }

    initializeMementoResizingProperties(memento: HandlerMemento): void {
        memento.offset = { x: this.offset.x, y: this.offset.y };
        memento.currentHorizontalScaling = this.currentHorizontalScaling;
        memento.currentVerticalScaling = this.currentVerticalScaling;
    }

    createMemento(): HandlerMemento {
        const memento: HandlerMemento = new HandlerMemento(CANVAS_SIZE, CANVAS_SIZE);
        this.initializeMementoSize(memento);
        this.initializeMementoPositions(memento);
        this.initializeMementoFlags(memento);
        this.initializeMementoResizingProperties(memento);
        this.drawACanvasOnAnother(this.selection, memento.selectionCtx);
        this.drawACanvasOnAnother(this.originalSelection, memento.originalSelectionCtx);
        return memento;
    }

    initializeSize(memento: HandlerMemento): void {
        this.originalWidth = memento.originalWidth;
        this.originalHeight = memento.originalHeight;
    }

    initializePositions(memento: HandlerMemento): void {
        this.originalTopLeftOnBaseCanvas = { x: memento.originalTopLeftOnBaseCanvas.x, y: memento.originalTopLeftOnBaseCanvas.y };
        this.originalCenter = { x: memento.originalCenter.x, y: memento.originalCenter.y };
        this.originalVertices = [];
        memento.originalVertices.forEach((value) => {
            this.originalVertices.push({ x: value.x, y: value.y });
        });
    }

    initializeFlags(memento: HandlerMemento): void {
        this.hasBeenManipulated = true;
        this.needWhitePostDrawing = memento.needWhitePostDrawing; //////
    }

    initializeResizingProperties(memento: HandlerMemento): void {
        this.offset = { x: memento.offset.x, y: memento.offset.y };
        this.currentHorizontalScaling = memento.currentHorizontalScaling;
        this.currentVerticalScaling = memento.currentVerticalScaling;
    }

    restoreFromMemento(memento: HandlerMemento): void {
        this.clearAndResetAllCanvas();
        this.drawACanvasOnAnother(memento.selection, this.selectionCtx);
        this.drawACanvasOnAnother(memento.originalSelection, this.originalSelectionCtx);
        this.topLeftRelativeToMiddle = {
            x: memento.topLeftRelativeToMiddle.x,
            y: memento.topLeftRelativeToMiddle.y,
        };
        this.initializeSize(memento);
        this.initializePositions(memento);
        this.initializeFlags(memento);
        this.initializeResizingProperties(memento);
    }
}
