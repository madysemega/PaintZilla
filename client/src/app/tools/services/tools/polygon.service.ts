import { Injectable } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ShapeTool } from '@app/app/classes/shape-tool';
import { ShapeType } from '@app/app/classes/shape-type';
import { Vec2 } from '@app/app/classes/vec2';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { UserActionRenderShape } from '@app/history/user-actions/user-action-render-shape';
import { PolygonShape } from '@app/shapes/polygon-shape';
import { FillStyleProperty } from '@app/shapes/properties/fill-style-property';
import { StrokeStyleProperty } from '@app/shapes/properties/stroke-style-property';
import { StrokeWidthProperty } from '@app/shapes/properties/stroke-width-property';
import { PolygonFillRenderer } from '@app/shapes/renderers/polygon-fill-renderer';
import { PolygonStrokeRenderer } from '@app/shapes/renderers/polygon-stroke-renderer';
import { ShapeRenderer } from '@app/shapes/renderers/shape-renderer';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';

@Injectable({
    providedIn: 'root',
})
export class PolygonService extends ShapeTool implements ISelectableTool {
    private readonly CIRCLE_MAX_ANGLE: number = 360;
    private readonly TRIANGLE_SIDES: number = 3;

    private strokeRenderer: PolygonStrokeRenderer;
    private fillRenderer: PolygonFillRenderer;

    startPoint: Vec2 = { x: 0, y: 0 };
    lastMousePosition: Vec2 = { x: 0, y: 0 };

    numberSides: number;
    isToDrawPerim: boolean;

    private shape: PolygonShape;

    strokeWidthProperty: StrokeWidthProperty;
    colourProperty: StrokeStyleProperty;
    strokeStyleProperty: StrokeStyleProperty;
    fillStyleProperty: FillStyleProperty;

    constructor(drawingService: DrawingService, private colourService: ColourService, private history: HistoryService) {
        super(drawingService);
        this.shapeType = ShapeType.Contoured;
        this.key = 'polygon';
        this.numberSides = this.TRIANGLE_SIDES;
        this.isToDrawPerim = true;
        this.initialize();
        this.initializeProperties();
        this.initializeRenderers();
    }

    private initialize(): void {
        this.shape = new PolygonShape({ x: 0, y: 0 }, { x: 0, y: 0 }, this.TRIANGLE_SIDES, this.lineWidth);
    }

    private initializeProperties(): void {
        this.strokeWidthProperty = new StrokeWidthProperty(this.lineWidth);
        this.strokeStyleProperty = new StrokeStyleProperty(this.colourService.getSecondaryColour());
        this.fillStyleProperty = new FillStyleProperty(this.colourService.getPrimaryColour());

        this.colourService.secondaryColourChanged.subscribe((colour: Colour) => (this.strokeStyleProperty.colour = colour));
        this.colourService.primaryColourChanged.subscribe((colour: Colour) => (this.fillStyleProperty.colour = colour));
    }

