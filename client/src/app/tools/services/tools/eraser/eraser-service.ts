import { Injectable } from '@angular/core';
import { ILineWidthChangeListener } from '@app/app/classes/line-width-change-listener';
import { ResizableTool } from '@app/app/classes/resizable-tool';
import { Vec2 } from '@app/app/classes/vec2';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { UserActionRenderShape } from '@app/history/user-actions/user-action-render-shape';
import { EraserShape } from '@app/shapes/eraser-shape';
import { FillStyleProperty } from '@app/shapes/properties/fill-style-property';
import { StrokeStyleProperty } from '@app/shapes/properties/stroke-style-property';
import { StrokeWidthProperty } from '@app/shapes/properties/stroke-width-property/stroke-width-property';
import { EraserRenderer } from '@app/shapes/renderers/eraser-renderer';
import { IDeselectableTool } from '@app/tools/classes/deselectable-tool';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';
import * as Constants from './eraser-service.constants';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends ResizableTool implements ISelectableTool, IDeselectableTool, ILineWidthChangeListener {
    minimumWidth: number = 5;
    private strokeWidthProperty: StrokeWidthProperty = new StrokeWidthProperty(this.minimumWidth);
    private shape: EraserShape = new EraserShape([], this.strokeWidthProperty.strokeWidth);
    private renderer: EraserRenderer = new EraserRenderer(this.shape, [
        this.strokeWidthProperty,
        new StrokeStyleProperty(Colour.hexToRgb('#FFFFFF')),
        new FillStyleProperty(Colour.hexToRgb('#FFFFFF')),
    ]);
    constructor(drawingService: DrawingService, private history: HistoryService) {
        super(drawingService);
        this.key = 'eraser';
        this.lineWidth = this.minimumWidth;
    }

    onLineWidthChanged(): void {
        if (this.strokeWidthProperty) {
            this.strokeWidthProperty.strokeWidth = Math.max(this.lineWidth, this.minimumWidth);
            this.shape.strokeWidth = this.strokeWidthProperty.strokeWidth;
        }
    }

    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.NONE);
    }

    onToolDeselect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
        this.finalize();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearVertices();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.history.isLocked = true;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.shape.vertices.push(mousePosition);

            this.finalize();
        }
        this.clearVertices();
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            this.shape.vertices.push(mousePosition);
        }

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawVertices(this.drawingService.previewCtx);
        this.drawCursor(mousePosition, this.drawingService.previewCtx);
    }

    drawVertices(ctx: CanvasRenderingContext2D): void {
        this.renderer.render(ctx);
    }

    finalize(): void {
        this.history.do(new UserActionRenderShape([this.renderer.clone()], this.drawingService.baseCtx));
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.clearVertices();
        this.mouseDown = false;
    }

    private drawCursor(position: Vec2, ctx: CanvasRenderingContext2D): void {
        ctx.save();

        ctx.beginPath();

        ctx.strokeStyle = Constants.CURSOR_STROKE_STYLE;
        ctx.fillStyle = Constants.CURSOR_FILL_STYLE;

        const SIZE = this.lineWidth;
        ctx.rect(position.x - SIZE / 2, position.y - SIZE / 2, SIZE, SIZE);

        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    private clearVertices(): void {
        this.shape.clear();
    }
}
