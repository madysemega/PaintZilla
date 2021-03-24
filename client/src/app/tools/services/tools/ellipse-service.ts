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
import { EllipseFillRenderer } from '@app/shapes/renderers/ellipse-fill-renderer';
import { EllipseStrokeRenderer } from '@app/shapes/renderers/ellipse-stroke-renderer';
import { ShapeRenderer } from '@app/shapes/renderers/shape-renderer';
import { IDeselectableTool } from '@app/tools/classes/deselectable-tool';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends ShapeTool implements ISelectableTool, IDeselectableTool, ILineWidthChangeListener {
    private shape: ContouredBoxShape;
    private strokeRenderer: EllipseStrokeRenderer;
    private fillRenderer: EllipseFillRenderer;

    private strokeWidthProperty: StrokeWidthProperty;
    private strokeStyleProperty: StrokeStyleProperty;
    private fillStyleProperty: FillStyleProperty;

    startPoint: Vec2 = { x: 0, y: 0 };
    lastMousePosition: Vec2;

    isShiftDown: boolean = false;

    constructor(drawingService: DrawingService, private colourService: ColourService, private history: HistoryService) {
        super(drawingService);
        this.shapeType = ShapeType.Contoured;
        this.key = 'ellipse';

        this.initializeShape();
        this.initializeProperties();
        this.initializeRenderers();
    }

    private initializeShape(): void {
        this.shape = new ContouredBoxShape({ x: 0, y: 0 }, { x: 0, y: 0 }, this.lineWidth);
    }

    private initializeProperties(): void {
        this.strokeWidthProperty = new StrokeWidthProperty(this.lineWidth);
        this.strokeStyleProperty = new StrokeStyleProperty(this.colourService.getSecondaryColour());
        this.fillStyleProperty = new FillStyleProperty(this.colourService.getPrimaryColour());

        this.colourService.secondaryColourChanged.subscribe((colour: Colour) => (this.strokeStyleProperty.colour = colour));
        this.colourService.primaryColourChanged.subscribe((colour: Colour) => (this.fillStyleProperty.colour = colour));
    }

    private initializeRenderers(): void {
        this.strokeRenderer = new EllipseStrokeRenderer(this.shape, [this.strokeWidthProperty, this.strokeStyleProperty]);
        this.fillRenderer = new EllipseFillRenderer(this.shape, [this.fillStyleProperty]);
    }

    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
    }

    onToolDeselect(): void {
        this.history.isLocked = false;
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
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.lastMousePosition = this.mouseDownCoord;
            this.startPoint = this.mouseDownCoord;

            this.history.isLocked = true;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.lastMousePosition = mousePosition;
            this.drawEllipse(this.drawingService.baseCtx, this.startPoint, mousePosition);

            const renderersToRegister = new Array<ShapeRenderer<BoxShape>>();

            if (this.shapeType === ShapeType.Filled || this.shapeType === ShapeType.ContouredAndFilled) {
                renderersToRegister.push(this.fillRenderer.clone());
            }

            if (this.shapeType === ShapeType.Contoured || this.shapeType === ShapeType.ContouredAndFilled) {
                renderersToRegister.push(this.strokeRenderer.clone());
            }

            this.history.register(new UserActionRenderShape(renderersToRegister, this.drawingService.baseCtx));
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.lastMousePosition = mousePosition;

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawEllipse(this.drawingService.previewCtx, this.startPoint, mousePosition);
            this.drawPerimeter(this.drawingService.previewCtx, this.startPoint, mousePosition);
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.isShiftDown = true;

            if (this.mouseDown) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawEllipse(this.drawingService.previewCtx, this.startPoint, this.lastMousePosition);
                this.drawPerimeter(this.drawingService.previewCtx, this.startPoint, this.lastMousePosition);
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.isShiftDown = false;

            if (this.mouseDown) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawEllipse(this.drawingService.previewCtx, this.startPoint, this.lastMousePosition);
                this.drawPerimeter(this.drawingService.previewCtx, this.startPoint, this.lastMousePosition);
            }
        }
    }

    getSquareAdjustedPerimeter(startPoint: Vec2, endPoint: Vec2): Vec2 {
        const endPointWithRespectToStartPoint: Vec2 = {
            x: endPoint.x - startPoint.x,
            y: endPoint.y - startPoint.y,
        };

        const endPointShortestComponent = Math.min(Math.abs(endPointWithRespectToStartPoint.x), Math.abs(endPointWithRespectToStartPoint.y));

        const isXComponentPositive: boolean = startPoint.x < endPoint.x;
        const isYComponentPositive: boolean = startPoint.y < endPoint.y;

        return {
            x: startPoint.x + (isXComponentPositive ? endPointShortestComponent : -endPointShortestComponent),
            y: startPoint.y + (isYComponentPositive ? endPointShortestComponent : -endPointShortestComponent),
        };
    }

    drawPerimeter(ctx: CanvasRenderingContext2D, startPoint: Vec2, endPoint: Vec2): void {
        if (this.isShiftDown) {
            endPoint = this.getSquareAdjustedPerimeter(startPoint, endPoint);
        }

        this.drawRectangle(ctx, startPoint, endPoint);
    }

    drawRectangle(ctx: CanvasRenderingContext2D, startPoint: Vec2, endPoint: Vec2): void {
        const DASH_NUMBER = 8;

        const topLeft: Vec2 = {
            x: Math.min(startPoint.x, endPoint.x),
            y: Math.min(startPoint.y, endPoint.y),
        };

        const dimensions: Vec2 = {
            x: Math.abs(endPoint.x - startPoint.x),
            y: Math.abs(endPoint.y - startPoint.y),
        };

        const shouldRenderFill = this.shapeType === ShapeType.Filled;
        const halfStrokeWidth = this.strokeWidthProperty.strokeWidth / 2;

        if(shouldRenderFill){
            topLeft.x += halfStrokeWidth;
            topLeft.y += halfStrokeWidth;
            dimensions.x -= halfStrokeWidth*2;
            dimensions.y -= halfStrokeWidth*2;
        }

        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([DASH_NUMBER]);
        ctx.strokeStyle = '#888';
        ctx.rect(topLeft.x, topLeft.y, dimensions.x, dimensions.y);
        ctx.stroke();
        ctx.restore();
    }

    drawEllipse(ctx: CanvasRenderingContext2D, startPoint: Vec2, endPoint: Vec2): void {
        if (this.isShiftDown) {
            endPoint = this.getSquareAdjustedPerimeter(startPoint, endPoint);
        }

        const shouldRenderFill = this.shapeType === ShapeType.Filled || this.shapeType === ShapeType.ContouredAndFilled;
        const shouldRenderStroke = this.shapeType === ShapeType.Contoured || this.shapeType === ShapeType.ContouredAndFilled;

        const halfStrokeWidth = this.strokeWidthProperty.strokeWidth / 2;

        this.shape.topLeft.x = startPoint.x + (shouldRenderStroke ? halfStrokeWidth : 0);
        this.shape.topLeft.y = startPoint.y + (shouldRenderStroke ? halfStrokeWidth : 0);

        this.shape.bottomRight.x = endPoint.x - (shouldRenderStroke ? halfStrokeWidth : 0);
        this.shape.bottomRight.y = endPoint.y - (shouldRenderStroke ? halfStrokeWidth : 0);

        if (shouldRenderFill) {
            this.fillRenderer.render(ctx);
        }

        if (shouldRenderStroke) {
            this.strokeRenderer.render(ctx);
        }
    }
}
