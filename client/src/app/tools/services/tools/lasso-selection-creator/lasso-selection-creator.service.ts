import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { LineShape } from '@app/shapes/line-shape';
import { LineDashProperty } from '@app/shapes/properties/line-dash-property';
import { LineShapeRenderer } from '@app/shapes/renderers/line-shape-renderer';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ClipboardService } from '@app/tools/services/selection/clipboard/clipboard.service';
import { LassoSelectionHelperService } from '@app/tools/services/selection/lasso/lasso-selection-helper.service';
import { LassoSelectionManipulatorService } from '@app/tools/services/selection/lasso/lasso-selection-manipulator.service';
import { SelectionCreatorService } from '@app/tools/services/selection/selection-base/selection-creator.service';
import * as Constants from './lasso-selection-creator.constants';

@Injectable({
    providedIn: 'root',
})
export class LassoSelectionCreatorService extends SelectionCreatorService {
    private shape: LineShape;
    private renderer: LineShapeRenderer;

    wasBeingManipulated: boolean;

    constructor(
        drawingService: DrawingService,
        selectionManipulator: LassoSelectionManipulatorService,
        public selectionHelper: LassoSelectionHelperService,
        private clipboard: ClipboardService,
    ) {
        super(drawingService, selectionManipulator, selectionHelper, clipboard);
        this.key = 'lasso-selection';

        this.shape = new LineShape([]);
        this.renderer = new LineShapeRenderer(this.shape, [new LineDashProperty([Constants.DASH_SIZE])]);

        this.isShiftDown = false;
        this.wasBeingManipulated = false;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;

        if (this.isSelectionBeingManipulated()) {
            this.selectionManipulator.onMouseDown(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.isSelectionBeingManipulated()) {
            this.selectionManipulator.onMouseUp(event);
        }

        this.mouseDown = false;
    }

    onMouseClick(event: MouseEvent): void {
        if (this.isSelectionBeingManipulated()) return;
        else if (this.wasBeingManipulated) {
            this.wasBeingManipulated = false;
            return;
        }

        if (event.button === MouseButton.Left) {
            const realMousePosition = this.getPositionFromMouse(event);
            const ajustedMousePosition = this.shape.getFinalMousePosition(realMousePosition, this.isShiftDown);

            if (this.shape.isCloseableWith(ajustedMousePosition)) {
                this.wasBeingManipulated = true;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.shape.close();
                this.shape.close();
                this.createSelection();
            } else {
                this.shape.vertices.push(ajustedMousePosition);
                this.drawSelectionOutline();
            }
        }
    }

    onMouseMove(event: MouseEvent): void {
        const realMousePosition = this.getPositionFromMouse(event);
        const ajustedMousePosition = this.shape.getFinalMousePosition(realMousePosition, this.isShiftDown);

        if (this.isSelectionBeingManipulated()) {
            this.selectionManipulator.onMouseMove(event);
            return;
        }

        this.lastMousePosition = realMousePosition;

        this.shape.vertices.push(ajustedMousePosition);
        this.drawSelectionOutline();
        this.shape.vertices.pop();
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.isSelectionBeingManipulated()) {
            this.selectionManipulator.onKeyDown(event);
            return;
        }

        if (event.key === 'Shift') {
            this.isShiftDown = true;
            this.drawSelectionOutline();
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.isSelectionBeingManipulated()) {
            this.selectionManipulator.onKeyUp(event);
            return;
        }

        switch (event.key) {
            case 'Shift':
                this.isShiftDown = false;
                this.drawSelectionOutline();
                break;
            case 'Escape':
                this.shape.clear();
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                break;
            case 'Backspace':
                if (this.shape.vertices.length > 1) {
                    this.shape.vertices.pop();

                    this.shape.vertices.push(this.lastMousePosition);
                    this.drawSelectionOutline();
                    this.shape.vertices.pop();
                }
                break;
        }
    }

    drawSelectionOutline(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.renderer.render(this.drawingService.previewCtx);
    }

    createSelection(): void {
        if (this.shape.vertices.length > 0) {
            const verticesBounds = [this.findTopLeft(this.shape.vertices) as Vec2, this.findBottomRight(this.shape.vertices) as Vec2];
            const verticesBundle = verticesBounds.concat((this.shape.clone() as LineShape).vertices);

            this.selectionHelper.setIsSelectionBeingManipulated(true);
            this.selectionManipulator.initialize(verticesBundle);
            this.clipboard.applyWhiteFill = true;

            this.shape.clear();
        }
    }

    isSelectionBeingManipulated(): boolean {
        return this.selectionHelper.isSelectionBeingManipulated.getValue();
    }

    resetProperties(): void {
        this.shape.clear();
        this.lastMousePosition = { x: 0, y: 0 };
        this.mouseDown = false;
        this.isShiftDown = false;
        this.wasBeingManipulated = false;
    }

    private findTopLeft(vertices: Vec2[]): Vec2 | undefined {
        if (vertices.length === 0) return undefined;

        const topLeft = { x: vertices[0].x, y: vertices[0].y };

        for (let i = 1; i < vertices.length; ++i) {
            const vertex = vertices[i];

            if (vertex.x < topLeft.x) {
                topLeft.x = vertex.x;
            }

            if (vertex.y < topLeft.y) {
                topLeft.y = vertex.y;
            }
        }

        return topLeft;
    }

    private findBottomRight(vertices: Vec2[]): Vec2 | undefined {
        if (vertices.length === 0) return undefined;

        const bottomRight = { x: vertices[0].x, y: vertices[0].y };

        for (let i = 1; i < vertices.length; ++i) {
            const vertex = vertices[i];

            if (vertex.x > bottomRight.x) {
                bottomRight.x = vertex.x;
            }

            if (vertex.y > bottomRight.y) {
                bottomRight.y = vertex.y;
            }
        }

        return bottomRight;
    }
}
