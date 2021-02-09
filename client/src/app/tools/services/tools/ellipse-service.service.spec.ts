import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { ShapeType } from '@app/app/classes/shape-type';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing/drawing.service';
import { EllipseService } from './ellipse-service.service';

// tslint:disable:no-any
// tslint:disable:max-file-line-count
describe('EllipseService', () => {
    let service: EllipseService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawEllipseSpy: jasmine.Spy<any>;
    let getSquareAjustedPerimeterSpy: jasmine.Spy<any>;
    let previewCtxStrokeSpy: jasmine.Spy<any>;
    let previewCtxFillSpy: jasmine.Spy<any>;
    let baseCtxStrokeSpy: jasmine.Spy<any>;
    let baseCtxFillSpy: jasmine.Spy<any>;

    let canvasPosition: Vec2;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        canvas = canvasTestHelper.canvas;
        canvasPosition = { x: 50, y: 40 };

        service = TestBed.inject(EllipseService);
        spyOn(canvas, 'getBoundingClientRect').and.callFake(
            jasmine
                .createSpy('getBoundingClientRect')
                .and.returnValue({ top: 1, height: 100, left: 2, width: 200, right: 202, x: canvasPosition.x, y: canvasPosition.y }),
        );

        drawEllipseSpy = spyOn<any>(service, 'drawEllipse').and.callThrough();
        getSquareAjustedPerimeterSpy = spyOn<any>(service, 'getSquareAjustedPerimeter').and.callThrough();
        previewCtxStrokeSpy = spyOn<any>(previewCtxStub, 'stroke').and.callThrough();
        previewCtxFillSpy = spyOn<any>(previewCtxStub, 'fill').and.callThrough();
        baseCtxStrokeSpy = spyOn<any>(baseCtxStub, 'stroke').and.callThrough();
        baseCtxFillSpy = spyOn<any>(baseCtxStub, 'fill').and.callThrough();

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
        service.mouseInCanvas = true;
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1, // TODO: Avoir ceci dans un enum accessible
        } as MouseEvent;
        service.mouseInCanvas = true;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should call drawEllipse if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawEllipseSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawEllipse if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(drawEllipseSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawEllipse if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawEllipseSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawEllipse if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawEllipseSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call stroke on preview canvas if shape type is Contoured', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.shapeType = ShapeType.Contoured;
        service.onMouseMove(mouseEvent);
        expect(previewCtxStrokeSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should call stroke on preview canvas if shape type is ContouredAndFilled', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.shapeType = ShapeType.ContouredAndFilled;
        service.onMouseMove(mouseEvent);
        expect(previewCtxStrokeSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should call fill on preview canvas if shape type is Filled', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.shapeType = ShapeType.Filled;
        service.onMouseMove(mouseEvent);
        expect(previewCtxFillSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should call fill on preview canvas if shape type is ContouredAndFilled', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.shapeType = ShapeType.ContouredAndFilled;
        service.onMouseMove(mouseEvent);
        expect(previewCtxFillSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call fill on preview canvas if shape type is Contoured', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.shapeType = ShapeType.Contoured;
        service.onMouseMove(mouseEvent);
        expect(previewCtxFillSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should call stroke on base canvas if shape type is Contoured', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.shapeType = ShapeType.Contoured;
        service.onMouseUp(mouseEvent);
        expect(baseCtxStrokeSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should call stroke on base canvas if shape type is ContouredAndFilled', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.shapeType = ShapeType.ContouredAndFilled;
        service.onMouseUp(mouseEvent);
        expect(baseCtxStrokeSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should call fill on base canvas if shape type is Filled', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.shapeType = ShapeType.Filled;
        service.onMouseUp(mouseEvent);
        expect(baseCtxFillSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should call fill on base canvas if shape type is ContouredAndFilled', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.shapeType = ShapeType.ContouredAndFilled;
        service.onMouseUp(mouseEvent);
        expect(baseCtxFillSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call fill on base canvas if shape type is Contoured', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.shapeType = ShapeType.Contoured;
        service.onMouseUp(mouseEvent);
        expect(baseCtxFillSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should not call stroke on base canvas if shape type is Filled', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.shapeType = ShapeType.Filled;
        service.onMouseUp(mouseEvent);
        expect(baseCtxStrokeSpy).not.toHaveBeenCalled();
    });

    it('ajustLineWidth should set strokeWidth attribute to the correct value', () => {
        const lineWidth = 3;

        service.adjustLineWidth(lineWidth);
        expect(service.lineWidth).toBe(lineWidth);
    });

    it('onKeyDown should set isShiftDown to true if event was triggered from shift key', () => {
        const keyboardEvent: KeyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;

        service.startPoint = {
            x: 0,
            y: 0,
        };

        service.lastMousePosition = {
            x: 3,
            y: 4,
        };

        service.isShiftDown = false;
        service.onKeyDown(keyboardEvent);
        expect(service.isShiftDown).toBe(true);

        service.isShiftDown = true;
        service.onKeyDown(keyboardEvent);
        expect(service.isShiftDown).toBe(true);
    });

    it('onKeyDown should not set isShiftDown to true if event was not triggered from shift key', () => {
        const keyboardEvent: KeyboardEvent = {
            key: 'c',
        } as KeyboardEvent;

        service.isShiftDown = false;
        service.onKeyDown(keyboardEvent);
        expect(service.isShiftDown).toBe(false);

        service.isShiftDown = true;
        service.onKeyDown(keyboardEvent);
        expect(service.isShiftDown).toBe(true);
    });

    it('onKeyUp should set isShiftDown to false if event was triggered from shift key', () => {
        const keyboardEvent: KeyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;

        service.startPoint = {
            x: 0,
            y: 0,
        };

        service.lastMousePosition = {
            x: 3,
            y: 4,
        };

        service.isShiftDown = false;
        service.onKeyUp(keyboardEvent);
        expect(service.isShiftDown).toBe(false);

        service.isShiftDown = true;
        service.onKeyUp(keyboardEvent);
        expect(service.isShiftDown).toBe(false);
    });

    it('onKeyUp should not set isShiftDown to false if event was not triggered from shift key', () => {
        const keyboardEvent: KeyboardEvent = {
            key: 'c',
        } as KeyboardEvent;

        service.isShiftDown = false;
        service.onKeyUp(keyboardEvent);
        expect(service.isShiftDown).toBe(false);

        service.isShiftDown = true;
        service.onKeyUp(keyboardEvent);
        expect(service.isShiftDown).toBe(true);
    });

    it('getSquareAjustedPerimeter should return a square if given a square', () => {
        const startPoint: Vec2 = {
            x: 3,
            y: 5,
        };

        const endPoint: Vec2 = {
            x: 6,
            y: 8,
        };

        const expectedResult: Vec2 = {
            x: 6,
            y: 8,
        };

        const obtainedResult: Vec2 = service.getSquareAjustedPerimeter(startPoint, endPoint);
        expect(obtainedResult).toEqual(expectedResult);
    });

    it('getSquareAjustedPerimeter should return the biggest square possible if given a rectangle', () => {
        const startPoint: Vec2 = {
            x: 3,
            y: 5,
        };

        const endPoint: Vec2 = {
            x: 8,
            y: 8,
        };

        const expectedResult: Vec2 = {
            x: 6,
            y: 8,
        };

        const obtainedResult: Vec2 = service.getSquareAjustedPerimeter(startPoint, endPoint);
        expect(obtainedResult).toEqual(expectedResult);
    });

    it('getSquareAjustedPerimeter should return a bottom-left bound square if given a bottom-left bound rectangle', () => {
        const startPoint: Vec2 = {
            x: 0,
            y: 0,
        };

        const endPoint: Vec2 = {
            x: -3,
            y: 8,
        };

        const expectedResult: Vec2 = {
            x: -3,
            y: 3,
        };

        const obtainedResult: Vec2 = service.getSquareAjustedPerimeter(startPoint, endPoint);
        expect(obtainedResult).toEqual(expectedResult);
    });

    it('getSquareAjustedPerimeter should return a top-left bound square if given a top-left bound rectangle', () => {
        const startPoint: Vec2 = {
            x: 0,
            y: 0,
        };

        const endPoint: Vec2 = {
            x: -3,
            y: -8,
        };

        const expectedResult: Vec2 = {
            x: -3,
            y: -3,
        };

        const obtainedResult: Vec2 = service.getSquareAjustedPerimeter(startPoint, endPoint);
        expect(obtainedResult).toEqual(expectedResult);
    });

    it('getSquareAjustedPerimeter should return a bottom-right bound square if given a bottom-right bound rectangle', () => {
        const startPoint: Vec2 = {
            x: 0,
            y: 0,
        };

        const endPoint: Vec2 = {
            x: 3,
            y: 8,
        };

        const expectedResult: Vec2 = {
            x: 3,
            y: 3,
        };

        const obtainedResult: Vec2 = service.getSquareAjustedPerimeter(startPoint, endPoint);
        expect(obtainedResult).toEqual(expectedResult);
    });

    it('getSquareAjustedPerimeter should return a top-right bound square if given a top-right bound rectangle', () => {
        const startPoint: Vec2 = {
            x: 0,
            y: 0,
        };

        const endPoint: Vec2 = {
            x: 3,
            y: -8,
        };

        const expectedResult: Vec2 = {
            x: 3,
            y: -3,
        };

        const obtainedResult: Vec2 = service.getSquareAjustedPerimeter(startPoint, endPoint);
        expect(obtainedResult).toEqual(expectedResult);
    });

    it('drawPerimeter should call getSquareAjustedPerimeter with correct start and end points if shift key is pressed', () => {
        const drawingContext = drawServiceSpy.previewCtx;

        const startPoint: Vec2 = {
            x: 3,
            y: 5,
        };

        const endPoint: Vec2 = {
            x: 8,
            y: 8,
        };

        service.isShiftDown = true;
        service.drawPerimeter(drawingContext, startPoint, endPoint);
        expect(getSquareAjustedPerimeterSpy).toHaveBeenCalledWith(startPoint, endPoint);
    });

    it('drawPerimeter should not call getSquareAjustedPerimeter with correct start and end points if shift key is not pressed', () => {
        const drawingContext = drawServiceSpy.previewCtx;

        const startPoint: Vec2 = {
            x: 3,
            y: 5,
        };

        const endPoint: Vec2 = {
            x: 8,
            y: 8,
        };

        service.isShiftDown = false;
        service.drawPerimeter(drawingContext, startPoint, endPoint);
        expect(getSquareAjustedPerimeterSpy).not.toHaveBeenCalledWith(startPoint, endPoint);
    });

    it('drawEllipse should call getSquareAjustedPerimeter with correct start and end points if shift key is pressed', () => {
        const drawingContext = drawServiceSpy.previewCtx;

        const startPoint: Vec2 = {
            x: 3,
            y: 5,
        };

        const endPoint: Vec2 = {
            x: 8,
            y: 8,
        };

        service.isShiftDown = true;
        service.drawEllipse(drawingContext, startPoint, endPoint);
        expect(getSquareAjustedPerimeterSpy).toHaveBeenCalledWith(startPoint, endPoint);
    });

    it('drawEllipse should not call getSquareAjustedPerimeter with correct start and end points if shift key is not pressed', () => {
        const drawingContext = drawServiceSpy.previewCtx;

        const startPoint: Vec2 = {
            x: 3,
            y: 5,
        };

        const endPoint: Vec2 = {
            x: 8,
            y: 8,
        };

        service.isShiftDown = false;
        service.drawEllipse(drawingContext, startPoint, endPoint);
        expect(getSquareAjustedPerimeterSpy).not.toHaveBeenCalledWith(startPoint, endPoint);
    });

    it(' should change the pixel of the canvas ', () => {
        mouseEvent = { clientX: canvasPosition.x, clientY: canvasPosition.y, button: 0 } as MouseEvent;
        service.mouseInCanvas = true;
        service.onMouseDown(mouseEvent);
        mouseEvent = { clientX: canvasPosition.x + 1, clientY: canvasPosition.y, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);

        // Premier pixel seulement
        const imageData: ImageData = baseCtxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData.data[3]).not.toEqual(0); // A
    });
});
