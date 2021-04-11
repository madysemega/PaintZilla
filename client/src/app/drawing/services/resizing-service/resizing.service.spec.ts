import { async, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import * as Constants from '@app/drawing/constants/drawing-constants';
import { ResizingType } from '@app/drawing/enums/resizing-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ResizingService } from '@app/drawing/services/resizing-service/resizing.service';
import { HistoryService } from '@app/history/service/history.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { MagnetismService } from '@app/magnetism/magnetism.service';

// tslint:disable:max-file-line-count
// tslint:disable:no-string-literal
describe('ResizingService', () => {
    let service: ResizingService;
    let historyServiceStub: HistoryService;
    let magnetismServiceStub: MagnetismService;
    let drawingServiceStub: DrawingService;
    let keyboardServiceStub: jasmine.SpyObj<KeyboardService>;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasSizeStub: Vec2;
    let testMouseEvent: MouseEvent;

    beforeEach(async(() => {
        keyboardServiceStub = jasmine.createSpyObj('KeyboardService', ['registerAction', 'saveContext', 'restoreContext']);
        keyboardServiceStub.registerAction.and.stub();
        keyboardServiceStub.saveContext.and.stub();
        keyboardServiceStub.restoreContext.and.stub();
        historyServiceStub = new HistoryService(keyboardServiceStub);
        drawingServiceStub = new DrawingService(historyServiceStub);
        TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule],
            providers: [
                { provide: DrawingService, useValue: drawingServiceStub },
                { provide: HistoryService, useValue: historyServiceStub },
                { provide: MagnetismService, useValue: magnetismServiceStub },
            ],
        }).compileComponents();
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        drawingServiceStub = TestBed.inject(DrawingService);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service = TestBed.inject(ResizingService);
        canvasSizeStub = { x: Constants.DEFAULT_WIDTH, y: Constants.DEFAULT_HEIGHT };
        service.drawingService.canvas = canvasTestHelper.canvas;
        service.drawingService.baseCtx = baseCtxStub;
        service.drawingService.previewCtx = previewCtxStub;
        service.drawingService.canvasSize = canvasSizeStub;
        testMouseEvent = {
            offsetX: Constants.MAX_WIDTH - Constants.MINIMUM_SIZE,
            offsetY: Constants.MAX_HEIGHT - Constants.MINIMUM_SIZE,
        } as MouseEvent;
    }));
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('isResizing(): should return false if none of the resizing boolean are true', () => {
        expect(service.isResizing()).toBeFalse();
    });
    it('isResizing(): should return true if rightResizerEnabled is true', () => {
        service.rightResizerEnabled = true;
        expect(service.isResizing()).toBeTruthy();
    });
    it('isResizing(): should return true if rightDownResizerEnabled is true', () => {
        service.rightDownResizerEnabled = true;
        expect(service.isResizing()).toBeTruthy();
    });
    it('isResizing(): should return true if downResizerEnabled is true', () => {
        service.downResizerEnabled = true;
        expect(service.isResizing()).toBeTruthy();
    });
    it('final resizing: should call grid twice', () => {
        service.finalizeResizingEvent();
        expect(magnetismServiceStub.toggleGrid()).toHaveBeenCalled();
    });
    it('resizeCanvas(): should not change canvasResize.x if righResizerEnabled is false', () => {
        spyOn(service, 'restorePreviewImageData').and.returnValue();
        spyOn(drawingServiceStub, 'updateCanvasStyle').and.returnValue();
        spyOn(service.drawingService, 'clearCanvas').and.returnValue();
        spyOn(service, 'canBeResizedHorizontally').and.returnValue(true);
        spyOn(service, 'canBeResizedVertically').and.returnValue(true);
        const initialValue: number = service.canvasResize.x;
        service.resizeCanvas(testMouseEvent);
        expect(service.canvasResize.x).toEqual(initialValue);
    });
    it('resizeCanvas(): should not change canvasResize.x if canBeResizedHorizontally() is false', () => {
        spyOn(service, 'restorePreviewImageData').and.returnValue();
        spyOn(drawingServiceStub, 'updateCanvasStyle').and.returnValue();
        spyOn(drawingServiceStub, 'clearCanvas').and.returnValue();
        spyOn(service, 'canBeResizedHorizontally').and.returnValue(true);
        spyOn(service, 'canBeResizedVertically').and.returnValue(true);
        const initialValue: number = service.canvasResize.x;
        service.resizeCanvas(testMouseEvent);
        expect(service.canvasResize.x).toEqual(initialValue);
    });
    it('resizeCanvas(): should change canvasResize.x if righResizerEnabled AND canBeResizedHorizontally() are true', () => {
        spyOn(service, 'restorePreviewImageData').and.returnValue();
        spyOn(drawingServiceStub, 'updateCanvasStyle').and.returnValue();
        spyOn(service.drawingService, 'clearCanvas').and.returnValue();
        spyOn(service, 'canBeResizedHorizontally').and.returnValue(true);
        spyOn(service, 'canBeResizedVertically').and.returnValue(true);
        service.rightResizerEnabled = true;
        const initialValue: number = service.canvasResize.x;
        service.resizeCanvas(testMouseEvent);
        expect(service.canvasResize.x).not.toEqual(initialValue);
        expect(service.canvasResize.x).toEqual(testMouseEvent.offsetX);
    });
    it('resizeCanvas(): should not change canvasResize.y if downResizerEnabled is false', () => {
        spyOn(service, 'restorePreviewImageData').and.returnValue();
        spyOn(drawingServiceStub, 'updateCanvasStyle').and.returnValue();
        spyOn(service.drawingService, 'clearCanvas').and.returnValue();
        spyOn(service, 'canBeResizedHorizontally').and.returnValue(true);
        spyOn(service, 'canBeResizedVertically').and.returnValue(true);
        const initialValue: number = service.canvasResize.y;
        service.resizeCanvas(testMouseEvent);
        expect(service.canvasResize.y).toEqual(initialValue);
    });
    it('resizeCanvas(): should not change canvasResize.y if canBeResizedVertically() is false', () => {
        spyOn(service, 'restorePreviewImageData').and.returnValue();
        spyOn(drawingServiceStub, 'updateCanvasStyle').and.returnValue();
        spyOn(service.drawingService, 'clearCanvas').and.returnValue();
        spyOn(service, 'canBeResizedHorizontally').and.returnValue(true);
        spyOn(service, 'canBeResizedVertically').and.returnValue(false);
        service.downResizerEnabled = true;
        const initialValue: number = service.canvasResize.y;
        service.resizeCanvas(testMouseEvent);
        expect(service.canvasResize.y).toEqual(initialValue);
    });
    it('resizeCanvas(): should change canvasResize.y if downResizerEnabled AND canBeResizedVertically() are true', () => {
        spyOn(service, 'restorePreviewImageData').and.returnValue();
        spyOn(drawingServiceStub, 'updateCanvasStyle').and.returnValue();
        spyOn(service.drawingService, 'clearCanvas').and.returnValue();
        spyOn(service, 'canBeResizedHorizontally').and.returnValue(true);
        spyOn(service, 'canBeResizedVertically').and.returnValue(true);
        service.downResizerEnabled = true;
        const initialValue: number = service.canvasResize.y;
        service.resizeCanvas(testMouseEvent);
        expect(service.canvasResize.y).not.toEqual(initialValue);
        expect(service.canvasResize.y).toEqual(testMouseEvent.offsetY);
    });
    it('resizeCanvas(): should not change canvasResize.x or canvasResize.y if rightDownResizerEnabled is true and \
     canBeResizedHorizontally() AND canBeResizedVertically() are false', () => {
        spyOn(service, 'restorePreviewImageData').and.returnValue();
        spyOn(drawingServiceStub, 'updateCanvasStyle').and.returnValue();
        spyOn(service.drawingService, 'clearCanvas').and.returnValue();
        spyOn(service, 'canBeResizedHorizontally').and.returnValue(false);
        spyOn(service, 'canBeResizedVertically').and.returnValue(false);
        service.rightDownResizerEnabled = true;
        const initialValueX: number = service.canvasResize.x;
        const initialValueY: number = service.canvasResize.y;
        service.resizeCanvas(testMouseEvent);
        expect(service.canvasResize.x).toEqual(initialValueX);
        expect(service.canvasResize.y).toEqual(initialValueY);
    });
    it('resizeCanvas(): should change canvasResize.x if rightDownResizerEnabled AND canBeResizedHorizontally() are true', () => {
        spyOn(service, 'restorePreviewImageData').and.returnValue();
        spyOn(drawingServiceStub, 'updateCanvasStyle').and.returnValue();
        spyOn(service.drawingService, 'clearCanvas').and.returnValue();
        spyOn(service, 'canBeResizedHorizontally').and.returnValue(true);
        spyOn(service, 'canBeResizedVertically').and.returnValue(true);
        service.rightDownResizerEnabled = true;
        const initialValue: number = service.canvasResize.x;
        service.resizeCanvas(testMouseEvent);
        expect(service.canvasResize.x).not.toEqual(initialValue);
        expect(service.canvasResize.x).toEqual(testMouseEvent.offsetX);
    });
    it('resizeCanvas(): should change canvasResize.y if rightDownResizerEnabled AND canBeResizedVertically() are true', () => {
        spyOn(service, 'restorePreviewImageData').and.returnValue();
        spyOn(drawingServiceStub, 'updateCanvasStyle').and.returnValue();
        spyOn(service.drawingService, 'clearCanvas').and.returnValue();
        spyOn(service, 'canBeResizedHorizontally').and.returnValue(true);
        spyOn(service, 'canBeResizedVertically').and.returnValue(true);
        service.rightDownResizerEnabled = true;
        const initialValue: number = service.canvasResize.y;
        service.resizeCanvas(testMouseEvent);
        expect(service.canvasResize.y).not.toEqual(initialValue);
        expect(service.canvasResize.y).toEqual(testMouseEvent.offsetY);
    });
    it('resizeCanvas(): should change canvasResize.x and canvasResize.y if rightDownResizerEnabled AND canBeResizedHorizontally() \
    AND canBeResizedVertically() are true', () => {
        spyOn(service, 'restorePreviewImageData').and.returnValue();
        spyOn(drawingServiceStub, 'updateCanvasStyle').and.returnValue();
        spyOn(service.drawingService, 'clearCanvas').and.returnValue();
        spyOn(service, 'canBeResizedHorizontally').and.returnValue(true);
        spyOn(service, 'canBeResizedVertically').and.returnValue(true);
        service.rightDownResizerEnabled = true;
        const initialValueX: number = service.canvasResize.x;
        const initialValueY: number = service.canvasResize.y;
        service.resizeCanvas(testMouseEvent);
        expect(service.canvasResize.x).not.toEqual(initialValueX);
        expect(service.canvasResize.y).not.toEqual(initialValueY);
        expect(service.canvasResize.x).toEqual(testMouseEvent.offsetX);
        expect(service.canvasResize.y).toEqual(testMouseEvent.offsetY);
    });
    it('resizeCanvas(): updateCanvasStyle() should be called', () => {
        spyOn(service, 'restorePreviewImageData').and.returnValue();
        spyOn(service.drawingService, 'clearCanvas').and.returnValue();
        spyOn(service, 'canBeResizedHorizontally').and.returnValue(true);
        spyOn(service, 'canBeResizedVertically').and.returnValue(true);
        const updateStyleStub = spyOn(service.drawingService, 'updateCanvasStyle').and.stub();
        service.resizeCanvas(testMouseEvent);
        expect(updateStyleStub).toHaveBeenCalled();
    });
    it('resizeCanvas(): restorePreviewImageData() should be called', () => {
        spyOn(service, 'restorePreviewImageData').and.returnValue();
        spyOn(drawingServiceStub, 'updateCanvasStyle').and.returnValue();
        spyOn(service, 'canBeResizedHorizontally').and.returnValue(true);
        spyOn(service, 'canBeResizedVertically').and.returnValue(true);
        service.resizeCanvas(testMouseEvent);
        expect(service.restorePreviewImageData).toHaveBeenCalled();
        expect(drawingServiceStub.updateCanvasStyle).toHaveBeenCalled();
    });
    it('canBeResizedHorizontally(): should return false if event.offsetx is less than MINIMUM_SIZE', () => {
        const mouseEvent: MouseEvent = {
            offsetX: Constants.DEFAULT_WIDTH - Constants.MAX_WIDTH,
            offsetY: Constants.DEFAULT_HEIGHT - Constants.MAX_HEIGHT,
        } as MouseEvent;
        expect(service.canBeResizedHorizontally(mouseEvent)).toBeFalsy();
    });
    it('canBeResizedHorizontally(): should return false if event.offsetx is more than MAXIMUM_SIZE', () => {
        const mouseEvent: MouseEvent = {
            offsetX: Constants.MAX_WIDTH + Constants.MAX_WIDTH,
            offsetY: Constants.MAX_HEIGHT + Constants.MAX_HEIGHT,
        } as MouseEvent;
        expect(service.canBeResizedHorizontally(mouseEvent)).toBeFalsy();
    });
    it('canBeResizedHorizontally(): should return true if event.offsetx is between MINIMUM_SIZE and MAXIMUM_SIZE', () => {
        const mouseEvent: MouseEvent = testMouseEvent;
        expect(service.canBeResizedHorizontally(mouseEvent)).toBeTruthy();
    });
    it('canBeResizedVertically(): should return false if event.offsety is less than MINIMUM_SIZE', () => {
        const mouseEvent: MouseEvent = {
            offsetX: Constants.DEFAULT_WIDTH - Constants.MAX_WIDTH,
            offsetY: Constants.DEFAULT_HEIGHT - Constants.MAX_HEIGHT,
        } as MouseEvent;
        expect(service.canBeResizedVertically(mouseEvent)).toBeFalsy();
    });
    it('canBeResizedVertically(): should return false if event.offsety is more than MAXIMUM_SIZE', () => {
        const mouseEvent: MouseEvent = {
            offsetX: Constants.MAX_WIDTH + Constants.MAX_WIDTH,
            offsetY: Constants.MAX_HEIGHT + Constants.MAX_HEIGHT,
        } as MouseEvent;
        expect(service.canBeResizedVertically(mouseEvent)).toBeFalsy();
    });
    it('canBeResizedVertically(): should return true if event.offsety is between MINIMUM_SIZE and MAXIMUM_SIZE', () => {
        const mouseEvent: MouseEvent = testMouseEvent;
        expect(service.canBeResizedVertically(mouseEvent)).toBeTruthy();
    });
    it('restorePreviewImageData(): should call drawingService.previewCtx.putImageData()', () => {
        const putImageDataStub = spyOn(drawingServiceStub.previewCtx, 'putImageData').and.stub();
        service.restorePreviewImageData();
        expect(putImageDataStub).toHaveBeenCalled();
        expect(putImageDataStub).toHaveBeenCalledWith(service.image, 0, 0);
    });
    it('activateResizer(): rightResizerEnabled should be true if called with ResizingType.RIGHT and other resizing booleans are false', () => {
        spyOn(service, 'saveCurrentImage').and.returnValue();
        service.activateResizer(ResizingType.RIGHT);
        expect(service.rightResizerEnabled).toBeTrue();
        expect(service.rightDownResizerEnabled).toBeFalse();
        expect(service.downResizerEnabled).toBeFalse();
    });
    it('activateResizer(): downResizerEnabled should be true if called with ResizingType.DOWN and other resizing booleans are false', () => {
        spyOn(service, 'saveCurrentImage').and.returnValue();
        service.activateResizer(ResizingType.DOWN);
        expect(service.downResizerEnabled).toBeTrue();
        expect(service.rightResizerEnabled).toBeFalse();
        expect(service.rightDownResizerEnabled).toBeFalse();
    });
    it('activateResizer(): rightDownResizerEnabled should be true if called with ResizingType.RIGHTDOWN and other resizing booleans \
    are false', () => {
        spyOn(service, 'saveCurrentImage').and.returnValue();
        service.activateResizer(ResizingType.RIGHTDOWN);
        expect(service.rightDownResizerEnabled).toBeTrue();
        expect(service.rightResizerEnabled).toBeFalse();
        expect(service.downResizerEnabled).toBeFalse();
    });
    it('activateResizer(): none of the resizing booleans is true if called with empty string', () => {
        spyOn(service, 'saveCurrentImage').and.returnValue();
        service.activateResizer('');
        expect(service.rightDownResizerEnabled).toBeFalse();
        expect(service.rightResizerEnabled).toBeFalse();
        expect(service.downResizerEnabled).toBeFalse();
    });
    it('activateResizer(): saveCurrentImage() should be called', () => {
        const saveCurrentImageSpy = spyOn(service, 'saveCurrentImage').and.stub();
        service.activateResizer('');
        expect(saveCurrentImageSpy).toHaveBeenCalled();
    });
    it('saveCurrentImage(): drawingService.baseCtx.getImageData() should be called', () => {
        const getImageDataStub = spyOn(drawingServiceStub.baseCtx, 'getImageData').and.stub();
        service.saveCurrentImage();
        expect(getImageDataStub).toHaveBeenCalled();
        expect(getImageDataStub).toHaveBeenCalledWith(0, 0, drawingServiceStub.canvasSize.x, drawingServiceStub.canvasSize.y);
    });
    it('disableResizer(): all resizing booleans should be false', () => {
        spyOn(service, 'restoreBaseImageData').and.returnValue();
        spyOn(service, 'updateCanvasSize').and.returnValue();
        spyOn(drawingServiceStub, 'restoreCanvasStyle').and.returnValue();
        service.rightDownResizerEnabled = true;
        service.rightResizerEnabled = true;
        service.downResizerEnabled = true;
        service.disableResizer();
        expect(service.rightResizerEnabled).toBeFalse();
        expect(service.rightDownResizerEnabled).toBeFalse();
        expect(service.downResizerEnabled).toBeFalse();
    });
    it('disableResizer(): restoreCanvasStyle() should be called', () => {
        spyOn(service, 'restoreBaseImageData').and.returnValue();
        spyOn(service, 'updateCanvasSize').and.returnValue();
        const restoreStyleStub = spyOn(drawingServiceStub, 'restoreCanvasStyle').and.stub();
        service.disableResizer();
        expect(restoreStyleStub).toHaveBeenCalled();
    });
    it('disableResizer(): restoreBaseImageData() should be called', () => {
        const restoreBaseImageDataStub = spyOn(service, 'restoreBaseImageData').and.stub();
        spyOn(service, 'updateCanvasSize').and.returnValue();
        spyOn(drawingServiceStub, 'restoreCanvasStyle').and.returnValue();
        service.disableResizer();
        expect(restoreBaseImageDataStub).toHaveBeenCalled();
    });
    it('disableResizer(): updateCanvasSize() should be called', () => {
        spyOn(service, 'restoreBaseImageData').and.returnValue();
        spyOn(drawingServiceStub, 'restoreCanvasStyle').and.returnValue();
        const updateCanvasSizeStub = spyOn(service, 'updateCanvasSize').and.stub();
        service.disableResizer();
        expect(updateCanvasSizeStub).toHaveBeenCalled();
    });
    it('restoreBaseImageData(): drawingService.baseCtx.putImageData() should be called', () => {
        const putImageDataStub = spyOn(drawingServiceStub.baseCtx, 'putImageData').and.stub();
        service.restoreBaseImageData();
        expect(putImageDataStub).toHaveBeenCalled();
        expect(putImageDataStub).toHaveBeenCalledWith(service.image, 0, 0);
    });
    it('updateCanvasSize(): drawingService.canvasSize should be equal to canvasResize dimensions', () => {
        drawingServiceStub.canvasSize.x = 0;
        drawingServiceStub.canvasSize.y = 0;
        service.updateCanvasSize();
        expect(drawingServiceStub.canvasSize.x).toEqual(service.canvasResize.x);
        expect(drawingServiceStub.canvasSize.y).toEqual(service.canvasResize.y);
    });
    it('resetCanvasDimensions(): canvasResize.x should be equal to HALF_WINDOW_WIDTH and canvasResize.y \
    should be equal to HALF_WINDOW_HEIGHT', () => {
        service.canvasResize.x = 0;
        service.canvasResize.y = 0;
        service.resetCanvasDimensions();
        expect(service.canvasResize.x).toEqual(Constants.DEFAULT_WIDTH);
        expect(service.canvasResize.y).toEqual(Constants.DEFAULT_HEIGHT);
    });

    it('finalizeResizingEvent should create, apply and register a user action', () => {
        spyOn(drawingServiceStub, 'updateCanvasStyle').and.returnValue();
        spyOn(drawingServiceStub, 'restoreCanvasStyle').and.returnValue();

        service.finalizeResizingEvent();

        expect(historyServiceStub['past'].length).toEqual(1);
    });
});
