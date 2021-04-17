import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/app/classes/shape-tool';
import * as CommonConstants from '@app/common-constants';
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
import * as Constants from '@app/tools/services/tools/stamp/stamp-constants';

@Injectable({
    providedIn: 'root',
})
export class StampService extends ShapeTool implements ISelectableTool {
    angle: number = 0;
    degree: number = 0;
    imagePaths: string[] = [
        './assets/icons/spade-symbol.svg',
        './assets/icons/heart.svg',
        './assets/icons/clubs.svg',
        './assets/icons/diamond.svg',
        './assets/icons/cancel.svg',
    ];
    private shape: StampShape = new StampShape({ x: 0, y: 0 }, { x: 0, y: 0 }, new Image(), this.angle, this.imagePaths[0]);
    imageSize: number = Constants.MIN_IMAGE_SIZE;
    imageSizeProperty: ImageSizeProperty = new ImageSizeProperty(this.imageSize);
    mouseDown: boolean;
    toBorder: boolean[] = new Array(this.imagePaths.length).fill(false);
    private renderer: StampRenderer = new StampRenderer(this.shape, [this.imageSizeProperty]);
    constructor(drawingService: DrawingService, private history: HistoryService) {
        super(drawingService);
        this.key = 'stamp';
        this.toBorder[0] = true;
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
        this.angle = (degrees * Math.PI) / Constants.PI_TO_DEGREE;
        this.degree = degrees;
    }
    onWheel(event: WheelEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const DEGREES_INCREMENT = event.altKey ? Constants.MIN_DEGREES_INCREMENT : Constants.MAX_DEGREES_INCREMENT;
        this.finalizeWheel(event.deltaY, DEGREES_INCREMENT);
    }
    finalizeWheel(scrollValue: number, degreesToAdd: number): void {
        const ANGLE_INCREMENT = (degreesToAdd * Math.PI) / Constants.PI_TO_DEGREE;
        this.degree = this.degree + (scrollValue > 0 ? -degreesToAdd : degreesToAdd);
        this.angle = this.angle + (scrollValue > 0 ? -ANGLE_INCREMENT : ANGLE_INCREMENT);
        this.degree %= CommonConstants.MAX_DEGREES;
        if (this.degree < 0) this.degree += CommonConstants.MAX_DEGREES;
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
    }
}
