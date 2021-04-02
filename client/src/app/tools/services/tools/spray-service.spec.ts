import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { SprayService } from './spray-service';

// tslint:disable:no-any
describe('SprayService', () => {
    let service: SprayService;

    let canvasTestHelper: CanvasTestHelper;

    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let historyServiceSpy: HistoryService;
    let colourServiceSpy: ColourService;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    let spraySpy: jasmine.Spy<any>;
    let previewPaintSpy: jasmine.Spy<any>;

    let finalizePaintSpy: jasmine.Spy<any>;

    let canvasPosition: Vec2;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        historyServiceSpy = new HistoryService();
        colourServiceSpy = new ColourService({} as ColourPickerService);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: HistoryService, useValue: historyServiceSpy },
                { provide: ColourService, useValue: colourServiceSpy },
            ],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        canvas = canvasTestHelper.canvas;
        canvasPosition = { x: 50, y: 40 };

        service = TestBed.inject(SprayService);

        spyOn(canvas, 'getBoundingClientRect').and.callFake(
            jasmine
                .createSpy('getBoundingClientRect')
                .and.returnValue({ top: 1, height: 100, left: 2, width: 200, right: 202, x: canvasPosition.x, y: canvasPosition.y }),
        );

        spraySpy = spyOn<any>(service, 'spray').and.callThrough();
        finalizePaintSpy = spyOn<any>(service, 'finalizePaint').and.callThrough();
        previewPaintSpy = spyOn<any>(service, 'previewPaint').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvas;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onSpray() should spray and preview paint', () => {
        service['lastMousePosition'] = { x: 0, y: 0 };

        service.onSpray();

        expect(spraySpy).toHaveBeenCalled();
        expect(previewPaintSpy).toHaveBeenCalled();
    });

    it('mouse down should set mouse down flag to true if left button was used', () => {
        service.mouseDown = false;
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(service.mouseDown).toBeTrue();

        service.mouseDown = true;
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(service.mouseDown).toBeTrue();
    });

    it('mouse down should set mouse down flag to false if right button was used', () => {
        service.mouseDown = false;
        service.onMouseDown({ button: MouseButton.Right } as MouseEvent);
        expect(service.mouseDown).toBeFalse();

        service.mouseDown = true;
        service.onMouseDown({ button: MouseButton.Right } as MouseEvent);
        expect(service.mouseDown).toBeFalse();
    });

    it('left mouse down should lock history service', () => {
        historyServiceSpy.isLocked = false;
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(historyServiceSpy.isLocked).toBeTrue();
    });

    it('right mouse down should not lock history service', () => {
        historyServiceSpy.isLocked = false;
        service.onMouseDown({ button: MouseButton.Right } as MouseEvent);
        expect(historyServiceSpy.isLocked).toBeFalse();

        historyServiceSpy.isLocked = true;
        service.onMouseDown({ button: MouseButton.Right } as MouseEvent);
        expect(historyServiceSpy.isLocked).toBeTrue();
    });

    it('left mouse down should spray', () => {
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(spraySpy).toHaveBeenCalled();
    });

    it('after left onMouseUp(), mouse down flag should be false', () => {
        service.mouseDown = true;
        service.onMouseUp({ button: MouseButton.Left } as MouseEvent);
        expect(service.mouseDown).toBeFalse();

        service.mouseDown = false;
        service.onMouseUp({ button: MouseButton.Left } as MouseEvent);
        expect(service.mouseDown).toBeFalse();
    });

    it('after right onMouseUp(), mouse down flag should not change', () => {
        service.mouseDown = true;
        service.onMouseUp({ button: MouseButton.Right } as MouseEvent);
        expect(service.mouseDown).toBeTrue();

        service.mouseDown = false;
        service.onMouseUp({ button: MouseButton.Right } as MouseEvent);
        expect(service.mouseDown).toBeFalse();
    });

    it('mouse move should update the last mouse position if mouse is down', () => {
        const MOUSE_EVENT = { clientX: 3, clientY: 4 } as MouseEvent;

        service.mouseDown = true;
        service.onMouseMove(MOUSE_EVENT);
        expect(service['lastMousePosition']).toEqual(service.getPositionFromMouse(MOUSE_EVENT));
    });

    it('mouse move should not update the last mouse position if mouse is not down', () => {
        const MOUSE_EVENT_A = { clientX: 3, clientY: 4 } as MouseEvent;
        const MOUSE_EVENT_B = { clientX: 4, clientY: 3 } as MouseEvent;
        const EXPECTED_LAST_MOUSE_POSITION = service.getPositionFromMouse(MOUSE_EVENT_A);

        service.mouseDown = true;
        service.onMouseMove(MOUSE_EVENT_A);
        expect(service['lastMousePosition']).toEqual(EXPECTED_LAST_MOUSE_POSITION);

        service.mouseDown = false;
        service.onMouseMove(MOUSE_EVENT_B);
        expect(service['lastMousePosition']).toEqual(EXPECTED_LAST_MOUSE_POSITION);
    });

    it('When primary colour changed, it should be reflected in the colour property of the spray tool', (done) => {
        const NEW_PRIMARY_COLOUR = Colour.hexToRgb('424242');

        colourServiceSpy.setPrimaryColour(NEW_PRIMARY_COLOUR);
        colourServiceSpy.primaryColourChanged.subscribe(() => {
            expect(service['colourProperty'].colour).toEqual(NEW_PRIMARY_COLOUR);
        });
        done();
    });

    it('onToolDeselect should call finalizePaint', () => {
        service.onToolDeselect();
        expect(finalizePaintSpy).toHaveBeenCalled();
    });
});
