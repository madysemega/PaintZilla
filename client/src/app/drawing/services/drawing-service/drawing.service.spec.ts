import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
// import { Vec2 } from '@app/app/classes/vec2';
import { CursorType } from '@app/drawing/classes/cursor-type';
import * as Constants from '@app/drawing/constants/drawing-constants';
import { HistoryService } from '@app/history/service/history.service';
import { UserActionResizeDrawingSurface } from '@app/history/user-actions/user-action-resize-drawing-surface';
import { DrawingService } from './drawing.service';

// tslint:disable:no-any
describe('DrawingService', () => {
    let service: DrawingService;
    let canvasTestHelper: CanvasTestHelper;
    let historyServiceStub: HistoryService;

    let baseCtxDrawImageSpy: jasmine.Spy<any>;
    let resetDrawingSurfaceSpy: jasmine.Spy<any>;

    const WIDTH_1 = 5;
    const WIDTH_2 = 10;

    beforeEach(() => {
        historyServiceStub = new HistoryService();
        TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule],
            providers: [{ provide: HistoryService, useValue: historyServiceStub }],
        });
        service = TestBed.inject(DrawingService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service.canvas = canvasTestHelper.canvas;
        service.previewCanvas = canvasTestHelper.drawCanvas;
        service.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        service.canvas.style.zIndex = Constants.INFERIOR_Z_INDEX;
        service.canvas.style.background = Constants.CTX_COLOR;
        service.canvasSize = { x: 1000, y: 1000 };
        service.previewCanvas.style.background = Constants.PREVIEW_CTX_COLOR;

        baseCtxDrawImageSpy = spyOn(service.baseCtx, 'drawImage').and.stub();
        resetDrawingSurfaceSpy = spyOn(service, 'resetDrawingSurface').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('clearCanvas(): should clear the whole canvas', () => {
        service.clearCanvas(service.baseCtx);
        const pixelBuffer = new Uint32Array(service.baseCtx.getImageData(0, 0, service.canvas.width, service.canvas.height).data.buffer);
        const hasColoredPixels = pixelBuffer.some((color) => color !== 0);
        expect(hasColoredPixels).toBeFalse();
    });

    it('clearCanvas() should not affect the portion outside the one passed in param if there is any', () => {
        const size = 1000;
        service.canvas.width = size;
        service.canvas.height = size;
        service.baseCtx.fillStyle = 'blue';
        service.baseCtx.fillRect(0, 0, service.canvasSize.x, service.canvasSize.y);
        const clearArea: Vec2 = { x: 200, y: 200 };
        service.clearCanvas(service.baseCtx, clearArea);
        const pixelBuffer = new Uint32Array(
            service.baseCtx.getImageData(
                clearArea.x + 1,
                clearArea.y + 1,
                service.canvasSize.x - clearArea.x - 1,
                service.canvasSize.y - clearArea.y - 1,
            ).data.buffer,
        );
        const hasPixelWithoutColor = pixelBuffer.some((color) => color === 0);
        expect(hasPixelWithoutColor).toBeFalse();
    });

    it('isCanvasEmpty should be true if canvas is empty', () => {
        service.clearCanvas(service.baseCtx);
        expect(service.isCanvasEmpty()).toBeTrue();
    });
    it('set cursor should set the cursor', () => {
        service.setCursorType(CursorType.CROSSHAIR);
        expect(service.previewCanvas.style.cursor).toEqual(CursorType.CROSSHAIR);
    });

    it('isCanvasEmpty should be false if canvas is not empty', () => {
        service.baseCtx.beginPath();
        service.baseCtx.lineTo(WIDTH_1, WIDTH_1);
        service.baseCtx.lineTo(WIDTH_2, WIDTH_2);
        service.baseCtx.stroke();
        expect(service.isCanvasEmpty()).toBeFalse();
    });

    it('fillCanvas(): context fillStyle should be set to rgba(255, 255, 255, 1)', () => {
        service.fillCanvas(service.baseCtx, Constants.DEFAULT_WIDTH, Constants.DEFAULT_HEIGHT, Constants.HEX_WHITE);
        expect(service.baseCtx.fillStyle).toEqual(Constants.HEX_WHITE);
    });

    it('updateCanvasStyle(): z index should be updated for canvas', () => {
        service.updateCanvasStyle();
        expect(service.canvas.style.zIndex).toEqual(Constants.SUPERIOR_Z_INDEX);
    });

    it('restoreCanvasStyle(): background should be updated for canvas and z index should be updated for canvas', () => {
        service.restoreCanvasStyle();
        expect(service.canvas.style.zIndex).toEqual(Constants.INFERIOR_Z_INDEX);
        expect(service.baseCtx.fillStyle).toEqual(Constants.HEX_WHITE);
    });

    it('setImageFromBase64() should reset the drawing surface', () => {
        const IMAGE_SRC_BASE_64 = '1234567890';

        service.setImageFromBase64(IMAGE_SRC_BASE_64);
        expect(resetDrawingSurfaceSpy).toHaveBeenCalled();
    });

    it('setImageSavedLocally() should reset the drawing surface', () => {
        const IMAGE_SRC_BASE_64 = '1234567890';

        service.setImageSavedLocally(IMAGE_SRC_BASE_64);
        expect(resetDrawingSurfaceSpy).toHaveBeenCalled();
    });

    it('drawInitialImage() should draw the initial image if there is one', () => {
        service.initialImage = new Image();

        service.drawInitialImage();
        expect(baseCtxDrawImageSpy).toHaveBeenCalled();
    });

    it('drawInitialImage() should not draw the initial image if there is none', () => {
        service.initialImage = undefined;

        service.drawInitialImage();
        expect(baseCtxDrawImageSpy).not.toHaveBeenCalled();
    });

    it('currentDrawing property should convert canvas image to base64 with jpeg mime type', () => {
        expect(service.currentDrawing).toEqual(service.canvas.toDataURL('image/jpeg', 1.0));
    });

    it('Undo should reset drawing surface', () => {
        const WIDTH = 400;
        const HEIGHT = 300;

        // tslint:disable-next-line: no-empty
        historyServiceStub.do(new UserActionResizeDrawingSurface(WIDTH, HEIGHT, (width, height) => {}));
        historyServiceStub.undo();

        expect(resetDrawingSurfaceSpy).toHaveBeenCalled();
    });
});
