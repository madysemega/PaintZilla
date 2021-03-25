import { Injectable } from '@angular/core';
import { ILineWidthChangeListener } from '@app/app/classes/line-width-change-listener';
import { ResizableTool } from '@app/app/classes/resizable-tool';
import { Vec2 } from '@app/app/classes/vec2';
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

    zoomctx: CanvasRenderingContext2D;
    couleur: Uint8ClampedArray;
    cerclePreview: ImageData;
    outputCouleur: string;

    readonly RECTANGLE_WIDTH: number = 3;
    readonly RECTANGLE_SIZE: number = 20;
    readonly ZOOM_WIDTH: number = 10;
    readonly CIRCLE_WIDTH: number = 6;
    readonly ZOOM_SIZE: number = 201;
    readonly ZOOM_CENTER_POS: number = 8;

    constructor(drawingService: DrawingService, private colourService: ColourService, public history: HistoryService) {
        super(drawingService);
        this.key = 'pipette';
        this.colourProperty = new StrokeStyleProperty(this.colourService.getPrimaryColour());
        this.strokeWidthProperty = new StrokeWidthProperty(this.lineWidth);
        this.colourService.primaryColourChanged.subscribe((colour: Colour) => (this.colourProperty.colour = colour));

        this.shape = new VerticesShape([]);
    }

    setCtx(ctx: CanvasRenderingContext2D): void {
        this.zoomctx = ctx;

        this.fillTheEntireCanvasInBlue();
        this.fillTheCircleInWhite();
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
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        this.getCouleur(mousePosition);

        if (
            this.drawingService.canvasSize.x > mousePosition.x &&
            mousePosition.x > 0 &&
            this.drawingService.canvasSize.y > mousePosition.y &&
            mousePosition.y > 0
        ) {
            this.zoomctx.save();

            this.extractAPortionOfCanvas(mousePosition);

            this.fillTheEntireCanvasInBlue();

            this.pasteThePortionOfCanvas();

            this.drawHorizontalLines();

            this.drawVerticalLines();

            this.zoomctx.restore();
        } else {
            this.fillTheCircleInWhite();
        }

        this.drawPixelSelector();
    }

    private clearVertices(): void {
        this.shape.clear();
    }

    getCouleur(mousePosition: Vec2): void {
        this.couleur = this.drawingService.baseCtx.getImageData(
            mousePosition.x - this.RECTANGLE_WIDTH,
            mousePosition.y - this.RECTANGLE_WIDTH,
            1,
            1,
        ).data;
        const R = Colour.toHex(this.couleur[0]);
        const G = Colour.toHex(this.couleur[1]);
        const B = Colour.toHex(this.couleur[2]);

        this.outputCouleur = '#' + R + G + B;
    }

    extractAPortionOfCanvas(mousePosition: Vec2): void {
        this.cerclePreview = this.drawingService.baseCtx.getImageData(
            mousePosition.x - this.ZOOM_CENTER_POS,
            mousePosition.y - this.ZOOM_CENTER_POS,
            this.ZOOM_WIDTH + 1,
            this.ZOOM_WIDTH + 1,
        );
    }

    fillTheCircleInWhite(): void {
        this.zoomctx.save();
        this.zoomctx.beginPath();
        this.zoomctx.arc(this.ZOOM_SIZE / 2, this.ZOOM_SIZE / 2, this.ZOOM_SIZE / 2, 0, 2 * Math.PI);
        this.zoomctx.clip();
        this.zoomctx.fillStyle = 'white';
        this.zoomctx.fillRect(0, 0, this.ZOOM_SIZE, this.ZOOM_SIZE);
        this.zoomctx.closePath();
        this.zoomctx.restore();
    }

    fillTheEntireCanvasInBlue(): void {
        this.zoomctx.clearRect(0, 0, this.ZOOM_SIZE, this.ZOOM_SIZE);
        this.zoomctx.save();
        this.zoomctx.beginPath();
        this.zoomctx.fillStyle = 'rgba(40, 82, 145, 0.932)';
        this.zoomctx.fillRect(0, 0, this.ZOOM_SIZE, this.ZOOM_SIZE);
        this.zoomctx.closePath();
        this.zoomctx.restore();
    }

    pasteThePortionOfCanvas(): void {
        this.zoomctx.beginPath();
        this.zoomctx.lineWidth = this.RECTANGLE_WIDTH;
        this.zoomctx.arc(this.ZOOM_SIZE / 2, this.ZOOM_SIZE / 2, this.ZOOM_SIZE / 2, 0, 2 * Math.PI);
        this.zoomctx.clip();
        this.zoomctx.putImageData(this.cerclePreview, this.ZOOM_SIZE / 2, this.ZOOM_SIZE / 2);
        this.zoomctx.imageSmoothingEnabled = false;
        this.zoomctx.drawImage(
            this.zoomctx.canvas,
            this.ZOOM_SIZE / 2,
            this.ZOOM_SIZE / 2,
            this.ZOOM_WIDTH,
            this.ZOOM_WIDTH,
            0,
            0,
            this.ZOOM_SIZE,
            this.ZOOM_SIZE,
        );
    }

    drawHorizontalLines(): void {
        const PIXEL_WIDTH = 20;
        const OFFSET = 10;
        const N_LINES = 12;
        const GRID_WIDTH = 1.5;

        this.zoomctx.beginPath();
        this.zoomctx.lineTo(0, OFFSET);
        this.zoomctx.lineWidth = GRID_WIDTH;
        let i = 0;
        while (i < N_LINES) {
            this.zoomctx.lineTo(this.ZOOM_SIZE, i * PIXEL_WIDTH + OFFSET);
            this.zoomctx.lineTo(this.ZOOM_SIZE, (i + 1) * PIXEL_WIDTH + OFFSET);
            this.zoomctx.lineTo(0, (i + 1) * PIXEL_WIDTH + OFFSET);
            i++;
        }
        this.zoomctx.stroke();
        this.zoomctx.closePath();
    }

    drawVerticalLines(): void {
        const PIXEL_HEIGHT = 20;
        const OFFSET = 10;
        const N_LINES = 12;
        const GRID_WIDTH = 1.5;

        this.zoomctx.beginPath();
        this.zoomctx.lineTo(OFFSET, 0);
        this.zoomctx.lineWidth = GRID_WIDTH;
        let j = 0;
        while (j < N_LINES) {
            this.zoomctx.lineTo(j * PIXEL_HEIGHT + OFFSET, this.ZOOM_SIZE);
            this.zoomctx.lineTo((j + 1) * PIXEL_HEIGHT + OFFSET, this.ZOOM_SIZE);
            this.zoomctx.lineTo((j + 1) * PIXEL_HEIGHT + OFFSET, 0);
            j++;
        }
        this.zoomctx.stroke();
        this.zoomctx.closePath();
    }

    drawPixelSelector(): void {
        this.zoomctx.save();
        this.zoomctx.beginPath();
        this.zoomctx.lineWidth = 2;
        this.zoomctx.strokeStyle = 'rgb(230, 255, 6)';
        this.zoomctx.strokeRect(
            this.ZOOM_SIZE / 2 - this.RECTANGLE_SIZE / 2,
            this.ZOOM_SIZE / 2 - this.RECTANGLE_SIZE / 2,
            this.RECTANGLE_SIZE,
            this.RECTANGLE_SIZE,
        );
        this.zoomctx.lineWidth = this.CIRCLE_WIDTH;
        this.zoomctx.stroke();
        this.zoomctx.closePath();
        this.zoomctx.restore();
    }
}
