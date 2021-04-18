import { Injectable } from '@angular/core';
import { ILineWidthChangeListener } from '@app/app/classes/line-width-change-listener';
import { ResizableTool } from '@app/app/classes/resizable-tool';
import { Vec2 } from '@app/app/classes/vec2';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { UserActionRenderShape } from '@app/history/user-actions/user-action-render-shape';
import { LineShape } from '@app/shapes/line-shape';
import { FillStyleProperty } from '@app/shapes/properties/fill-style-property';
import { LineCapProperty } from '@app/shapes/properties/line-cap-property';
import { LineJoinProperty } from '@app/shapes/properties/line-join-property';
import { StrokeStyleProperty } from '@app/shapes/properties/stroke-style-property';
import { StrokeWidthProperty } from '@app/shapes/properties/stroke-width-property';
import { LineJointsRenderer } from '@app/shapes/renderers/line-joints-renderer';
import { LineShapeRenderer } from '@app/shapes/renderers/line-shape-renderer';
import { LineType } from '@app/shapes/types/line-type';
import { IDeselectableTool } from '@app/tools/classes/deselectable-tool';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';
@Injectable({
    providedIn: 'root',
})
export class LineService extends ResizableTool implements ISelectableTool, IDeselectableTool, ILineWidthChangeListener {
    private lineShape: LineShape = new LineShape([]);
    private lineShapeRenderer: LineShapeRenderer;
    private lineJointsRenderer: LineJointsRenderer;
    private lastMousePosition: Vec2;

    private isShiftDown: boolean = false;

    lineType: LineType = LineType.WITHOUT_JOINTS;

    private strokeWidthProperty: StrokeWidthProperty = new StrokeWidthProperty(this.lineWidth);
    private strokeColourProperty: StrokeStyleProperty;
    private jointsColourProperty: FillStyleProperty;

    constructor(drawingService: DrawingService, private colourService: ColourService, private historyService: HistoryService) {
        super(drawingService);
        this.key = 'line';
        this.jointsDiameter = LineShape.DEFAULT_JOINTS_DIAMETER;
        this.initialize();
    }

    private initialize(): void {
        this.strokeColourProperty = new StrokeStyleProperty(this.colourService.getPrimaryColour());
        this.jointsColourProperty = new FillStyleProperty(this.colourService.getSecondaryColour());

        this.lineShapeRenderer = new LineShapeRenderer(this.lineShape, [
            this.strokeWidthProperty,
            this.strokeColourProperty,
            new LineCapProperty('round'),
            new LineJoinProperty('round'),
        ]);
        this.lineJointsRenderer = new LineJointsRenderer(this.lineShape, [this.jointsColourProperty]);

        this.colourService.primaryColourChanged.subscribe((colour: Colour) => (this.strokeColourProperty.colour = colour));
        this.colourService.secondaryColourChanged.subscribe((colour: Colour) => (this.jointsColourProperty.colour = colour));
    }

    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
    }

    onLineWidthChanged(): void {
        if (this.strokeWidthProperty) {
            this.strokeWidthProperty.strokeWidth = this.lineWidth;
        }
    }

    set jointsDiameter(jointsDiameter: number) {
        this.lineShape.jointsDiameter = jointsDiameter;
    }

    get jointsDiameter(): number {
        return this.lineShape.jointsDiameter;
    }

    onMouseClick(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            const mousePosition: Vec2 = this.lineShape.getFinalMousePosition(this.getPositionFromMouse(event), this.isShiftDown);
            this.lineShape.vertices.push(mousePosition);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.lineShapeRenderer.render(this.drawingService.previewCtx);
            if (this.lineType === LineType.WITH_JOINTS) {
                this.lineJointsRenderer.render(this.drawingService.previewCtx);
            }

            this.historyService.isLocked = true;
        }
    }

    onMouseDoubleClick(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            this.lineShape.vertices.length -= 2;

            this.finalizeLine();
            this.renderFinalizedLine();
        }
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition: Vec2 = this.getPositionFromMouse(event);
        this.lastMousePosition = mousePosition;
        this.previewLine(this.lineShape.getFinalMousePosition(mousePosition, this.isShiftDown));
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.isShiftDown = true;
            this.previewLine(this.lastMousePosition);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        switch (event.key) {
            case 'Shift':
                this.isShiftDown = false;
                this.previewLine(this.lastMousePosition);
                break;
            case 'Escape':
                this.lineShape.clear();
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                break;
            case 'Backspace':
                if (this.lineShape.vertices.length > 1) {
                    this.lineShape.vertices.pop();

                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.lineShape.vertices.push(this.lastMousePosition);
                    this.lineShapeRenderer.render(this.drawingService.previewCtx);
                    if (this.lineType === LineType.WITH_JOINTS) {
                        this.lineJointsRenderer.render(this.drawingService.previewCtx);
                    }
                    this.lineShape.vertices.pop();
                }
                break;
        }
    }

    finalizeLine(): void {
        if (this.lineShape.isCloseableWith(this.lastMousePosition)) {
            this.lineShape.close();
        } else {
            this.lineShape.vertices.push(this.lineShape.getFinalMousePosition(this.lastMousePosition, this.isShiftDown));
        }
    }

    renderFinalizedLine(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        this.historyService.do(
            new UserActionRenderShape(
                this.lineType === LineType.WITH_JOINTS
                    ? [this.lineShapeRenderer.clone(), this.lineJointsRenderer.clone()]
                    : [this.lineShapeRenderer.clone()],
                this.drawingService.baseCtx,
            ),
        );

        this.lineShape.clear();
    }

    previewLine(mousePosition: Vec2): void {
        const isShapeBeingDrawn = this.lineShape.vertices.length !== 0;
        if (isShapeBeingDrawn) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            this.lineShape.vertices.push(this.lineShape.getFinalMousePosition(mousePosition, this.isShiftDown));
            this.lineShapeRenderer.render(this.drawingService.previewCtx);
            if (this.lineType === LineType.WITH_JOINTS) {
                this.lineJointsRenderer.render(this.drawingService.previewCtx);
            }
            this.lineShape.vertices.pop();
        }
    }

    onToolDeselect(): void {
        this.finalizeLine();
        this.renderFinalizedLine();
    }
}
