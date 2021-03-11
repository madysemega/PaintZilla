import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { CursorType } from '@app/drawing/classes/cursor-type';
import * as Constants from '@app/drawing/constants/drawing-constants';
import { HistoryService } from '@app/history/service/history.service';
import { DrawingService } from './drawing.service';

// tslint:disable:no-any
describe('DrawingService', () => {
    let service: DrawingService;
    let canvasTestHelper: CanvasTestHelper;
    let historyServiceStub: HistoryService;

    let restoreCanvasStyleStub: jasmine.Spy<any>;
    // let clearCanvasStub: jasmine.Spy<any>;

    const WIDTH_1 = 5;
    const WIDTH_2 = 10;

    beforeEach(() => {
        historyServiceStub = new HistoryService();
        TestBed.configureTestingModule({
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
        service.canvasSize = {x:1000, y: 1000};
        service.previewCanvas.style.background = Constants.PREVIEW_CTX_COLOR;

        restoreCanvasStyleStub = spyOn(service, 'restoreCanvasStyle').and.callThrough();
        // clearCanvasStub = spyOn(service, 'clearCanvas').and.callThrough();
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

    it('history service undo should restore canvas style and fill canvas', () => {
        historyServiceStub.register(jasmine.createSpyObj('IUserAction', ['apply']));
        const fillStub = spyOn(service, 'fillCanvas').and.stub();
        historyServiceStub.undo();
        expect(restoreCanvasStyleStub).toHaveBeenCalled();
        expect(fillStub).toHaveBeenCalled();
    });
});
