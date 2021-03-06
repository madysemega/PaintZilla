import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { PencilService } from './pencil-service';

// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('PencilService', () => {
    let service: PencilService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let historyServiceStub: HistoryService;
    let colourServiceStub: ColourService;
    let keyboardServiceStub: jasmine.SpyObj<KeyboardService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    let drawVerticesSpy: jasmine.Spy<any>;

    let canvasPosition: Vec2;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        keyboardServiceStub = jasmine.createSpyObj('KeyboardService', ['registerAction', 'saveContext', 'restoreContext']);
        keyboardServiceStub.registerAction.and.stub();
        keyboardServiceStub.saveContext.and.stub();
        keyboardServiceStub.restoreContext.and.stub();
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        historyServiceStub = new HistoryService(keyboardServiceStub);
        colourServiceStub = new ColourService({} as ColourPickerService);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: HistoryService, useValue: historyServiceStub },
                { provide: ColourService, useValue: colourServiceStub },
            ],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        canvas = canvasTestHelper.canvas;
        canvasPosition = { x: 50, y: 40 };

        service = TestBed.inject(PencilService);

        spyOn(canvas, 'getBoundingClientRect').and.callFake(
            jasmine
                .createSpy('getBoundingClientRect')
                .and.returnValue({ top: 1, height: 100, left: 2, width: 200, right: 202, x: canvasPosition.x, y: canvasPosition.y }),
        );

        drawVerticesSpy = spyOn<any>(service['renderer'], 'render').and.callThrough();

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

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1, // TODO: Avoir ceci dans un enum accessible
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should call register a new user action if mouse was already down', () => {
        const historyRegisterSpy = spyOn(historyServiceStub, 'register');

        service.mouseInCanvas = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(historyRegisterSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawSegments if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(drawVerticesSpy).not.toHaveBeenCalled();
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

    it(' onMouseMove should not call drawSegments if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawVerticesSpy).not.toHaveBeenCalled();
    });

    it('when stroke width changes, it should be reflected in the stroke width property', () => {
        const INITIAL_LINE_WIDTH = 1;
        const NEW_LINE_WIDTH = 3;

        service['strokeWidthProperty'].strokeWidth = INITIAL_LINE_WIDTH;

        service.lineWidth = NEW_LINE_WIDTH;
        service.onLineWidthChanged();

        expect(service['strokeWidthProperty'].strokeWidth).toEqual(NEW_LINE_WIDTH);
    });

    it('when primary colour changes, it should be reflected in the colour property', (done) => {
        const GIVEN_COLOUR = Colour.hexToRgb('ABC');

        colourServiceStub.primaryColourChanged.subscribe(() => {
            expect(service['colourProperty'].colour).toEqual(GIVEN_COLOUR);
            done();
        });

        colourServiceStub.setPrimaryColour(GIVEN_COLOUR);
    });

    // Exemple de test d'int??gration qui est quand m??me utile
    it(' should change the pixel of the canvas ', () => {
        mouseEvent = { clientX: canvasPosition.x, clientY: canvasPosition.y, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        service.mouseInCanvas = true;
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
