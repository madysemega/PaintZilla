import { Injectable } from '@angular/core';
import { ILineWidthChangeListener } from '@app/app/classes/line-width-change-listener';
import { ResizableTool } from '@app/app/classes/resizable-tool';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { UserActionRenderShape } from '@app/history/user-actions/user-action-render-shape';
import { LineCapProperty } from '@app/shapes/properties/line-cap-property';
import { LineJoinProperty } from '@app/shapes/properties/line-join-property';
import { StrokeStyleProperty } from '@app/shapes/properties/stroke-style-property';
import { StrokeWidthProperty } from '@app/shapes/properties/stroke-width-property';
import { VerticesRenderer } from '@app/shapes/renderers/vertices-renderer';
import { VerticesShape } from '@app/shapes/vertices-shape';
import { IDeselectableTool } from '@app/tools/classes/deselectable-tool';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';

@Injectable({
    providedIn: 'root',
})
export class PencilService extends ResizableTool implements ISelectableTool, IDeselectableTool, ILineWidthChangeListener {
    private colourProperty: StrokeStyleProperty;
    private strokeWidthProperty: StrokeWidthProperty;
    private shape: VerticesShape;
    private renderer: VerticesRenderer;

    constructor(drawingService: DrawingService, private colourService: ColourService, private history: HistoryService) {
        super(drawingService);
        this.key = 'pencil';

        this.colourProperty = new StrokeStyleProperty(this.colourService.getPrimaryColour());
        this.strokeWidthProperty = new StrokeWidthProperty(this.lineWidth);

        this.colourService.primaryColourChanged.subscribe((colour: Colour) => (this.colourProperty.colour = colour));

        this.shape = new VerticesShape([]);

        this.renderer = new VerticesRenderer(this.shape, [
            this.strokeWidthProperty,
            new LineJoinProperty('round'),
            new LineCapProperty('round'),
            this.colourProperty,
        ]);
    }

    onLineWidthChanged(): void {
        if (this.strokeWidthProperty) {
            this.strokeWidthProperty.strokeWidth = this.lineWidth;
        }
    }

    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
    }

    onToolDeselect(): void {
        this.history.isLocked = false;
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

            this.history.do(new UserActionRenderShape([this.renderer.clone()], this.drawingService.baseCtx));
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDown = false;
        this.clearVertices();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.shape.vertices.push(mousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            
            this.renderer.render(this.drawingService.previewCtx);
        }
    }

    private clearVertices(): void {
        this.shape.clear();
    }
}
