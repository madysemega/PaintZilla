import { TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material/slider';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { ShapeType } from '@app/app/classes/shape-type';
import { Vec2 } from '@app/app/classes/vec2';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { PolygonService } from './polygon.service';
// tslint:disable: no-any
describe('PolygonService', () => {
    let service: PolygonService;
    // const ORIGIN_COORDINATES: Vec2 = { x: 0, y: 0 };
    // const NON_NULL_COORDINATES: Vec2 = { x: 3, y: 4 };
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawPolygonSpy: jasmine.Spy<any>;
    let drawPerimeterSpy: jasmine.Spy<any>;
    let previewCtxStrokeSpy: jasmine.Spy<any>;
    let previewCtxFillSpy: jasmine.Spy<any>;
    let baseCtxStrokeSpy: jasmine.Spy<any>;
    let baseCtxFillSpy: jasmine.Spy<any>;

    let canvasPosition: Vec2;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setCursorType']);

        TestBed.configureTestingModule({ providers: [{ provide: DrawingService, useValue: drawServiceSpy }] });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        canvas = canvasTestHelper.canvas;
        canvasPosition = { x: 50, y: 40 };
        service = TestBed.inject(PolygonService);
        spyOn(canvas, 'getBoundingClientRect').and.callFake(
            jasmine
                .createSpy('getBoundingClientRect')
                .and.returnValue({ top: 1, height: 100, left: 2, width: 200, right: 202, x: canvasPosition.x, y: canvasPosition.y }),
        );
        drawPolygonSpy = spyOn<any>(service, 'drawPolygon').and.callThrough();
        previewCtxStrokeSpy = spyOn<any>(previewCtxStub, 'stroke').and.callThrough();
        previewCtxFillSpy = spyOn<any>(previewCtxStub, 'fill').and.callThrough();
        baseCtxStrokeSpy = spyOn<any>(baseCtxStub, 'stroke').and.callThrough();
        baseCtxFillSpy = spyOn<any>(baseCtxStub, 'fill').and.callThrough();
        drawPerimeterSpy = spyOn<any>(service, 'drawPerimeter').and.callThrough();

        // tslint:disable: no-string-literal
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

    it('onMouseDown calls drawPerimeter', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawPerimeterSpy).toHaveBeenCalled();
    });
    it(' onMouseUp should call stroke on base canvas if shape type is ContouredAndFilled', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.shapeType = ShapeType.ContouredAndFilled;
        service.onMouseUp(mouseEvent);
        expect(baseCtxStrokeSpy).toHaveBeenCalled();
    });
    it(' onMouseMove should not call fill on preview canvas if shape type is Contoured', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.shapeType = ShapeType.Contoured;
        service.onMouseMove(mouseEvent);
        expect(previewCtxFillSpy).not.toHaveBeenCalled();
    });
    it(' onMouseUp should call fill on base canvas if shape type is Filled', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.shapeType = ShapeType.Filled;
        service.onMouseUp(mouseEvent);
        expect(baseCtxFillSpy).toHaveBeenCalled();
    });
    it(' onMouseMove should call stroke on preview canvas if shape type is Contoured', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.shapeType = ShapeType.Contoured;
        service.onMouseMove(mouseEvent);
        expect(previewCtxStrokeSpy).toHaveBeenCalled();
    });
    it(' onMouseMove should call drawPolygon', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.shapeType = ShapeType.Contoured;
        service.onMouseMove(mouseEvent);
        expect(drawPolygonSpy).toHaveBeenCalled();
    });
    it(' onMouseMove should call drawPolygon', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;
        service.onMouseMove(mouseEvent);
        expect(drawPolygonSpy).not.toHaveBeenCalled();
    });
    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: mouseEvent.clientX - canvasPosition.x, y: mouseEvent.clientY - canvasPosition.y };
        service.mouseInCanvas = true;
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });
    it(' onMouseDown should set mouseDown to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1, // TODO: Avoir ceci dans un enum accessible
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });
    it(' changeNbSides should change numberSides', () => {
        const SLIDER_EVENT = new MatSliderChange();
        const NEW_NUMBER = 4;
        SLIDER_EVENT.value = NEW_NUMBER;
        service.changeNbSides(SLIDER_EVENT);
        expect(service.numberSides).toEqual(SLIDER_EVENT.value);
    });
    it(' onToolSelect should put cursorType to crossHair', () => {
        service.onToolSelect();
        expect(drawServiceSpy.setCursorType).toHaveBeenCalledWith(CursorType.CROSSHAIR);
    });
    it(' onMouseUp should not call drawPolygon if mouseDown is false', () => {
        service.mouseDown = false;
        service.onMouseUp(mouseEvent);
        expect(drawPolygonSpy).not.toHaveBeenCalled();
    });
    it(` getSquareEndPoint should return a translation of startPoint by the smallest component
    with the appropriate orientation`, () => {
        const START_POINT_1 = { x: 3, y: 0 };
        const ASYMMETRIC_POINT_1 = { x: 0, y: 4 };
        const LENGTH_DIFF_1 = ASYMMETRIC_POINT_1.x - START_POINT_1.x;
        const EXPECTED_VEC_1: Vec2 = { x: START_POINT_1.x + LENGTH_DIFF_1, y: START_POINT_1.y - LENGTH_DIFF_1 };
        const RESULT_1 = service.getSquareEndPoint(START_POINT_1, ASYMMETRIC_POINT_1);

        const START_POINT_2 = { x: 0, y: 3 };
        const ASYMMETRIC_POINT_2 = { x: 4, y: 0 };
        const LENGTH_DIFF_2 = ASYMMETRIC_POINT_2.y - START_POINT_2.y;
        const EXPECTED_VEC_2: Vec2 = { x: START_POINT_2.x - LENGTH_DIFF_2, y: START_POINT_2.y + LENGTH_DIFF_2 };
        const RESULT_2 = service.getSquareEndPoint(START_POINT_2, ASYMMETRIC_POINT_2);

        expect(RESULT_1).toEqual(EXPECTED_VEC_1);
        expect(RESULT_2).toEqual(EXPECTED_VEC_2);
    });
});
