import { Injectable } from '@angular/core';
import { ILineWidthChangeListener } from '@app/app/classes/line-width-change-listener';
import { ResizableTool } from '@app/app/classes/resizable-tool';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { StrokeStyleProperty } from '@app/shapes/properties/stroke-style-property';
import { StrokeWidthProperty } from '@app/shapes/properties/stroke-width-property';
import { VerticesShape } from '@app/shapes/vertices-shape';
import { IDeselectableTool } from '@app/tools/classes/deselectable-tool';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';

@Injectable({
    providedIn: 'root',
})
export class PipetteService extends ResizableTool implements ISelectableTool, IDeselectableTool, ILineWidthChangeListener {
    private colourProperty: StrokeStyleProperty;
    private strokeWidthProperty: StrokeWidthProperty;
    private shape: VerticesShape;
    mouseRightDown: boolean = false;
    zoom20: number = 20;
    zoom40: number = 30;
    zoom200: number = 200;
    zoomctx: CanvasRenderingContext2D;
    couleur: Uint8ClampedArray;
    cerclePreview: ImageData;
    outputCouleur: string;
    constructor(drawingService: DrawingService, private colourService: ColourService, public history: HistoryService) {
        super(drawingService);
        this.key = 'pipette';

        this.colourProperty = new StrokeStyleProperty(this.colourService.getPrimaryColour());
        this.strokeWidthProperty = new StrokeWidthProperty(this.lineWidth);
        this.colourService.primaryColourChanged.subscribe((colour: Colour) => (this.colourProperty.colour = colour));

        this.shape = new VerticesShape([]);
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
        this.mouseRightDown = event.button === MouseButton.Right;
        if (this.mouseDown) {
            this.clearVertices();

            this.mouseDownCoord = this.getPositionFromMouse(event);

            this.history.isLocked = true;
            this.colourService.setPrimaryColour(Colour.hexToRgb(this.outputCouleur));
        } else if (this.mouseRightDown) {
            this.clearVertices();

            this.mouseDownCoord = this.getPositionFromMouse(event);

            this.history.isLocked = true;
            this.colourService.setSecondaryColour(Colour.hexToRgb(this.outputCouleur));
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.shape.vertices.push(mousePosition);
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDown = false;
        this.clearVertices();
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.shape.vertices.push(mousePosition);
        let zoom22:number = 18;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.couleur = this.drawingService.baseCtx.getImageData(mousePosition.x-3, mousePosition.y-3, 1, 1).data;
        const R = Colour.toHex(this.couleur[0]);
        const G = Colour.toHex(this.couleur[1]);
        const B = Colour.toHex(this.couleur[2]);
        this.outputCouleur = '#' + R + G + B;
        if (this.drawingService.canvasSize.x > mousePosition.x && this.drawingService.canvasSize.y > mousePosition.y) {
            this.cerclePreview = this.drawingService.baseCtx.getImageData(
                mousePosition.x - zoom22,
                mousePosition.y - zoom22,
                this.zoom40,
                this.zoom40,
            );
            this.drawingService.baseCtx.putImageData(this.cerclePreview, 0, 0);
            this.drawingService.baseCtx.drawImage(this.drawingService.canvas, 0, 0, this.zoom40, this.zoom40, 0, 0, this.zoom200, this.zoom200);
            this.drawingService.baseCtx.beginPath();
            this.drawingService.baseCtx.arc(this.zoom200/2, this.zoom200/2, this.zoom200/2, 0, 2*Math.PI);
            this.drawingService.baseCtx.strokeRect(this.zoom200/2, this.zoom200/2, 5, 5);
            this.drawingService.baseCtx.stroke();
        }
    }
    private clearVertices(): void {
        this.shape.clear();
    }
}
