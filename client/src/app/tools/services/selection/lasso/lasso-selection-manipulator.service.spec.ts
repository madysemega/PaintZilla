import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { MathsHelper } from '@app/shapes/helper/maths-helper.service';
import { EllipseService } from '@app/tools/services/tools/ellipse-service';
import { HotkeyModule } from 'angular2-hotkeys';
import { LassoSelectionHandlerService } from './lasso-selection-handler.service';
import { LassoSelectionHelperService } from './lasso-selection-helper.service';
import { LassoSelectionManipulatorService } from './lasso-selection-manipulator.service';

describe('LassoSelectionManipulatorService', () => {
    let service: LassoSelectionManipulatorService;

    let keyboardServiceStub: jasmine.SpyObj<KeyboardService>;
    let drawingServiceStub: jasmine.SpyObj<DrawingService>;
    let ellipseService: EllipseService;
    let colourService: ColourService;
    let historyService: HistoryService;

    let handler: LassoSelectionHandlerService;
    let helper: LassoSelectionHelperService;
    let manipulator: LassoSelectionManipulatorService;
    let mathsHelper: MathsHelper;

    beforeEach(() => {
        const canvasTestHelper = new CanvasTestHelper();
        drawingServiceStub = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        drawingServiceStub.canvas = canvasTestHelper.canvas;
        drawingServiceStub.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceStub.previewCanvas = canvasTestHelper.drawCanvas;
        drawingServiceStub.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        keyboardServiceStub = jasmine.createSpyObj('KeyboardService', ['registerAction', 'saveContext', 'restoreContext']);
        colourService = new ColourService({} as ColourPickerService);
        historyService = new HistoryService(keyboardServiceStub);

        helper = new LassoSelectionHelperService(drawingServiceStub, colourService, ellipseService);
        handler = new LassoSelectionHandlerService(drawingServiceStub, helper);
        manipulator = new LassoSelectionManipulatorService(drawingServiceStub, helper, handler, historyService);

        TestBed.configureTestingModule({
            imports: [HotkeyModule.forRoot()],
            providers: [
                { provide: KeyboardService, useValue: keyboardServiceStub },
                { provide: DrawingService, useValue: drawingServiceStub },
                { provide: EllipseService, useValue: ellipseService },
                { provide: ColourService, useValue: colourService },
                { provide: HistoryService, useValue: historyService },
                { provide: LassoSelectionHelperService, useValue: helper },
                { provide: LassoSelectionHandlerService, useValue: handler },
                { provide: LassoSelectionManipulatorService, useValue: manipulator },
            ],
        });
        mathsHelper = TestBed.inject(MathsHelper);
        service = TestBed.inject(LassoSelectionManipulatorService);

        ellipseService = new EllipseService(drawingServiceStub, colourService, historyService, mathsHelper);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('After translated to origin, shape should be centered at origin', () => {
        const TOP_LEFT = { x: 3, y: 4 };
        const DIMENSIONS = { x: 2, y: 6 };
        const VERTEX = { x: 12, y: 16 };

        service.selectionHandler.originalTopLeftOnBaseCanvas.x = TOP_LEFT.x;
        service.selectionHandler.originalTopLeftOnBaseCanvas.y = TOP_LEFT.y;
        service.selectionHandler.originalWidth = DIMENSIONS.x;
        service.selectionHandler.originalHeight = DIMENSIONS.y;

        expect(service.translateToGetOriginAtCenter(VERTEX)).toEqual({
            x: VERTEX.x - (TOP_LEFT.x + DIMENSIONS.x),
            y: VERTEX.y - (TOP_LEFT.y + DIMENSIONS.y),
        });
    });

    it('After translated to final position, shape should be centered in the middle of the canvas', () => {
        const TOP_LEFT = { x: 3, y: 4 };
        const DIMENSIONS = { x: 2, y: 6 };
        const VERTEX = { x: 12, y: 16 };
        const SCALING = { x: 3, y: 1.5 };

        service.topLeft.x = TOP_LEFT.x;
        service.topLeft.y = TOP_LEFT.y;
        service.selectionHandler.originalWidth = DIMENSIONS.x;
        service.selectionHandler.originalHeight = DIMENSIONS.y;
        service.selectionHandler.currentHorizontalScaling = SCALING.x;
        service.selectionHandler.currentVerticalScaling = SCALING.y;

        expect(service.translateToFinalPosition(VERTEX)).toEqual({
            x: VERTEX.x + DIMENSIONS.x * SCALING.x + TOP_LEFT.x,
            y: VERTEX.y + DIMENSIONS.y * SCALING.y + TOP_LEFT.y,
        });
    });

    it('Scaling should multiply vertex by factor', () => {
        const VERTEX = { x: 3, y: 4 };
        const FACTOR = { x: 1.5, y: 3 };
        const EXPECTED_RESULT = { x: 4.5, y: 12 };

        expect(service.scale(VERTEX, FACTOR)).toEqual(EXPECTED_RESULT);
    });

    it('Selection outline should be drawn with translated vertices', () => {
        const SCALING = { x: 3, y: 1.5 };
        const lineToSpy = spyOn(drawingServiceStub.previewCtx, 'lineTo').and.callThrough();

        service.selectionHandler.currentHorizontalScaling = SCALING.x;
        service.selectionHandler.currentVerticalScaling = SCALING.y;

        handler.initAllProperties([
            { x: 0, y: 5 },
            { x: 1, y: 4 },
            { x: 2, y: 3 },
        ]);

        service.drawSelectionOutline();

        handler.initialVertices.forEach((vertex) => {
            const scale = {
                x: service.selectionHandler.currentHorizontalScaling,
                y: service.selectionHandler.currentVerticalScaling,
            };
            const originAtCenter = service.translateToGetOriginAtCenter(vertex);
            const scaled = service.scale(originAtCenter, scale);
            const finalPosition = service.translateToFinalPosition(scaled);
            expect(lineToSpy).toHaveBeenCalledWith(finalPosition.x, finalPosition.y);
        });
    });
});
