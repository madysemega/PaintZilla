import { Injectable } from '@angular/core';
import { ILineWidthChangeListener } from '@app/app/classes/line-width-change-listener';
import { ShapeTool } from '@app/app/classes/shape-tool';
import { ShapeType } from '@app/app/classes/shape-type';
import { Vec2 } from '@app/app/classes/vec2';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { UserActionRenderShape } from '@app/history/user-actions/user-action-render-shape';
import { BoxShape } from '@app/shapes/box-shape';
import { ContouredBoxShape } from '@app/shapes/contoured-box-shape';
import { FillStyleProperty } from '@app/shapes/properties/fill-style-property';
import { StrokeStyleProperty } from '@app/shapes/properties/stroke-style-property';
import { StrokeWidthProperty } from '@app/shapes/properties/stroke-width-property';
import { RectangleFillRenderer } from '@app/shapes/renderers/rectangle-fill-renderer';
import { RectangleStrokeRenderer } from '@app/shapes/renderers/rectangle-stroke-renderer';
import { ShapeRenderer } from '@app/shapes/renderers/shape-renderer';
import { IDeselectableTool } from '@app/tools/classes/deselectable-tool';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends ShapeTool implements ISelectableTool, IDeselectableTool, ILineWidthChangeListener {
    startingPos: Vec2;
    width: number;
    height: number;
    shiftDown: boolean;
    lastMouseCoords: Vec2;

    private shape: ContouredBoxShape;
    private strokeRenderer: RectangleStrokeRenderer;
    private fillRenderer: RectangleFillRenderer;

    private strokeStyleProperty: StrokeStyleProperty;
    private fillStyleProperty: FillStyleProperty;
    private strokeWidthProperty: StrokeWidthProperty;

    constructor(drawingService: DrawingService, private colourService: ColourService, private history: HistoryService) {
        super(drawingService);
        this.startingPos = { x: 0, y: 0 };
        this.width = 0;
        this.height = 0;
        this.shiftDown = false;
        this.lastMouseCoords = { x: 0, y: 0 };
        this.shapeType = ShapeType.Contoured;
        this.key = 'rectangle';

        this.initialize();
    }

    private initialize(): void {
        this.fillStyleProperty = new FillStyleProperty(this.colourService.getPrimaryColour());
        this.strokeStyleProperty = new StrokeStyleProperty(this.colourService.getSecondaryColour());
        this.strokeWidthProperty = new StrokeWidthProperty(this.lineWidth);

        this.colourService.primaryColourChanged.subscribe((colour: Colour) => (this.fillStyleProperty.colour = colour));
        this.colourService.secondaryColourChanged.subscribe((colour: Colour) => (this.strokeStyleProperty.colour = colour));

        this.shape = new ContouredBoxShape({ x: 0, y: 0 }, { x: 0, y: 0 }, this.lineWidth);
        this.strokeRenderer = new RectangleStrokeRenderer(this.shape, [this.strokeStyleProperty, this.strokeWidthProperty]);
        this.fillRenderer = new RectangleFillRenderer(this.shape, [this.fillStyleProperty]);
    }

    onLineWidthChanged(): void {
        if (this.strokeWidthProperty) {
            this.strokeWidthProperty.strokeWidth = this.lineWidth;
            this.shape.contourWidth = this.lineWidth;
        }
    }

    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
    }

    onToolDeselect(): void {
        this.finalize();

        this.history.isLocked = false;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.shiftDown = true;
            if (this.mouseDown) {
                this.draw(this.drawingService.previewCtx, this.lastMouseCoords.x, this.lastMouseCoords.y);
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.shiftDown = false;
            if (this.mouseDown) {
                this.draw(this.drawingService.previewCtx, this.lastMouseCoords.x, this.lastMouseCoords.y);
            }
        }
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.startingPos = this.mouseDownCoord;
            this.lastMouseCoords = this.startingPos;

            this.history.isLocked = true;
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.finalize();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.lastMouseCoords = mousePosition;
            this.draw(this.drawingService.previewCtx, mousePosition.x, mousePosition.y);
        }
    }

    private finalize(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (this.mouseDown) {
            const renderersToRegister = new Array<ShapeRenderer<BoxShape>>();

            if (this.shapeType === ShapeType.Filled || this.shapeType === ShapeType.ContouredAndFilled) {
                renderersToRegister.push(this.fillRenderer.clone());
            }

            if (this.shapeType === ShapeType.Contoured || this.shapeType === ShapeType.ContouredAndFilled) {
                renderersToRegister.push(this.strokeRenderer.clone());
            }

            this.history.do(new UserActionRenderShape(renderersToRegister, this.drawingService.baseCtx));

            this.startingPos.x = 0;
            this.startingPos.y = 0;
        }
        this.lastMouseCoords.x = 0;
        this.lastMouseCoords.y = 0;
        this.width = 0;
        this.height = 0;
        this.mouseDown = false;
    }

    private draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        this.adjustRectSize(x, y);
        this.drawRect(ctx);
    }

    adjustRectSize(x: number, y: number): void {
        this.width = x - this.startingPos.x;
        this.height = y - this.startingPos.y;
        if (this.shiftDown) {
            if (Math.abs(this.width) > Math.abs(this.height)) {
                if (this.width > 0) this.width = Math.abs(this.height);
                else this.width = -Math.abs(this.height);
            } else {
                if (this.height > 0) this.height = Math.abs(this.width);
                else this.height = -Math.abs(this.width);
            }
        }
    }

    private drawRect(ctx: CanvasRenderingContext2D): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        const shouldRenderFill = this.shapeType === ShapeType.Filled || this.shapeType === ShapeType.ContouredAndFilled;
        const shouldRenderStroke = this.shapeType === ShapeType.Contoured || this.shapeType === ShapeType.ContouredAndFilled;

        const halfStrokeWidth = this.strokeWidthProperty.strokeWidth / 2;

        this.shape.topLeft.x = this.startingPos.x + (shouldRenderStroke ? halfStrokeWidth : 0);
        this.shape.topLeft.y = this.startingPos.y + (shouldRenderStroke ? halfStrokeWidth : 0);

        this.shape.bottomRight.x = this.startingPos.x + (shouldRenderStroke ? this.width - halfStrokeWidth : this.width);
        this.shape.bottomRight.y = this.startingPos.y + (shouldRenderStroke ? this.height - halfStrokeWidth : this.height);

        if (shouldRenderFill) {
            this.fillRenderer.render(ctx);
        }

        if (shouldRenderStroke) {
            this.strokeRenderer.render(ctx);
        }
    }
}
