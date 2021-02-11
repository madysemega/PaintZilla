import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
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

    it('should clear the whole canvas', () => {
        service.clearCanvas(service.baseCtx);
        const pixelBuffer = new Uint32Array(service.baseCtx.getImageData(0, 0, service.canvas.width, service.canvas.height).data.buffer);
        const hasColoredPixels = pixelBuffer.some((color) => color !== 0);
        expect(hasColoredPixels).toEqual(false);
    });

    it('isCanvasEmpty should be true if canvas has been cleared', () => {
        service.clearCanvas(service.baseCtx);
        expect(service.isCanvasEmpty()).toEqual(true);
    });

    it('should set canvas to the correct size', () => {
        const width = 100;
        const height = 100;
        service.setCanvasSize(width, height);
        const hasGoodWidth = service.canvas.width === width;
        const hasGoodHeight = service.canvas.height === height;
        expect(hasGoodWidth && hasGoodHeight).toEqual(true);
    });

    it('should set preview canvas to the correct size', () => {
        const width = 100;
        const height = 100;
        service.setCanvasSize(width, height);
        const hasGoodWidth = service.previewCanvas.width === width;
        const hasGoodHeight = service.previewCanvas.height === height;
        expect(hasGoodWidth && hasGoodHeight).toEqual(true);
    });
});
