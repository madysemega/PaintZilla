import { Injectable } from '@angular/core';
import { ResizableTool } from '@app/app/classes/resizable-tool';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { UserActionRenderShape } from '@app/history/user-actions/user-action-render-shape';
import { PixelShape } from '@app/shapes/pixel-shape';
import { FillStyleProperty } from '@app/shapes/properties/fill-style-property';
import { PixelFillRenderer } from '@app/shapes/renderers/pixel-fill-renderer';
import { IDeselectableTool } from '@app/tools/classes/deselectable-tool';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';
import { ContiguousPixelFill } from '@app/tools/services/paint-bucket/contiguous-fill/contiguous-pixel-fill';
import { FloodFill } from '@app/tools/services/paint-bucket/flood-fill/flood-fill';
import { NonContiguousPixelFill } from '@app/tools/services/paint-bucket/non-contiguous-fill/non-contiguous-pixel-fill';
@Injectable({
    providedIn: 'root',
})
export class PaintBucketService extends ResizableTool implements ISelectableTool, IDeselectableTool {
    contiguousPixelFill: ContiguousPixelFill;
    nonContiguousPixelFill: NonContiguousPixelFill;
    fillBucket: { [key: number]: FloodFill };
    colourProperty: FillStyleProperty;
    fillRenderer: PixelFillRenderer;
    pixelShape: PixelShape;
    tolerance: number;
    isFilling: boolean;
    constructor(drawingService: DrawingService, private colourService: ColourService, private historyService: HistoryService) {
        super(drawingService);
        this.key = 'paint-bucket';
        this.contiguousPixelFill = new ContiguousPixelFill();
        this.nonContiguousPixelFill = new NonContiguousPixelFill();
        this.fillBucket = { 0: this.contiguousPixelFill, 2: this.nonContiguousPixelFill };
        this.isFilling = false;
    }

    onMouseDown(event: MouseEvent): void {
        if (!this.isFilling) {
            this.isFilling = true;
            const coords = this.getPositionFromMouse(event);
            const imageData = this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
            this.colourProperty = new FillStyleProperty(this.colourService.getPrimaryColour());
            this.historyService.isLocked = true;
            const pixels = this.fillBucket[event.button].fill(imageData, { x: coords.x, y: coords.y }, this.colourProperty.colour, this.tolerance);
            this.renderFill(pixels);
        }
    }

    renderFill(pixels: number[]): void {
        this.pixelShape = new PixelShape(pixels);
        this.fillRenderer = new PixelFillRenderer(
            this.pixelShape,
            [this.colourProperty],
            this.drawingService.canvas.width,
            this.drawingService.canvas.height,
        );
        this.historyService.do(new UserActionRenderShape([this.fillRenderer], this.drawingService.baseCtx));
        this.isFilling = false;
    }

    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
    }

    onToolDeselect(): void {
        this.historyService.isLocked = false;
    }
}