    private initializeRenderers(): void {
        this.strokeRenderer = new PolygonStrokeRenderer(this.shape, [this.strokeWidthProperty, this.strokeStyleProperty]);
        this.fillRenderer = new PolygonFillRenderer(this.shape, [this.fillStyleProperty]);
    }

    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
    }

    onToolDeselect(): void {
        this.history.isLocked = false;
        this.finalize();
    }

    onLineWidthChanged(): void {
        if (this.strokeWidthProperty) {
            this.strokeWidthProperty.strokeWidth = this.lineWidth;
            this.shape.contourWidth = this.lineWidth;
        }
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;

        if (this.mouseDown) {
            this.isToDrawPerim = true;
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.lastMousePosition = this.mouseDownCoord;
            this.startPoint = this.mouseDownCoord;
            this.history.isLocked = true;
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.finalize();
    }

    finalize(): void {
        if (this.mouseDown) {
            this.isToDrawPerim = false;

            const renderersToRegister = new Array<ShapeRenderer<PolygonShape>>();

            if (this.shapeType === ShapeType.Filled || this.shapeType === ShapeType.ContouredAndFilled) {
                renderersToRegister.push(this.fillRenderer.clone());
            }

            if (this.shapeType === ShapeType.Contoured || this.shapeType === ShapeType.ContouredAndFilled) {
                renderersToRegister.push(this.strokeRenderer.clone());
            }

            this.history.do(new UserActionRenderShape(renderersToRegister, this.drawingService.baseCtx));
        }

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.lastMousePosition = this.getPositionFromMouse(event);
            this.drawPolygon(this.drawingService.previewCtx, this.startPoint, this.lastMousePosition);
        }
    }

    changeNbSides(event: MatSliderChange): void {
        this.numberSides = event.value as number;
    }

    squarePoint(startPoint: Vec2, endPoint: Vec2): number {
        const COMP_X = endPoint.x - startPoint.x;
        const COMP_Y = endPoint.y - startPoint.y;
        const COMP = Math.abs(COMP_X) < Math.abs(COMP_Y) ? COMP_X : COMP_Y;
        return COMP;
    }

    getSquareEndPoint(startPoint: Vec2, endPoint: Vec2): Vec2 {
        const COMP = this.squarePoint(startPoint, endPoint);
        const X_COMPONENT_POS: boolean = COMP * (endPoint.x - startPoint.x) >= 0;
        const Y_COMPONENT_POS: boolean = COMP * (endPoint.y - startPoint.y) >= 0;
        return { x: startPoint.x + (X_COMPONENT_POS ? COMP : -COMP), y: startPoint.y + (Y_COMPONENT_POS ? COMP : -COMP) };
    }

    drawPolygon(ctx: CanvasRenderingContext2D, startPoint: Vec2, endPoint: Vec2): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        const shouldRenderStroke = this.shapeType === ShapeType.Contoured || this.shapeType === ShapeType.ContouredAndFilled;
        const shouldRenderFill = this.shapeType === ShapeType.Filled || this.shapeType === ShapeType.ContouredAndFilled;

        endPoint = this.getSquareEndPoint(startPoint, endPoint);

        const CENTER_POINT: Vec2 = { x: (startPoint.x + endPoint.x) / 2, y: (startPoint.y + endPoint.y) / 2 };
        const HALF_STROKE_WIDTH = this.strokeWidthProperty.strokeWidth / 2;

        this.shape.topLeft.x = startPoint.x + (shouldRenderStroke ? HALF_STROKE_WIDTH : 0);
        this.shape.topLeft.y = startPoint.y + (shouldRenderStroke ? HALF_STROKE_WIDTH : 0);
        this.shape.bottomRight.x = endPoint.x - (shouldRenderStroke ? HALF_STROKE_WIDTH : 0);
        this.shape.bottomRight.y = endPoint.y - (shouldRenderStroke ? HALF_STROKE_WIDTH : 0);
        this.shape.numberSides = this.numberSides;

        const SIZE = this.squarePoint(CENTER_POINT, this.shape.bottomRight);

        if (shouldRenderFill) {
            this.fillRenderer.render(ctx);
        }
        if (shouldRenderStroke) {
            this.strokeRenderer.render(ctx);
        }
        if (this.isToDrawPerim) {
            this.drawPerimeter(ctx, CENTER_POINT, Math.abs(SIZE));
        }
    }

    drawPerimeter(ctx: CanvasRenderingContext2D, center: Vec2, size: number): void {
        const shouldRenderFill = this.shapeType === ShapeType.Filled;
        const DASH_NUMBER = 8;
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([DASH_NUMBER]);
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1;

        const STROKE_DISTANCE =
            this.lineWidth / Math.sin((Math.PI + Math.PI * (this.numberSides - this.TRIANGLE_SIDES)) / (2 * this.numberSides)) / 2;

        if (shouldRenderFill && size > 0) size = Math.abs(size - this.lineWidth / 2);
        else if (shouldRenderFill) size = Math.abs(size + this.lineWidth / 2);
        else if (!shouldRenderFill && size > 0) size = Math.abs(size + STROKE_DISTANCE);
        else size = Math.abs(size - STROKE_DISTANCE);

        ctx.ellipse(center.x, center.y, size, size, 0, 0, this.CIRCLE_MAX_ANGLE);
        ctx.stroke();
        ctx.restore();
    }
}
