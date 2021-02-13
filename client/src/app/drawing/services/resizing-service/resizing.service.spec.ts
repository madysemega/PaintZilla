import { async, TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import * as Constants from '@app/drawing/constants/drawing-constants';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ResizingService } from '@app/drawing/services/resizing-service/resizing.service';

describe('ResizingService', () => {
    let service: ResizingService;
    let drawingServiceStub: DrawingService;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasSizeStub: Vec2;
    let testMouseEvent: MouseEvent;

    beforeEach(async(() => {
        drawingServiceStub = new DrawingService();
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceStub }],
        }).compileComponents();
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service = TestBed.inject(ResizingService);
        canvasSizeStub = { x: Constants.DEFAULT_WIDTH, y: Constants.DEFAULT_HEIGHT };
        service.drawingService.canvas = canvasTestHelper.canvas;
        service.drawingService.baseCtx = baseCtxStub;
        service.drawingService.previewCtx = previewCtxStub;
        service.drawingService.canvasSize = canvasSizeStub;
        testMouseEvent = {
            clientX: Constants.MAX_WIDTH - Constants.DEFAULT_WIDTH,
            clientY: Constants.MAX_HEIGHT - Constants.DEFAULT_HEIGHT,
        } as MouseEvent;
    }));

    beforeEach(() => {
        service.canvasResize.x = Constants.DEFAULT_WIDTH;
        service.canvasResize.y = Constants.DEFAULT_HEIGHT;
        service.downResizerEnabled = false;
        service.rightDownResizerEnabled = false;
        service.rightResizerEnabled = false;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('isResizing(): should return false if none of the resizing boolean are true', () => {
        const mouseEvent = {} as MouseEvent;
        expect(service.isResizing(mouseEvent)).toBeFalse();
    });

    it('isResizing(): should return true if rightResizerEnabled is true', () => {
        const mouseEvent = {} as MouseEvent;
        service.rightResizerEnabled = true;
        expect(service.isResizing(mouseEvent)).toBeTruthy();
    });

    it('isResizing(): should return true if rightDownResizerEnabled is true', () => {
        const mouseEvent = {} as MouseEvent;
        service.rightDownResizerEnabled = true;
        expect(service.isResizing(mouseEvent)).toBeTruthy();
    });

    it('isResizing(): should return true if downResizerEnabled is true', () => {
        const mouseEvent = {} as MouseEvent;
        service.downResizerEnabled = true;
        expect(service.isResizing(mouseEvent)).toBeTruthy();
    });

    it('resizeCanvas(): should not change canvasResize.x if righResizerEnabled is false', () => {
        const mouseEvent: MouseEvent = testMouseEvent;
        spyOn(service, 'restorePreviewImageData').and.returnValue();
        spyOn(service, 'canBeResizedHorizontally').and.returnValue(true);
        spyOn(service, 'canBeResizedVertically').and.returnValue(true);
        const initialValue: number = service.canvasResize.x;
        service.resizeCanvas(mouseEvent);
        expect(service.canvasResize.x).toEqual(initialValue);
    });

    it('resizeCanvas(): should not change canvasResize.x if canBeResizedHorizontally() is false', () => {
        const mouseEvent: MouseEvent = testMouseEvent;
        spyOn(service, 'restorePreviewImageData').and.returnValue();
        spyOn(service, 'canBeResizedHorizontally').and.returnValue(true);
        spyOn(service, 'canBeResizedVertically').and.returnValue(true);
        const initialValue: number = service.canvasResize.x;
        service.resizeCanvas(mouseEvent);
        expect(service.canvasResize.x).toEqual(initialValue);
    });

    it('resizeCanvas(): should change canvasResize.x if righResizerEnabled AND canBeResizedHorizontally() are true', () => {
        const mouseEvent: MouseEvent = testMouseEvent;
        spyOn(service, 'restorePreviewImageData').and.returnValue();
        spyOn(service, 'canBeResizedHorizontally').and.returnValue(true);
        spyOn(service, 'canBeResizedVertically').and.returnValue(true);
        service.rightResizerEnabled = true;
        const initialValue: number = service.canvasResize.x;
        service.resizeCanvas(mouseEvent);
        expect(service.canvasResize.x).not.toEqual(initialValue);
        expect(service.canvasResize.x).toEqual(testMouseEvent.x);
    });

    it('resizeCanvas(): should not change canvasResize.y if downResizerEnabled is false', () => {
        const mouseEvent: MouseEvent = testMouseEvent;
        spyOn(service, 'restorePreviewImageData').and.returnValue();
        spyOn(service, 'canBeResizedHorizontally').and.returnValue(true);
        spyOn(service, 'canBeResizedVertically').and.returnValue(true);
        const initialValue: number = service.canvasResize.y;
        service.resizeCanvas(mouseEvent);
        expect(service.canvasResize.y).toEqual(initialValue);
    });

    it('resizeCanvas(): should not change canvasResize.y if canBeResizedVertically() is false', () => {
        const mouseEvent: MouseEvent = testMouseEvent;
        spyOn(service, 'restorePreviewImageData').and.returnValue();
        spyOn(service, 'canBeResizedHorizontally').and.returnValue(true);
        spyOn(service, 'canBeResizedVertically').and.returnValue(false);
        service.downResizerEnabled = true;
        const initialValue: number = service.canvasResize.y;
        service.resizeCanvas(mouseEvent);
        expect(service.canvasResize.y).toEqual(initialValue);
    });

    it('resizeCanvas(): should change canvasResize.y if downResizerEnabled AND canBeResizedVertically() are true', () => {
        const mouseEvent: MouseEvent = testMouseEvent;
        spyOn(service, 'restorePreviewImageData').and.returnValue();
        spyOn(service, 'canBeResizedHorizontally').and.returnValue(true);
        spyOn(service, 'canBeResizedVertically').and.returnValue(true);
        service.downResizerEnabled = true;
        const initialValue: number = service.canvasResize.y;
        service.resizeCanvas(mouseEvent);
        expect(service.canvasResize.y).not.toEqual(initialValue);
        expect(service.canvasResize.y).toEqual(testMouseEvent.y);
    });

    it('resizeCanvas(): should not change canvasResize.x or canvasResize.y if rightDownResizerEnabled is true and \
     canBeResizedHorizontally() AND canBeResizedVertically() are false', () => {
        const mouseEvent: MouseEvent = testMouseEvent;
        spyOn(service, 'restorePreviewImageData').and.returnValue();
        spyOn(service, 'canBeResizedHorizontally').and.returnValue(false);
        spyOn(service, 'canBeResizedVertically').and.returnValue(false);
        service.rightDownResizerEnabled = true;
        const initialValueX: number = service.canvasResize.x;
        const initialValueY: number = service.canvasResize.y;
        service.resizeCanvas(mouseEvent);
        expect(service.canvasResize.x).toEqual(initialValueX);
        expect(service.canvasResize.y).toEqual(initialValueY);
    });

    it('resizeCanvas(): should change canvasResize.x if rightDownResizerEnabled AND canBeResizedHorizontally() are true', () => {
        const mouseEvent: MouseEvent = testMouseEvent;
        spyOn(service, 'restorePreviewImageData').and.returnValue();
        spyOn(service, 'canBeResizedHorizontally').and.returnValue(true);
        spyOn(service, 'canBeResizedVertically').and.returnValue(false);
        service.rightDownResizerEnabled = true;
        const initialValue: number = service.canvasResize.x;
        service.resizeCanvas(mouseEvent);
        expect(service.canvasResize.x).not.toEqual(initialValue);
        expect(service.canvasResize.x).toEqual(mouseEvent.x);
    });

    it('resizeCanvas(): should change canvasResize.y if rightDownResizerEnabled AND canBeResizedVertically() are true', () => {
        const mouseEvent: MouseEvent = testMouseEvent;
        spyOn(service, 'restorePreviewImageData').and.returnValue();
        spyOn(service, 'canBeResizedHorizontally').and.returnValue(false);
        spyOn(service, 'canBeResizedVertically').and.returnValue(true);
        service.rightDownResizerEnabled = true;
        const initialValue: number = service.canvasResize.y;
        service.resizeCanvas(mouseEvent);
        expect(service.canvasResize.y).not.toEqual(initialValue);
        expect(service.canvasResize.y).toEqual(mouseEvent.y);
    });

    it('resizeCanvas(): should change canvasResize.x and canvasResize.y if rightDownResizerEnabled AND canBeResizedHorizontally() \
    AND canBeResizedVertically() are true', () => {
        const mouseEvent: MouseEvent = testMouseEvent;
        spyOn(service, 'restorePreviewImageData').and.returnValue();
        spyOn(service, 'canBeResizedHorizontally').and.returnValue(true);
        spyOn(service, 'canBeResizedVertically').and.returnValue(true);
        service.rightDownResizerEnabled = true;
        const initialValueX: number = service.canvasResize.x;
        const initialValueY: number = service.canvasResize.y;
        service.resizeCanvas(mouseEvent);
        expect(service.canvasResize.x).not.toEqual(initialValueX);
        expect(service.canvasResize.y).not.toEqual(initialValueY);
        expect(service.canvasResize.x).toEqual(mouseEvent.x);
        expect(service.canvasResize.y).toEqual(mouseEvent.y);
    });

    it('resizeCanvas(): restorePreviewImageData() should be called', () => {
        const mouseEvent: MouseEvent = testMouseEvent;
        spyOn(service, 'restorePreviewImageData').and.returnValue();
        spyOn(service, 'canBeResizedHorizontally').and.returnValue(true);
        spyOn(service, 'canBeResizedVertically').and.returnValue(true);
        service.resizeCanvas(mouseEvent);
        expect(service.restorePreviewImageData).toHaveBeenCalled();
    });

    it('canBeResizedHorizontally(): should return false if event.offsetx is less than MINIMUM_SIZE', () => {
        const mouseEvent: MouseEvent = {
            clientX: Constants.DEFAULT_WIDTH - Constants.MAX_WIDTH,
            clientY: Constants.DEFAULT_HEIGHT - Constants.MAX_HEIGHT,
        } as MouseEvent;
        expect(service.canBeResizedHorizontally(mouseEvent)).toBeFalsy();
    });

    it('canBeResizedHorizontally(): should return false if event.offsetx is more than MAXIMUM_SIZE', () => {
        const mouseEvent: MouseEvent = {
            clientX: Constants.MAX_WIDTH + Constants.MAX_WIDTH,
            clientY: Constants.MAX_HEIGHT + Constants.MAX_HEIGHT,
        } as MouseEvent;
        expect(service.canBeResizedHorizontally(mouseEvent)).toBeFalsy();
    });

    it('canBeResizedHorizontally(): should return true if event.offsetx is between MINIMUM_SIZE and MAXIMUM_SIZE', () => {
        const mouseEvent: MouseEvent = testMouseEvent;
        expect(service.canBeResizedHorizontally(mouseEvent)).toBeTruthy();
    });

    it('canBeResizedVertically(): should return false if event.offsety is less than MINIMUM_SIZE', () => {
        const mouseEvent: MouseEvent = {
            clientX: Constants.DEFAULT_WIDTH - Constants.MAX_WIDTH,
            clientY: Constants.DEFAULT_HEIGHT - Constants.MAX_HEIGHT,
        } as MouseEvent;
        expect(service.canBeResizedVertically(mouseEvent)).toBeFalsy();
    });

    it('canBeResizedVertically(): should return false if event.offsety is more than MAXIMUM_SIZE', () => {
        const mouseEvent: MouseEvent = {
            clientX: Constants.MAX_WIDTH + Constants.MAX_WIDTH,
            clientY: Constants.MAX_HEIGHT + Constants.MAX_HEIGHT,
        } as MouseEvent;
        expect(service.canBeResizedVertically(mouseEvent)).toBeFalsy();
    });

    it('canBeResizedVertically(): should return true if event.offsety is between MINIMUM_SIZE and MAXIMUM_SIZE', () => {
        const mouseEvent: MouseEvent = testMouseEvent;
        expect(service.canBeResizedVertically(mouseEvent)).toBeTruthy();
    });
});
