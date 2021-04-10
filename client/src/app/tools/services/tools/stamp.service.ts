import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/app/classes/shape-tool';
import { Vec2 } from '@app/app/classes/vec2';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { UserActionRenderShape } from '@app/history/user-actions/user-action-render-shape';
import { ImageSizeProperty } from '@app/shapes/properties/image-size-property';
import { ShapeRenderer } from '@app/shapes/renderers/shape-renderer';
import { StampRenderer } from '@app/shapes/renderers/stamp-renderer';
import { StampShape } from '@app/shapes/stamp-shape';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';

const PI_TO_DEGREE = 180;
const MAX_DEGREE = 360;
const MAX_DEGREES_INCREMENT = 15;
const MIN_DEGREES_INCREMENT = 1;
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
    imagePaths: string[];
    toBorder: boolean[] = [];
    constructor(drawingService: DrawingService, private history: HistoryService) {
        super(drawingService);
        this.key = 'stamp';
        this.imagePaths = [
            './assets/icons/spade-symbol.svg',
            './assets/icons/heart.svg',
            './assets/icons/clubs.svg',
            './assets/icons/diamond.svg',
            './assets/icons/cancel.svg',
        ];
        this.shape = new StampShape({ x: 0, y: 0 }, { x: 0, y: 0 }, new Image(), this.angle, this.imagePaths[0]);
        this.imageSizeProperty = new ImageSizeProperty(this.imageSize);
        this.renderer = new StampRenderer(this.shape, [this.imageSizeProperty]);
        for (let i = 0; i < this.imagePaths.length; i++) {
            this.toBorder.push(false);
        }
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
        this.degree = degrees;
    }
    rollAngle(event: WheelEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        let degreesToAdd = 0;
        const scrollValue = event.deltaY;
        if (scrollValue > 0) {
            degreesToAdd = event.altKey ? MIN_DEGREES_INCREMENT : MAX_DEGREES_INCREMENT;
            this.degree -= degreesToAdd;
            this.angle -= (degreesToAdd * Math.PI) / PI_TO_DEGREE;
        } else {
            degreesToAdd = event.altKey ? MIN_DEGREES_INCREMENT : MAX_DEGREES_INCREMENT;
            this.degree += degreesToAdd;
            this.angle += (degreesToAdd * Math.PI) / PI_TO_DEGREE;
        }
        this.degree %= MAX_DEGREE;
        if (this.degree < 0) this.degree += MAX_DEGREE;
        this.shape.angle = this.angle;
        this.renderer.render(this.drawingService.previewCtx);
    }

    finalize(): void {
        if (this.mouseDown) {
            const RENDERS = new Array<ShapeRenderer<StampShape>>();
            RENDERS.push(this.renderer.clone());
            this.shape.image.onload = () => this.history.do(new UserActionRenderShape(RENDERS, this.drawingService.baseCtx));
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDown = false;
    }
    onToolDeselect(): void {
        this.history.isLocked = false;
        this.finalize();
    }
    selectStamp(event: MouseEvent, index: number): void {
        for (let i = 0; i < this.imagePaths.length; i++) {
            this.toBorder[i] = false;
        }
        this.toBorder[index] = true;
        this.shape.src = (event.target as HTMLImageElement).src;
        this.shape.image = new Image();
        this.shape.image.src = this.shape.src;
        console.log(this.toBorder[0]);
    }
}
