import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { RectangleSelectionHelperService } from '@app/tools/services/selection/rectangle/rectangle-selection-helper.service';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { BehaviorSubject } from 'rxjs';
import { RectangleSelectionCreatorService } from './rectangle-selection-creator.service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-empty
// tslint:disable:max-line-length
describe('RectangleSelectionCreatorService', () => {
    let service: RectangleSelectionCreatorService;

    let rectangleSelectionHelperService: jasmine.SpyObj<RectangleSelectionHelperService>;

    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let createSelectionSpy: jasmine.Spy<any>;
    let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;

    let canvasTestHelper: CanvasTestHelper;
    let canvas: HTMLCanvasElement;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        rectangleSelectionHelperService = jasmine.createSpyObj('RectangleSelectionHelperService', [
            'getSquareAdjustedPerimeter',
            'drawPerimeter',
            'setIsSelectionBeingManipulated',
            'resetManipulatorProperties',
        ]);
        rectangleSelectionHelperService.isSelectionBeingManipulated = new BehaviorSubject(true);

        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setCursorType']);
        drawServiceSpy.canvasSize = { x: 1000, y: 500 };

        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);

        TestBed.configureTestingModule({
            imports: [HotkeyModule.forRoot()],
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: RectangleSelectionHelperService, useValue: rectangleSelectionHelperService },
                { provide: HotkeysService, useValue: hotkeysServiceStub },
            ],
        });

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        canvas = canvasTestHelper.canvas;
        service = TestBed.inject(RectangleSelectionCreatorService);

        service.drawingService.baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service.drawingService.previewCtx = previewCtxStub;
        service.drawingService.canvas = canvas;

        createSelectionSpy = spyOn<any>(service, 'createSelection').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('drawing an outline should use getSquareAdjustedPerimeter from SelectionHelperService if isShift is true ', () => {
        const endPoint: Vec2 = { x: 9, y: 563 };
        service.isShiftDown = true;
        service.drawSelectionOutline(endPoint);
        expect(rectangleSelectionHelperService.getSquareAdjustedPerimeter).toHaveBeenCalled();
    });

    it('drawing an outline should not use getSquareAdjustedPerimeter from SelectionHelperService if isShift is false ', () => {
        const endPoint: Vec2 = { x: 9, y: 563 };
        service.isShiftDown = false;
        service.drawSelectionOutline(endPoint);
        expect(rectangleSelectionHelperService.getSquareAdjustedPerimeter).not.toHaveBeenCalled();
    });

    it('pressing ctrl + a should create selection the same size as the canvas ', () => {
        const keyboardEventZ = new KeyboardEvent('keydown', {
            key: 'z',
            ctrlKey: true,
        });

        const keyboardEventA = new KeyboardEvent('keydown', {
            key: 'a',
            ctrlKey: true,
        });

        service.isShiftDown = false;

        document.body.dispatchEvent(keyboardEventZ);
        document.body.addEventListener('keydown', () => {
            expect(createSelectionSpy).not.toHaveBeenCalled();
        });

        document.body.dispatchEvent(keyboardEventA);
        document.body.addEventListener('keydown', () => {
            expect(createSelectionSpy).toHaveBeenCalledWith({ x: 0, y: 0 }, { x: drawServiceSpy.canvasSize.x, y: drawServiceSpy.canvasSize.y });
        });
    });

    it('When selecting the entire canvas, a selection covering the entire canvas should be created', () => {
        const TOP_LEFT = { x: 0, y: 0 };
        const BOTTOM_RIGHT = {
            x: drawServiceSpy.canvasSize.x,
            y: drawServiceSpy.canvasSize.y,
        };

        service.selectEntireCanvas();
        expect(createSelectionSpy).toHaveBeenCalledWith(TOP_LEFT, BOTTOM_RIGHT);
    });
});
