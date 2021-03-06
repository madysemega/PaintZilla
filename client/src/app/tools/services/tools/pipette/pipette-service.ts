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
import { StrokeWidthProperty } from '@app/shapes/properties/stroke-width-property/stroke-width-property';
import { VerticesShape } from '@app/shapes/vertices-shape';
import { IDeselectableTool } from '@app/tools/classes/deselectable-tool';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';
import * as Constants from './pipette-service.constants';

@Injectable({
    providedIn: 'root',
})
export class PipetteService extends ResizableTool implements ISelectableTool, IDeselectableTool, ILineWidthChangeListener {
    private colourProperty: StrokeStyleProperty = new StrokeStyleProperty(this.colourService.getPrimaryColour());
    private strokeWidthProperty: StrokeWidthProperty = new StrokeWidthProperty(this.lineWidth);
    private shape: VerticesShape = new VerticesShape([]);
    mouseRightDown: boolean = false;

    zoomctx: CanvasRenderingContext2D;
    colors: Uint8ClampedArray;
    circlePreview: ImageData;
    colorOutput: string;

    constructor(drawingService: DrawingService, private colourService: ColourService, public history: HistoryService) {
        super(drawingService);
        this.key = 'pipette';
        this.colourService.primaryColourChanged.subscribe((colour: Colour) => (this.colourProperty.colour = colour));
    }

    setCtx(ctx: CanvasRenderingContext2D): void {
        this.zoomctx = ctx;

        this.zoomctx.save();
        this.fillTheEntireCanvasInBlue();
        this.fillTheCircleInWhite();
        this.drawHorizontalLines();
        this.drawVerticalLines();
        this.zoomctx.restore();
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
            this.colourService.setPrimaryColour(Colour.hexToRgb(this.colorOutput));
        } else if (this.mouseRightDown) {
            this.clearVertices();

            this.mouseDownCoord = this.getPositionFromMouse(event);

            this.history.isLocked = true;
            this.colourService.setSecondaryColour(Colour.hexToRgb(this.colorOutput));
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

        this.getColor(mousePosition);

        this.zoomctx.save();

        if (
            this.drawingService.canvasSize.x > mousePosition.x &&
            mousePosition.x > 0 &&
            this.drawingService.canvasSize.y > mousePosition.y &&
            mousePosition.y > 0
        ) {
            this.extractAPortionOfCanvas(mousePosition);
            this.fillTheEntireCanvasInBlue();
            this.pasteThePortionOfCanvas();
            this.drawHorizontalLines();
            this.drawVerticalLines();
        } else {
            this.fillTheCircleInWhite();
            this.drawHorizontalLines();
            this.drawVerticalLines();
        }

        this.drawPixelSelector();
        this.zoomctx.restore();
    }

    private clearVertices(): void {
        this.shape.clear();
    }

    getColor(mousePosition: Vec2): void {
        this.colors = this.drawingService.baseCtx.getImageData(
            mousePosition.x - Constants.RECTANGLE_WIDTH,
            mousePosition.y - Constants.RECTANGLE_WIDTH,
            1,
            1,
        ).data;
        const R = Colour.toHex(this.colors[0]);
        const G = Colour.toHex(this.colors[1]);
        const B = Colour.toHex(this.colors[2]);

        this.colorOutput = '#' + R + G + B;
    }

    extractAPortionOfCanvas(mousePosition: Vec2): void {
        this.circlePreview = this.drawingService.baseCtx.getImageData(
            mousePosition.x - Constants.ZOOM_CENTER_POS,
            mousePosition.y - Constants.ZOOM_CENTER_POS,
            Constants.ZOOM_WIDTH + 1,
            Constants.ZOOM_WIDTH + 1,
        );
    }

    fillTheCircleInWhite(): void {
        this.zoomctx.beginPath();
        this.zoomctx.arc(Constants.ZOOM_SIZE / 2, Constants.ZOOM_SIZE / 2, Constants.ZOOM_SIZE / 2, 0, 2 * Math.PI);
        this.zoomctx.clip();
        this.zoomctx.fillStyle = 'white';
        this.zoomctx.fillRect(0, 0, Constants.ZOOM_SIZE, Constants.ZOOM_SIZE);
        this.zoomctx.closePath();
    }

    fillTheEntireCanvasInBlue(): void {
        this.zoomctx.clearRect(0, 0, Constants.ZOOM_SIZE, Constants.ZOOM_SIZE);
        this.zoomctx.save();
        this.zoomctx.beginPath();
        this.zoomctx.fillStyle = 'rgba(40, 82, 145, 0.932)';
        this.zoomctx.fillRect(0, 0, Constants.ZOOM_SIZE, Constants.ZOOM_SIZE);
        this.zoomctx.closePath();
        this.zoomctx.restore();
    }

    pasteThePortionOfCanvas(): void {
        this.zoomctx.beginPath();
        this.zoomctx.lineWidth = Constants.RECTANGLE_WIDTH;
        this.zoomctx.arc(Constants.ZOOM_SIZE / 2, Constants.ZOOM_SIZE / 2, Constants.ZOOM_SIZE / 2, 0, 2 * Math.PI);
        this.zoomctx.clip();
        this.zoomctx.putImageData(this.circlePreview, Constants.ZOOM_SIZE / 2, Constants.ZOOM_SIZE / 2);
        this.zoomctx.imageSmoothingEnabled = false;
        this.zoomctx.drawImage(
            this.zoomctx.canvas,
            Constants.ZOOM_SIZE / 2,
            Constants.ZOOM_SIZE / 2,
            Constants.ZOOM_WIDTH,
            Constants.ZOOM_WIDTH,
            0,
            0,
            Constants.ZOOM_SIZE,
            Constants.ZOOM_SIZE,
        );
    }

    drawHorizontalLines(): void {
        const PIXEL_WIDTH = 20;
        const OFFSET = 10;
        const N_LINES = 12;
        const GRID_WIDTH = 1.0;

        this.zoomctx.beginPath();
        this.zoomctx.lineTo(0, OFFSET);
        this.zoomctx.lineWidth = GRID_WIDTH;
        this.zoomctx.strokeStyle = 'rgba(18, 37, 59, 0.932)';

        let i = 0;
        while (i < N_LINES) {
            this.zoomctx.lineTo(Constants.ZOOM_SIZE, i * PIXEL_WIDTH + OFFSET);
            this.zoomctx.lineTo(Constants.ZOOM_SIZE, (i + 1) * PIXEL_WIDTH + OFFSET);
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
        const GRID_WIDTH = 1.0;

        this.zoomctx.beginPath();
        this.zoomctx.lineTo(OFFSET, 0);
        this.zoomctx.lineWidth = GRID_WIDTH;
        this.zoomctx.strokeStyle = 'rgba(18, 37, 59, 0.932)';

        let j = 0;
        while (j < N_LINES) {
            this.zoomctx.lineTo(j * PIXEL_HEIGHT + OFFSET, Constants.ZOOM_SIZE);
            this.zoomctx.lineTo((j + 1) * PIXEL_HEIGHT + OFFSET, Constants.ZOOM_SIZE);
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
            Constants.ZOOM_SIZE / 2 - Constants.RECTANGLE_SIZE / 2,
            Constants.ZOOM_SIZE / 2 - Constants.RECTANGLE_SIZE / 2,
            Constants.RECTANGLE_SIZE,
            Constants.RECTANGLE_SIZE,
        );
        this.zoomctx.lineWidth = Constants.CIRCLE_WIDTH;
        this.zoomctx.stroke();
        this.zoomctx.closePath();
        this.zoomctx.restore();
    }
}
