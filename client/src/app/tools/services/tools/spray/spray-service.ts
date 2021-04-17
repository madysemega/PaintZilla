import { Injectable } from '@angular/core';
import { ResizableTool } from '@app/app/classes/resizable-tool';
import { Vec2 } from '@app/app/classes/vec2';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { UserActionRenderShape } from '@app/history/user-actions/user-action-render-shape';
import { FillStyleProperty } from '@app/shapes/properties/fill-style-property';
import { SprayRenderer } from '@app/shapes/renderers/spray-renderer';
import { SprayShape } from '@app/shapes/spray-shape';
import { IDeselectableTool } from '@app/tools/classes/deselectable-tool';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';
import * as Constants from './spray-service.constants';
@Injectable({
    providedIn: 'root',
})
export class SprayService extends ResizableTool implements ISelectableTool, IDeselectableTool {
    private shape: SprayShape = new SprayShape([]);

    private colourProperty: FillStyleProperty = new FillStyleProperty(this.colourService.getPrimaryColour());
    private renderer: SprayRenderer = new SprayRenderer(this.shape, [this.colourProperty]);
    jetDiameter: number;
    nbDropsPerSecond: number;

    private lastMousePosition: Vec2;
    private sprayTimer: ReturnType<typeof setTimeout>;

    constructor(drawingService: DrawingService, private colourService: ColourService, private history: HistoryService) {
        super(drawingService);
        this.key = 'spray';
        this.colourService.primaryColourChanged.subscribe((newColour: Colour) => (this.colourProperty.colour = newColour));
    }

    onRadiusChanged(newRadius: number): void {
        this.shape.radius = newRadius;
    }

    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
    }

    onToolDeselect(): void {
        this.history.isLocked = false;
        clearInterval(this.sprayTimer);
        this.finalizePaint();
        this.clearVertices();
        this.mouseDown = false;
    }

    onSpray(): void {
        this.spray(this.lastMousePosition);
        this.previewPaint();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.lastMousePosition = this.getPositionFromMouse(event);

            this.history.isLocked = true;

            this.onSpray();
            this.sprayTimer = setInterval(() => this.onSpray(), (1.0 / this.nbDropsPerSecond) * Constants.NB_MS_IN_SECOND);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            clearInterval(this.sprayTimer);
            this.finalizePaint();
            this.clearVertices();
        }

        if (event.button === MouseButton.Left) {
            this.mouseDown = false;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.lastMousePosition = this.getPositionFromMouse(event);
        }
    }

    private spray(around: Vec2): void {
        const min: number = Math.ceil(-this.jetDiameter);
        const max: number = Math.floor(this.jetDiameter);

        this.shape.vertices.push({
            x: around.x + Math.floor(Math.random() * (max - min + 1)) + min,
            y: around.y + Math.floor(Math.random() * (max - min + 1)) + min,
        });
    }

    private previewPaint(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.renderPaint(this.drawingService.previewCtx);
    }

    private renderPaint(ctx: CanvasRenderingContext2D): void {
        this.renderer.render(ctx);
    }

    private finalizePaint(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.history.do(new UserActionRenderShape([this.renderer.clone()], this.drawingService.baseCtx));
    }

    clearVertices(): void {
        this.shape.vertices.length = 0;
    }
}
