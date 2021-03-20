import { Injectable } from '@angular/core';
import { ResizableTool } from '@app/app/classes/resizable-tool';
import { Vec2 } from '@app/app/classes/vec2';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { FillStyleProperty } from '@app/shapes/properties/fill-style-property';
import { SprayRenderer } from '@app/shapes/renderers/spray-renderer';
import { SprayShape } from '@app/shapes/spray-shape';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';

@Injectable({
    providedIn: 'root',
})
export class SprayService extends ResizableTool implements ISelectableTool {
    private shape: SprayShape;
    private renderer: SprayRenderer;

    private colourProperty: FillStyleProperty;

    jetDiameter: number;
    nbDropsPerSecond: number;

    private lastMousePosition: Vec2;
    private sprayTimer: ReturnType<typeof setTimeout>;

    constructor(drawingService: DrawingService, private colourService: ColourService) {
        super(drawingService);
        this.key = 'spray';

        this.colourProperty = new FillStyleProperty(this.colourService.getPrimaryColour());
        this.colourService.primaryColourChanged.subscribe((newColour: Colour) => (this.colourProperty.colour = newColour));

        this.shape = new SprayShape([]);
        this.renderer = new SprayRenderer(this.shape, [this.colourProperty]);
    }

    onRadiusChanged(newRadius: number): void {
        this.shape.radius = newRadius;
    }

    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
    }

    onSpray(): void {
        this.spray(this.lastMousePosition);
        this.previewPaint();
    }

    onMouseDown(event: MouseEvent): void {
        const NB_MS_IN_SECOND = 1000;

        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.lastMousePosition = this.getPositionFromMouse(event);

            this.onSpray();
            this.sprayTimer = setInterval(() => this.onSpray(), (1 / this.nbDropsPerSecond) * NB_MS_IN_SECOND);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            clearInterval(this.sprayTimer);
            this.finalizePaint();
            this.clearVertices();
        }

        this.mouseDown = false;
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
        this.renderPaint(this.drawingService.baseCtx);
    }

    clearVertices(): void {
        this.shape.vertices.length = 0;
    }
}
