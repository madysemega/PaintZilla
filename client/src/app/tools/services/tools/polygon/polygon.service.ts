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
import * as Constants from '@app/tools/services/tools/polygon/polygon-constants';

@Injectable({
    providedIn: 'root',
})
export class PolygonService extends ShapeTool implements ISelectableTool {
    startPoint: Vec2 = { x: 0, y: 0 };
    lastMousePosition: Vec2 = { x: 0, y: 0 };

    numberSides: number = Constants.TRIANGLE_SIDES;
    isToDrawPerim: boolean = true;

    private shape: PolygonShape = new PolygonShape({ x: 0, y: 0 }, { x: 0, y: 0 }, Constants.TRIANGLE_SIDES, this.lineWidth);

    strokeWidthProperty: StrokeWidthProperty = new StrokeWidthProperty(this.lineWidth);
    strokeStyleProperty: StrokeStyleProperty = new StrokeStyleProperty(this.colourService.getSecondaryColour());
    fillStyleProperty: FillStyleProperty = new FillStyleProperty(this.colourService.getPrimaryColour());
    private strokeRenderer: PolygonStrokeRenderer = new PolygonStrokeRenderer(this.shape, [this.strokeWidthProperty, this.strokeStyleProperty]);
    private fillRenderer: PolygonFillRenderer = new PolygonFillRenderer(this.shape, [this.fillStyleProperty]);
    constructor(drawingService: DrawingService, private colourService: ColourService, private history: HistoryService) {
        super(drawingService);
        this.shapeType = ShapeType.Contoured;
        this.key = 'polygon';
        this.initializeProperties();
    }

    private initializeProperties(): void {
        this.colourService.secondaryColourChanged.subscribe((colour: Colour) => (this.strokeStyleProperty.colour = colour));
        this.colourService.primaryColourChanged.subscribe((colour: Colour) => (this.fillStyleProperty.colour = colour));
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

        endPoint = this.getSquareEndPoint(startPoint, endPoint);

        const CENTER_POINT: Vec2 = { x: (startPoint.x + endPoint.x) / 2, y: (startPoint.y + endPoint.y) / 2 };
        this.setPolygonAttributes(startPoint, endPoint);

        this.renderPolygon(ctx);

        const SIZE = this.squarePoint(CENTER_POINT, this.shape.bottomRight);
        this.drawPerimeter(ctx, CENTER_POINT, Math.abs(SIZE));
    }

    renderPolygon(ctx: CanvasRenderingContext2D): void {
        const SHOULD_RENDER_STROKE = this.shapeType === ShapeType.Contoured || this.shapeType === ShapeType.ContouredAndFilled;
        const SHOULD_RENDER_FILL = this.shapeType === ShapeType.Filled || this.shapeType === ShapeType.ContouredAndFilled;
        if (SHOULD_RENDER_FILL) {
            this.fillRenderer.render(ctx);
        }
        if (SHOULD_RENDER_STROKE) {
            this.strokeRenderer.render(ctx);
        }
    }

    setPolygonAttributes(startPoint: Vec2, endPoint: Vec2): void {
        const SHOULD_RENDER_STROKE = this.shapeType === ShapeType.Contoured || this.shapeType === ShapeType.ContouredAndFilled;
        const HALF_STROKE_WIDTH = this.strokeWidthProperty.strokeWidth / 2;

        this.shape.topLeft.x = startPoint.x + (SHOULD_RENDER_STROKE ? HALF_STROKE_WIDTH : 0);
        this.shape.topLeft.y = startPoint.y + (SHOULD_RENDER_STROKE ? HALF_STROKE_WIDTH : 0);
        this.shape.bottomRight.x = endPoint.x - (SHOULD_RENDER_STROKE ? HALF_STROKE_WIDTH : 0);
        this.shape.bottomRight.y = endPoint.y - (SHOULD_RENDER_STROKE ? HALF_STROKE_WIDTH : 0);
        this.shape.numberSides = this.numberSides;
    }

    drawPerimeter(ctx: CanvasRenderingContext2D, center: Vec2, size: number): void {
        if (!this.isToDrawPerim) return;
        ctx.save();
        ctx.beginPath();
        size = this.setPerimeterAttributes(ctx, size);
        ctx.ellipse(center.x, center.y, size, size, 0, 0, Constants.CIRCLE_MAX_ANGLE);
        ctx.stroke();
        ctx.restore();
    }
    setPerimeterAttributes(ctx: CanvasRenderingContext2D, size: number): number {
        const DASH_NUMBER = 8;
        ctx.setLineDash([DASH_NUMBER]);
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1;
        let strokeDistance =
            this.lineWidth / Math.sin((Math.PI + Math.PI * (this.numberSides - Constants.TRIANGLE_SIDES)) / (2 * this.numberSides)) / 2;

        const SHOULD_RENDER_FILL = this.shapeType === ShapeType.Filled;
        const SUB_HALF_LINE_WIDTH = SHOULD_RENDER_FILL && size > 0 ? 1 : 0;
        const ADD_HALF_LINE_WIDTH = SHOULD_RENDER_FILL && size <= 0 ? 1 : 0;
        const ADD_STROKE_DISTANCE = !SHOULD_RENDER_FILL && size > 0 ? 1 : 0;
        const SUB_STROKE_DISTANCE = !SHOULD_RENDER_FILL && size <= 0 ? 1 : 0;
        const HALF_LINE_WIDTH = (ADD_HALF_LINE_WIDTH * this.lineWidth) / 2 - (SUB_HALF_LINE_WIDTH * this.lineWidth) / 2;
        strokeDistance = ADD_STROKE_DISTANCE * strokeDistance - SUB_STROKE_DISTANCE * strokeDistance;

        return Math.abs(size + HALF_LINE_WIDTH + strokeDistance);
    }
}
