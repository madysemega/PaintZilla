import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import * as Constants from '@app/tools/services/tools/stamp/stamp-constants';
import { StampService } from '@app/tools/services/tools/stamp/stamp.service';

// tslint:disable: no-any
// tslint:disable: no-string-literal
describe('StampService', () => {
    let service: StampService;
    let historyService: HistoryService;
    let keyboardServiceStub: jasmine.SpyObj<KeyboardService>;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let previewCtxDrawSpy: jasmine.Spy<any>;

    let canvas: HTMLCanvasElement;
    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setCursorType']);
        keyboardServiceStub = jasmine.createSpyObj('KeyboardService', ['registerAction', 'saveContext', 'restoreContext']);
        keyboardServiceStub.registerAction.and.stub();
        keyboardServiceStub.saveContext.and.stub();
        keyboardServiceStub.restoreContext.and.stub();
        historyService = new HistoryService(keyboardServiceStub);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: HistoryService, useValue: historyService },
            ],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        canvas = canvasTestHelper.canvas;
        service = TestBed.inject(StampService);
        previewCtxDrawSpy = spyOn<any>(previewCtxStub, 'drawImage').and.callThrough();

        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvas;
        mouseEvent = {
            clientX: 100,
            clientY: 100,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it(' finalize should call do of the renderer', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        const DO_SPY = spyOn<any>(service['renderer'], 'clone').and.callThrough();
        service.mouseDown = true;
        service.finalize();
        expect(DO_SPY).toHaveBeenCalled();
    });
    it(' drawImage should be called when onMouseMove is called', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseMove(mouseEvent);
        expect(previewCtxDrawSpy).toHaveBeenCalled();
    });
    it(' onMouseDown should set mouseDown to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });
    it(' onToolSelect should put cursorType to NONE', () => {
        service.onToolSelect();
        expect(drawServiceSpy.setCursorType).toHaveBeenCalledWith(CursorType.NONE);
    });
    it('when tool is deselected, it should unlock the history service', () => {
        historyService.isLocked = true;
        service.onToolDeselect();
        expect(historyService.isLocked).toBeFalse();
    });
    it('onMouseUp should call finalize', () => {
        const FINALIZE_SPY = spyOn<any>(service, 'finalize').and.callThrough();
        service.onMouseUp(mouseEvent);
        expect(FINALIZE_SPY).toHaveBeenCalled();
    });
    it('changeSize should set imageSize to argument value', () => {
        const SIZE = 15;
        service.changeSize(SIZE);
        expect(service.imageSizeProperty.imageSize).toBe(SIZE);
    });
    it('changeAngle should set degree to argument value', () => {
        const NEW_NUMBER = 4;
        service.changeAngle(NEW_NUMBER);
        expect(service.degree).toBe(NEW_NUMBER);
    });
    it(' onMouseDown should set shape fields according to the mouse position and current configurations', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 0, // TODO: Avoir ceci dans un enum accessible
        } as MouseEvent;
        service['mouseDown'] = true;
        service.onMouseDown(mouseEventRClick);
        expect(service['shape'].topLeft).toEqual(service.mouseDownCoord);
        const BOTTOM_RIGHT: Vec2 = { x: service['shape'].topLeft.x + service.imageSize, y: service['shape'].topLeft.y + service.imageSize };
        expect(service['shape'].bottomRight).toEqual(BOTTOM_RIGHT);
        expect(service['shape'].angle).toEqual(service.angle);
        expect(historyService.isLocked).toBeTrue();
    });
    it('onWheel should increment and decrement angle by 15 when alt is not pressed', () => {
        const WHEEL_EVENT_POSITIVE = new WheelEvent('onwheel', { deltaY: -125, altKey: false });
        const WHEEL_EVENT_NEGATIVE = new WheelEvent('onwheel', { deltaY: 125, altKey: false });
        service.degree = service.angle = 0;
        service.onWheel(WHEEL_EVENT_POSITIVE);
        expect(service.degree).toBe(Constants.MAX_DEGREES_INCREMENT);
        service.degree = service.angle = 0;
        service.onWheel(WHEEL_EVENT_NEGATIVE);
        expect(service.degree).toBe((-Constants.MAX_DEGREES_INCREMENT % Constants.MAX_DEGREE) + Constants.MAX_DEGREE);
    });
    it('onWheel should increment and decrement angle by 1 when alt is pressed', () => {
        const WHEEL_EVENT_POSITIVE = new WheelEvent('onwheel', { deltaY: -125, altKey: true });
        const WHEEL_EVENT_NEGATIVE = new WheelEvent('onwheel', { deltaY: 125, altKey: true });
        service.degree = service.angle = 0;
        service.onWheel(WHEEL_EVENT_POSITIVE);
        expect(service.degree).toBe(Constants.MIN_DEGREES_INCREMENT);
        service.degree = service.angle = 0;
        service.onWheel(WHEEL_EVENT_NEGATIVE);
        expect(service.degree).toBe((-Constants.MIN_DEGREES_INCREMENT % Constants.MAX_DEGREE) + Constants.MAX_DEGREE);
    });
    it('selectStamp sets the shape src to the src of the image clicked', () => {
        const TARGET = new Image();
        TARGET.src = 'test';
        const EVENT = { target: TARGET } as any;
        service.selectStamp(EVENT, 0);
        expect(service['shape'].src).toBe(TARGET.src);
    });
});
