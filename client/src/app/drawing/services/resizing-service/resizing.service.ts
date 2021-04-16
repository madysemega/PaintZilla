import { EventEmitter, Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import * as Constants from '@app/drawing/constants/drawing-constants';
import { ResizingType } from '@app/drawing/enums/resizing-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { UserActionResizeDrawingSurface } from '@app/history/user-actions/user-action-resize-drawing-surface';
import { MagnetismService } from '@app/magnetism/magnetism.service';
// tslint:disable:no-string-literal
@Injectable({
    providedIn: 'root',
})
export class ResizingService {
    rightResizerEnabled: boolean = false;
    downResizerEnabled: boolean = false;
    rightDownResizerEnabled: boolean = false;
    canvasResize: Vec2;
    image: ImageData;
    onCanvasSizeChange: EventEmitter<Vec2>;
    onCanvasResizeChange: EventEmitter<Vec2>;

    constructor(public drawingService: DrawingService, private historyService: HistoryService, public magnetism: MagnetismService) {
        this.canvasResize = this.drawingService.canvasResize;
        this.onCanvasResizeChange = new EventEmitter<Vec2>();
        this.onCanvasSizeChange = new EventEmitter<Vec2>();
    }

    isResizing(): boolean {
        return this.downResizerEnabled || this.rightDownResizerEnabled || this.rightResizerEnabled;
    }

    resizeCanvas(event: MouseEvent): void {
        const resizeHorizontally = this.canBeResizedHorizontally(event) && (this.rightResizerEnabled || this.rightDownResizerEnabled);
        const resizeVertically = this.canBeResizedVertically(event) && (this.downResizerEnabled || this.rightDownResizerEnabled);

        if (resizeHorizontally) {
            this.canvasResize.x = event.offsetX;
        }
        if (resizeVertically) {
            this.canvasResize.y = event.offsetY;
        }

        this.onCanvasResizeChange.emit({ x: this.canvasResize.x, y: this.canvasResize.y });
        this.drawingService.updateCanvasStyle();
        this.restorePreviewImageData();
    }

    canBeResizedHorizontally(event: MouseEvent): boolean {
        return event.offsetX > Constants.MINIMUM_SIZE && event.offsetX < Constants.MAX_WIDTH;
    }

    canBeResizedVertically(event: MouseEvent): boolean {
        return event.offsetY > Constants.MINIMUM_SIZE && event.offsetY < Constants.MAX_HEIGHT;
    }

    restorePreviewImageData(): void {
        this.drawingService.previewCtx.putImageData(this.image, 0, 0);
    }

    activateResizer(button: string): void {
        this.saveCurrentImage();
        this.rightResizerEnabled = button === ResizingType.RIGHT;
        this.downResizerEnabled = button === ResizingType.DOWN;
        this.rightDownResizerEnabled = button === ResizingType.RIGHTDOWN;
    }

    saveCurrentImage(): void {
        this.image = this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvasSize.x, this.drawingService.canvasSize.y);
    }

    disableResizer(): void {
        this.rightResizerEnabled = false;
        this.rightDownResizerEnabled = false;
        this.downResizerEnabled = false;
        this.updateCanvasSize();
        this.drawingService.restoreCanvasStyle();
        this.restoreBaseImageData();
    }

    finalizeResizingEvent(): void {
        this.historyService.do(
            new UserActionResizeDrawingSurface(this.canvasResize.x, this.canvasResize.y, (width: number, height: number) => {
                this.saveCurrentImage();
                this.drawingService.resizeDrawingSurface(width, height);
                this.drawingService.resetDrawingSurfaceColour();
                this.restoreBaseImageData();
                this.magnetism.toggleGrid();
                this.magnetism.toggleGrid();
            }),
        );
    }

    updateCanvasSize(): void {
        this.drawingService.canvasSize.x = this.canvasResize.x;
        this.drawingService.canvasSize.y = this.canvasResize.y;
        this.onCanvasSizeChange.emit({ x: this.drawingService.canvasSize.x, y: this.drawingService.canvasSize.y });
    }

    restoreBaseImageData(): void {
        this.drawingService.baseCtx.putImageData(this.image, 0, 0);
    }
    resetCanvasDimensions(): void {
        this.canvasResize.x = Constants.DEFAULT_WIDTH;
        this.canvasResize.y = Constants.DEFAULT_HEIGHT;
        this.onCanvasResizeChange.emit({ x: this.canvasResize.x, y: this.canvasResize.y });
    }
}
