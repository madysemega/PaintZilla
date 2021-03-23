import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { EraserService } from './eraser-service';

// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('EraserService', () => {
    let service: EraserService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    let finalizeSpy: jasmine.Spy<any>;

    let drawVerticesSpy: jasmine.Spy<any>;
    let historyStub: HistoryService;

    let canvasPosition: Vec2;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setCursorType']);
        historyStub = new HistoryService();

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: HistoryService, useValue: historyStub },
            ],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        canvas = canvasTestHelper.canvas;
        canvasPosition = { x: 50, y: 40 };

        service = TestBed.inject(EraserService);

        spyOn(canvas, 'getBoundingClientRect').and.callFake(
            jasmine
                .createSpy('getBoundingClientRect')
                .and.returnValue({ top: 1, height: 100, left: 2, width: 200, right: 202, x: canvasPosition.x, y: canvasPosition.y }),
        );

        drawVerticesSpy = spyOn<any>(service, 'drawVertices').and.callThrough();
        finalizeSpy = spyOn<any>(service, 'finalize').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
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

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: mouseEvent.clientX - canvasPosition.x, y: mouseEvent.clientY - canvasPosition.y };
        service.mouseInCanvas = true;
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseMove should set the mouse to move', () => {
        service.onMouseMove(mouseEvent);
        expect(service.getPositionFromMouse(mouseEvent)).toEqual({ x: 50, y: 60 });
    });

    it(' onToolDeselect should change the cursor to crosshair', () => {
        service.onToolDeselect();
        expect(drawServiceSpy.canvas.style.cursor).toEqual('');
    });
    it(' onMouseMove should call drawSegments if mouse was already down and createSegments has been called', () => {
        service.mouseInCanvas = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseDown(mouseEvent);

        service.onMouseMove(mouseEvent);

        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawVerticesSpy).toHaveBeenCalled();
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1, // TODO: Avoir ceci dans un enum accessible
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should call finalize if mouse was already down', () => {
        service.mouseInCanvas = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(finalizeSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call finalize if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(finalizeSpy).not.toHaveBeenCalled();
    });

    it('When line width property changes, so should the stroke width property', () => {
        const NEW_STROKE_WIDTH = 42;

        service.lineWidth = NEW_STROKE_WIDTH;
        service.onLineWidthChanged();

        expect(service['strokeWidthProperty'].strokeWidth).toEqual(NEW_STROKE_WIDTH);
    });

    it('When tool is selected, it should hide the cursor', () => {
        service.onToolSelect();
        expect(drawServiceSpy.setCursorType).toHaveBeenCalledWith(CursorType.NONE);
    });
});
