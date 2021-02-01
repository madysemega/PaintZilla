import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ShapeType } from '@app/classes/shape-type';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from './rectangle.service';

// tslint:disable:no-any
describe('RectangleService', () => {
    let service: RectangleService;
    let mouseEvent: MouseEvent;
    let keyboardShiftEvent: KeyboardEvent;
    let keyboardSpaceEvent: KeyboardEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawRectSpy: jasmine.Spy<any>;
    let previewCtxStrokeSpy: jasmine.Spy<any>;
    let previewCtxFillSpy: jasmine.Spy<any>;
    let baseCtxStrokeSpy: jasmine.Spy<any>;
    let baseCtxFillSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(RectangleService);

        drawRectSpy = spyOn<any>(service, 'drawRect').and.callThrough();
        previewCtxStrokeSpy = spyOn<any>(previewCtxStub, 'strokeRect').and.callThrough();
        previewCtxFillSpy = spyOn<any>(previewCtxStub, 'fillRect').and.callThrough();
        baseCtxStrokeSpy = spyOn<any>(baseCtxStub, 'strokeRect').and.callThrough();
        baseCtxFillSpy = spyOn<any>(baseCtxStub, 'fillRect').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;

        keyboardShiftEvent = {
            key: "Shift"
        } as KeyboardEvent;

        keyboardSpaceEvent = {
            key: "Space"
        } as KeyboardEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
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

    it(' onMouseUp should call drawRect if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawRectSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawRect if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(drawRectSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawRect if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawRectSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawRect if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawRectSpy).not.toHaveBeenCalled();
    });

    it(' onKeyDown should call drawRect if key == Shift', () => {
        service.mouseDown = true;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onKeyDown(keyboardShiftEvent);
        expect(drawRectSpy).toHaveBeenCalled();
    });

    it(' onKeyDown should call drawRect if key != Shift', () => {
        service.mouseDown = true;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onKeyDown(keyboardSpaceEvent);
        expect(drawRectSpy).not.toHaveBeenCalled();
    });

    it(' onKeyUp should call drawRect if key == Shift', () => {
        service.mouseDown = true;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onKeyUp(keyboardShiftEvent);
        expect(drawRectSpy).toHaveBeenCalled();
    });

    it(' onKeyUp should not call drawRect if key != Shift', () => {
        service.mouseDown = true;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onKeyUp(keyboardSpaceEvent);
        expect(drawRectSpy).not.toHaveBeenCalled();
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
        ////////////////////////
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
        ////////////////////////
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

    it(' should change the pixel of the canvas ', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 1, offsetY: 0, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
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
