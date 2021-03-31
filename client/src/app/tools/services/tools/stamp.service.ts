import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/app/classes/shape-tool';
import { Vec2 } from '@app/app/classes/vec2';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { UserActionRenderShape } from '@app/history/user-actions/user-action-render-shape';
import { BoxShape } from '@app/shapes/box-shape';
import { ImageSizeProperty } from '@app/shapes/properties/image-size-property';
import { ShapeRenderer } from '@app/shapes/renderers/shape-renderer';
import { StampRenderer } from '@app/shapes/renderers/stamp-renderer';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';

@Injectable({
    providedIn: 'root',
})
export class StampService extends ShapeTool implements ISelectableTool {
    private renderer: StampRenderer;
    private shape: BoxShape;
    lastMousePosition: Vec2 = { x: 0, y: 0 };
    imageSize: number = 10;
    imageSizeProperty: ImageSizeProperty;
    mouseDown: boolean;
    constructor(drawingService: DrawingService, private history: HistoryService) {
        super(drawingService);
        this.key = 'stamp';
        this.imageSizeProperty = new ImageSizeProperty(this.imageSize);
        this.shape = new BoxShape({ x: 0, y: 0 }, { x: 0, y: 0 });
        this.renderer = new StampRenderer(this.shape, [this.imageSizeProperty]);
    }
    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
    }
    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.shape.topLeft = this.getPositionFromMouse(event);
            this.shape.bottomRight = { x: this.shape.topLeft.x + this.imageSize, y: this.shape.topLeft.y + this.imageSize };
            this.history.isLocked = true;
            this.finalize();
        }
    }
    changeSize(size: number): void {
        this.imageSize = size;
        this.imageSizeProperty.imageSize = size;
    }
    finalize(): void {
        if (this.mouseDown) {
            const RENDERS = new Array<ShapeRenderer<BoxShape>>();
            RENDERS.push(this.renderer.clone());
            this.history.do(new UserActionRenderShape(RENDERS, this.drawingService.baseCtx));
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        this.mouseDown = false;
    }
    onToolDeselect(): void {
        this.history.isLocked = false;
        this.finalize();
    }
}
