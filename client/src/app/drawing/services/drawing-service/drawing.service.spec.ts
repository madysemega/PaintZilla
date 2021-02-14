import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import * as Constants from '@app/drawing/constants/drawing-constants';
import { DrawingService } from './drawing.service';

describe('DrawingService', () => {
    let service: DrawingService;
    let canvasTestHelper: CanvasTestHelper;
    const WIDTH_1 = 5;
    const WIDTH_2 = 10;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DrawingService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service.canvas = canvasTestHelper.canvas;
        service.previewCanvas = canvasTestHelper.drawCanvas;
        service.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        service.canvas.style.zIndex = Constants.INFERIOR_Z_INDEX;
        service.canvas.style.background = Constants.CTX_COLOR;
        service.previewCanvas.style.background = Constants.PREVIEW_CTX_COLOR;
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

    it('isCanvasEmpty should be false if canvas is not empty', () => {
        service.baseCtx.beginPath();
        service.baseCtx.lineTo(WIDTH_1, WIDTH_1);
        service.baseCtx.lineTo(WIDTH_2, WIDTH_2);
        service.baseCtx.stroke();
        expect(service.isCanvasEmpty()).toEqual(false);
    });

    it('fillCanvas(): context fillStyle should be set to #ffffff', () => {
        service.fillCanvas(service.baseCtx, Constants.DEFAULT_WIDTH, Constants.DEFAULT_HEIGHT);
        expect(service.baseCtx.fillStyle).toEqual(Constants.CTX_COLOR);
    });

    it('updateCanvasStyle(): background should be updated for canvas and previewCanvas and z index should be updated for canvas', () => {
        service.updateCanvasStyle();
        expect(service.canvas.style.zIndex).toEqual(Constants.SUPERIOR_Z_INDEX);
        expect(service.canvas.style.background).toEqual(Constants.PREVIEW_CTX_COLOR);
        expect(service.previewCanvas.style.background).toEqual(Constants.RGB_WHITE);
    });

    it('restoreCanvasStyle(): background should be updated for canvas and previewCanvas and z index should be updated for canvas', () => {
        service.restoreCanvasStyle();
        expect(service.canvas.style.zIndex).toEqual(Constants.INFERIOR_Z_INDEX);
        expect(service.canvas.style.background).toEqual(Constants.RGB_WHITE);
        expect(service.previewCanvas.style.background).toEqual(Constants.PREVIEW_CTX_COLOR);
    });
});
