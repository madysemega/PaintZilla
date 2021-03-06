import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { ShapeType } from '@app/app/classes/shape-type';
import { Vec2 } from '@app/app/classes/vec2';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { EllipseService } from './ellipse-service';

// tslint:disable:no-any
// tslint:disable:max-file-line-count
describe('EllipseService', () => {
    const ORIGIN_COORDINATES: Vec2 = { x: 0, y: 0 };
    const NON_NULL_COORDINATES: Vec2 = { x: 3, y: 4 };

    let service: EllipseService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let historyService: HistoryService;
    let colourService: ColourService;
    let keyboardServiceStub: jasmine.SpyObj<KeyboardService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawEllipseSpy: jasmine.Spy<any>;
    let getSquareAdjustedPerimeterSpy: jasmine.Spy<any>;
    let previewCtxStrokeSpy: jasmine.Spy<any>;
    let previewCtxFillSpy: jasmine.Spy<any>;
    let baseCtxStrokeSpy: jasmine.Spy<any>;
    let baseCtxFillSpy: jasmine.Spy<any>;
    let finalizeSpy: jasmine.Spy<any>;

    let canvasPosition: Vec2;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        keyboardServiceStub = jasmine.createSpyObj('KeyboardService', ['registerAction', 'saveContext', 'restoreContext']);
        keyboardServiceStub.registerAction.and.stub();
        keyboardServiceStub.saveContext.and.stub();
        keyboardServiceStub.restoreContext.and.stub();
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        historyService = new HistoryService(keyboardServiceStub);
        colourService = new ColourService({} as ColourPickerService);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: HistoryService, useValue: historyService },
                { provide: ColourService, useValue: colourService },
            ],
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
        finalizeSpy = spyOn<any>(service, 'finalize').and.callThrough();
        getSquareAdjustedPerimeterSpy = spyOn<any>(service, 'getSquareAdjustedPerimeter').and.callThrough();
        previewCtxStrokeSpy = spyOn<any>(previewCtxStub, 'stroke').and.callThrough();
        previewCtxFillSpy = spyOn<any>(previewCtxStub, 'fill').and.callThrough();
        baseCtxStrokeSpy = spyOn<any>(baseCtxStub, 'stroke').and.callThrough();
        baseCtxFillSpy = spyOn<any>(baseCtxStub, 'fill').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvas;

        service.lastMousePosition = { x: 6, y: 8 };
        service.startPoint = { x: 1, y: 6 };

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

    it(' finalize should call drawEllipse if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.finalize();
        expect(drawEllipseSpy).toHaveBeenCalled();
    });

    it(' finalize should not call drawEllipse if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.finalize();
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

    it('onMouseUp should call finalize()', () => {
        service.onMouseUp(mouseEvent);
        expect(finalizeSpy).toHaveBeenCalled();
    });

    it(' finalize should call stroke on base canvas if shape type is Contoured', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.shapeType = ShapeType.Contoured;
        service.finalize();
        expect(baseCtxStrokeSpy).toHaveBeenCalled();
    });

    it(' finalize should call stroke on base canvas if shape type is ContouredAndFilled', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.shapeType = ShapeType.ContouredAndFilled;
        service.finalize();
        expect(baseCtxStrokeSpy).toHaveBeenCalled();
    });

    it(' finalize should call fill on base canvas if shape type is Filled', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.shapeType = ShapeType.Filled;
        service.finalize();
        expect(baseCtxFillSpy).toHaveBeenCalled();
    });

    it(' finalize should call fill on base canvas if shape type is ContouredAndFilled', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.shapeType = ShapeType.ContouredAndFilled;
        service.finalize();
        expect(baseCtxFillSpy).toHaveBeenCalled();
    });

    it(' finalize should not call fill on base canvas if shape type is Contoured', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.shapeType = ShapeType.Contoured;
        service.finalize();
        expect(baseCtxFillSpy).not.toHaveBeenCalled();
    });

    it(' finalize should not call stroke on base canvas if shape type is Filled', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.shapeType = ShapeType.Filled;
        service.finalize();
        expect(baseCtxStrokeSpy).not.toHaveBeenCalled();
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

    it('getSquareAdjustedPerimeter should return a square if given a square', () => {
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

        const obtainedResult: Vec2 = service.getSquareAdjustedPerimeter(startPoint, endPoint);
        expect(obtainedResult).toEqual(expectedResult);
    });

    it('getSquareAdjustedPerimeter should return the biggest square possible if given a rectangle', () => {
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

        const obtainedResult: Vec2 = service.getSquareAdjustedPerimeter(startPoint, endPoint);
        expect(obtainedResult).toEqual(expectedResult);
    });

    it('getSquareAdjustedPerimeter should return a bottom-left bound square if given a bottom-left bound rectangle', () => {
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

        const obtainedResult: Vec2 = service.getSquareAdjustedPerimeter(startPoint, endPoint);
        expect(obtainedResult).toEqual(expectedResult);
    });

    it('getSquareAdjustedPerimeter should return a top-left bound square if given a top-left bound rectangle', () => {
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

        const obtainedResult: Vec2 = service.getSquareAdjustedPerimeter(startPoint, endPoint);
        expect(obtainedResult).toEqual(expectedResult);
    });

    it('getSquareAdjustedPerimeter should return a bottom-right bound square if given a bottom-right bound rectangle', () => {
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

        const obtainedResult: Vec2 = service.getSquareAdjustedPerimeter(startPoint, endPoint);
        expect(obtainedResult).toEqual(expectedResult);
    });

    it('getSquareAdjustedPerimeter should return a top-right bound square if given a top-right bound rectangle', () => {
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

        const obtainedResult: Vec2 = service.getSquareAdjustedPerimeter(startPoint, endPoint);
        expect(obtainedResult).toEqual(expectedResult);
    });

    it('drawPerimeter should call getSquareAdjustedPerimeter with correct start and end points if shift key is pressed', () => {
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
        expect(getSquareAdjustedPerimeterSpy).toHaveBeenCalledWith(startPoint, endPoint);
    });

    it('drawPerimeter should not call getSquareAdjustedPerimeter with correct start and end points if shift key is not pressed', () => {
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
        expect(getSquareAdjustedPerimeterSpy).not.toHaveBeenCalledWith(startPoint, endPoint);
    });

    it('drawEllipse should call getSquareAdjustedPerimeter with correct start and end points if shift key is pressed', () => {
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
        expect(getSquareAdjustedPerimeterSpy).toHaveBeenCalledWith(startPoint, endPoint);
    });

    it('drawEllipse should not call getSquareAdjustedPerimeter with correct start and end points if shift key is not pressed', () => {
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
        expect(getSquareAdjustedPerimeterSpy).not.toHaveBeenCalledWith(startPoint, endPoint);
    });

    it('shift key down should preview ellipse if left mouse button is down', () => {
        service.startPoint = ORIGIN_COORDINATES;
        service.lastMousePosition = NON_NULL_COORDINATES;

        service.mouseDown = true;

        service.onKeyDown({ key: 'Shift' } as KeyboardEvent);
        expect(drawEllipseSpy).toHaveBeenCalled();
    });

    it('shift key down should not preview ellipse if left mouse button is up', () => {
        service.startPoint = ORIGIN_COORDINATES;
        service.lastMousePosition = NON_NULL_COORDINATES;

        service.mouseDown = false;

        service.onKeyDown({ key: 'Shift' } as KeyboardEvent);
        expect(drawEllipseSpy).not.toHaveBeenCalled();
    });

    it('shift key up should preview ellipse if left mouse button is down', () => {
        service.startPoint = ORIGIN_COORDINATES;
        service.lastMousePosition = NON_NULL_COORDINATES;

        service.mouseDown = true;

        service.onKeyUp({ key: 'Shift' } as KeyboardEvent);
        expect(drawEllipseSpy).toHaveBeenCalled();
    });

    it('shift key up should not preview ellipse if left mouse button is up', () => {
        service.startPoint = ORIGIN_COORDINATES;
        service.lastMousePosition = NON_NULL_COORDINATES;

        service.mouseDown = false;

        service.onKeyUp({ key: 'Shift' } as KeyboardEvent);
        expect(drawEllipseSpy).not.toHaveBeenCalled();
    });

    it('when primary colour changes, so should fill style', (done) => {
        const COLOUR = Colour.hexToRgb('424242');

        colourService.primaryColourChanged.subscribe(() => {
            expect(service['fillStyleProperty'].colour).toEqual(COLOUR);
            done();
        });

        colourService.setPrimaryColour(COLOUR);
    });

    it('when secondary colour changes, so should stroke style', (done) => {
        const COLOUR = Colour.hexToRgb('424242');

        colourService.secondaryColourChanged.subscribe(() => {
            expect(service['strokeStyleProperty'].colour).toEqual(COLOUR);
            done();
        });

        colourService.setSecondaryColour(COLOUR);
    });

    it('when tool is deselected, it should unlock the history service', () => {
        historyService.isLocked = true;
        service.onToolDeselect();
        expect(historyService.isLocked).toBeFalse();
    });

    it('when line width changes, stroke width property should as well', () => {
        const INITIAL_LINE_WIDTH = 1;
        const NEW_LINE_WIDTH = 3;

        service['strokeWidthProperty'].strokeWidth = INITIAL_LINE_WIDTH;

        service.lineWidth = NEW_LINE_WIDTH;
        service.onLineWidthChanged();

        expect(service['strokeWidthProperty'].strokeWidth).toEqual(NEW_LINE_WIDTH);
    });
});
