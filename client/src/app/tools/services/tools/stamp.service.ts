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
import { StampShape } from '@app/shapes/stamp-shape';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';

const PI_TO_DEGREE = 180;
@Injectable({
    providedIn: 'root',
})
export class StampService extends ShapeTool implements ISelectableTool {
    private renderer: StampRenderer;
    private shape: StampShape;
    lastMousePosition: Vec2 = { x: 0, y: 0 };
    angle: number = 0;
    degree: number = 0;
    imageSize: number = 10;
    imageSizeProperty: ImageSizeProperty;
    mouseDown: boolean;
    constructor(drawingService: DrawingService, private history: HistoryService) {
        super(drawingService);
        this.key = 'stamp';
        this.shape = new StampShape({ x: 0, y: 0 }, { x: 0, y: 0 }, new Image(), this.angle);
        this.imageSizeProperty = new ImageSizeProperty(this.imageSize);
        this.renderer = new StampRenderer(this.shape, [this.imageSizeProperty]);
    }
    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.NONE);
    }
    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.shape.topLeft = this.mouseDownCoord;
            this.shape.bottomRight = { x: this.shape.topLeft.x + this.imageSize, y: this.shape.topLeft.y + this.imageSize };
            this.shape.angle = this.angle;
            this.history.isLocked = true;
        }
    }
    onMouseUp(event: MouseEvent): void {
        this.finalize();
    }
    onMouseMove(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.shape.topLeft = this.mouseDownCoord;
        this.shape.bottomRight = { x: this.shape.topLeft.x + this.imageSize, y: this.shape.topLeft.y + this.imageSize };
        this.shape.angle = this.angle;
        this.renderer.render(this.drawingService.previewCtx);
    }
    changeSize(size: number): void {
        this.imageSize = size;
        this.imageSizeProperty.imageSize = size;
    }
    changeAngle(degrees: number): void {
        this.angle = (degrees * Math.PI) / PI_TO_DEGREE;
        console.log(this.angle);
    }
    finalize(): void {
        if (this.mouseDown) {
            const RENDERS = new Array<ShapeRenderer<BoxShape>>();
            RENDERS.push(this.renderer.clone());
            this.history.do(new UserActionRenderShape(RENDERS, this.drawingService.baseCtx));
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDown = false;
    }
    onToolDeselect(): void {
        this.history.isLocked = false;
        this.finalize();
    }
}
