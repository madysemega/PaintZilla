import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing/drawing.service';
import { PencilService } from './pencil-service';

// tslint:disable:no-any
describe('PencilService', () => {
    let service: PencilService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    let drawSegmentsSpy: jasmine.Spy<any>;
    let drawPointSpy: jasmine.Spy<any>;
    let createNewSegmentSpy: jasmine.Spy<any>;
    let adjustLineWidthSpy: jasmine.Spy<any>;


    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(PencilService);
        drawSegmentsSpy = spyOn<any>(service, 'drawSegments').and.callThrough();
        drawPointSpy = spyOn<any>(service, 'drawPoint').and.callThrough();
        createNewSegmentSpy = spyOn<any>(service, 'createNewSegment').and.callThrough();
        adjustLineWidthSpy = spyOn<any>(service, 'adjustLineWidth').and.callThrough();


        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.mouseInCanvas = true;
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

    it(' onMouseUp should call drawSegments if mouse was already down', () => {
        service.mouseInCanvas = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawSegmentsSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawSegments if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(drawSegmentsSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawSegments if mouse was already down and createSegments has been called', () => {
        service.mouseInCanvas = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseDown(mouseEvent);

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawSegmentsSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawSegments if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawSegmentsSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawPoint if mouse was down but did not move', () => {
        service.mouseInCanvas = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawPointSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawPoint if mouse was not down', () => {
        service.mouseInCanvas = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseUp(mouseEvent);
        expect(drawPointSpy).not.toHaveBeenCalled();
    });

    it(' onMouseLeave should set mouseInCanvas property to false when leaving the canvas', () => {
        service.onMouseLeave(mouseEvent);
        expect(service.mouseInCanvas).toEqual(false);
    });

    it(' onMouseEnter should set mouseInCanvas property to true when entering the canvas', () => {
        service.onMouseEnter(mouseEvent);
        expect(service.mouseInCanvas).toEqual(true);
    });

    it(' onMouseEnter should call createNewSegment if mouse was down', () => {
        service.mouseInCanvas = false;
        service.mouseDown = true;

        service.onMouseEnter(mouseEvent);
        expect(createNewSegmentSpy).toHaveBeenCalled();
    });

    it(' onMouseEnter should not call createNewSegment if mouse was not down', () => {
        service.mouseInCanvas = false;
        service.mouseDown = false;

        service.onMouseEnter(mouseEvent);
        expect(createNewSegmentSpy).not.toHaveBeenCalled();
    });

    it('Adjusting the line width should update the lineWidth property', () => {
        const testVal = 27;
        service.adjustLineWidth(testVal);
        expect(service.lineWidth).toEqual(testVal);
    });

    // Exemple de test d'intégration qui est quand même utile
    it(' should change the pixel of the canvas ', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0 } as MouseEvent;
        service.mouseInCanvas = true;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 1, offsetY: 0, button: 0 } as MouseEvent;
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
