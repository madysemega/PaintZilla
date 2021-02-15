import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { CursorType } from '@app/drawing/classes/cursor-type';
import * as Constants from '@app/drawing/constants/drawing-constants';
import { DrawingService } from './drawing.service';

describe('DrawingService', () => {
    let service: DrawingService;
    let canvasTestHelper: CanvasTestHelper;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DrawingService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service.canvas = canvasTestHelper.canvas;
        service.previewCanvas = canvasTestHelper.drawCanvas;
        service.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('clearCanvas(): should clear the whole canvas', () => {
        service.clearCanvas(service.baseCtx);
        const pixelBuffer = new Uint32Array(service.baseCtx.getImageData(0, 0, service.canvas.width, service.canvas.height).data.buffer);
        const hasColoredPixels = pixelBuffer.some((color) => color !== 0);
        expect(hasColoredPixels).toEqual(false);
    });

    it('isCanvasEmpty should be true if canvas is empty', () => {
        service.clearCanvas(service.baseCtx);
        expect(service.isCanvasEmpty()).toEqual(true);
    });
    it('set cursor should set the cursor', () => {
        service.setCursorType(CursorType.CROSSHAIR);
        expect(service.previewCanvas.style.cursor).toEqual(CursorType.CROSSHAIR);
    });

    it('isCanvasEmpty should be false if canvas is not empty', () => {
        service.baseCtx.beginPath();
        // tslint:disable-next-line: no-magic-numbers
        service.baseCtx.lineTo(5, 5);
        // tslint:disable-next-line: no-magic-numbers
        service.baseCtx.lineTo(10, 10);
        service.baseCtx.stroke();
        expect(service.isCanvasEmpty()).toEqual(false);
    });

    it('fillCanvas(): context fillStyle should be set to #ffffff', () => {
        service.fillCanvas(service.baseCtx, Constants.DEFAULT_WIDTH, Constants.DEFAULT_HEIGHT);
        expect(service.baseCtx.fillStyle).toEqual(Constants.CTX_COLOR);
    });
});
