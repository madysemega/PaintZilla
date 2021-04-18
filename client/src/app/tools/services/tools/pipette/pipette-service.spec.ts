import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { PipetteService } from './pipette-service';

// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('PipetteService', () => {
    let service: PipetteService;
    let mouseEvent: MouseEvent;
    let mouseEventRight: MouseEvent;
    let mouseEventOther: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let historyServiceStub: HistoryService;
    let colourServiceStub: ColourService;
    let keyboardServiceStub: jasmine.SpyObj<KeyboardService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

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

        service = TestBed.inject(PipetteService);

        spyOn(canvas, 'getBoundingClientRect').and.callFake(
            jasmine
                .createSpy('getBoundingClientRect')
                .and.returnValue({ top: 1, height: 100, left: 2, width: 200, right: 202, x: canvasPosition.x, y: canvasPosition.y }),
        );

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
        mouseEventRight = {
            clientX: 100,
            clientY: 100,
            button: 2,
        } as MouseEvent;
        mouseEventOther = {
            clientX: 100,
            clientY: 100,
            button: 1,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: mouseEvent.clientX - canvasPosition.x, y: mouseEvent.clientY - canvasPosition.y };
        service.mouseInCanvas = true;
        service.colorOutput = '';
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.colorOutput = '';
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });
    it(' mouseDown should set mouseDownRight property to true on right click', () => {
        service.colorOutput = '';
        service.onMouseDown(mouseEventRight);
        expect(service.mouseRightDown).toEqual(true);
    });
    it(' mouseDown should not set mouseDownRight property to true on other click', () => {
        service.colorOutput = '';
        service.onMouseDown(mouseEventOther);
        expect(service.mouseRightDown).toEqual(false);
    });
    it(' on tool deselect should deselect tool', () => {
        service.onToolDeselect();
        expect(service.history.isLocked).toEqual(false);
    });

    it(' onMouseUp should call register a new user action if mouse was already down', () => {
        service.mouseInCanvas = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(service.mouseDown).toBeFalse();
    });
    it(' onMouseUp should call register a new user action if mouse was already down', () => {
        service.mouseInCanvas = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseUp(mouseEvent);
        expect(service.mouseDown).toBeFalse();
    });

    it(' onMouseMove should define cerclePreview', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;
        drawServiceSpy.canvasSize = { x: 100, y: 100 };
        service.colorOutput = '';
        service.zoomctx = baseCtxStub;
        drawServiceSpy.baseCtx = baseCtxStub;
        service.onMouseMove(mouseEvent);
        expect(service.circlePreview).toBeDefined();
    });
    it(' onMouseMove should not define cerclePreview if canvas is small', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;
        drawServiceSpy.canvasSize = { x: 0, y: 0 };
        service.colorOutput = '';
        service.zoomctx = baseCtxStub;
        drawServiceSpy.baseCtx = baseCtxStub;
        service.onMouseMove(mouseEvent);
        expect(service.circlePreview).not.toBeDefined();
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

        colourServiceStub.setPrimaryColour(GIVEN_COLOUR);

        colourServiceStub.primaryColourChanged.subscribe(() => {
            expect(service['colourProperty'].colour).toEqual(GIVEN_COLOUR);
        });
        done();
    });
});
