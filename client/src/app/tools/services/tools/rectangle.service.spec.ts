import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { ShapeType } from '@app/app/classes/shape-type';
import { Vec2 } from '@app/app/classes/vec2';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { UserActionRenderShape } from '@app/history/user-actions/user-action-render-shape';
import { RectangleService } from './rectangle.service';

// tslint:disable: no-any
// tslint:disable: no-string-literal
// tslint:disable: max-file-line-count
describe('RectangleService', () => {
    let service: RectangleService;
    let history: HistoryService;
    let colourService: ColourService;
    let mouseEvent: MouseEvent;
    let keyboardShiftEvent: KeyboardEvent;
    let keyboardSpaceEvent: KeyboardEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    let drawRectSpy: jasmine.Spy<any>;
    let finalizeSpy: jasmine.Spy<any>;

    let fillRenderSpy: jasmine.Spy<any>;
    let strokeRenderSpy: jasmine.Spy<any>;

    let canvas: HTMLCanvasElement;
    let canvasPosition: Vec2;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        history = new HistoryService();
        colourService = new ColourService({} as ColourPickerService);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: HistoryService, useValue: history },
                { provide: ColourService, useValue: colourService },
            ],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        canvas = canvasTestHelper.canvas;
        canvasPosition = { x: 50, y: 40 };

        service = TestBed.inject(RectangleService);

        spyOn(canvas, 'getBoundingClientRect').and.callFake(
            jasmine
                .createSpy('getBoundingClientRect')
                .and.returnValue({ top: 1, height: 100, left: 2, width: 200, right: 202, x: canvasPosition.x, y: canvasPosition.y }),
        );

        drawRectSpy = spyOn<any>(service, 'drawRect').and.callThrough();
        finalizeSpy = spyOn<any>(service, 'finalize').and.callThrough();

        fillRenderSpy = spyOn<any>(service['fillRenderer'], 'render').and.callThrough();
        strokeRenderSpy = spyOn<any>(service['strokeRenderer'], 'render').and.callThrough();

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

        keyboardShiftEvent = {
            key: 'Shift',
        } as KeyboardEvent;

        keyboardSpaceEvent = {
            key: 'Space',
        } as KeyboardEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: mouseEvent.clientX - canvasPosition.x, y: mouseEvent.clientY - canvasPosition.y };
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

    it(' onKeyDown should call drawRect when mouse clicked if key == Shift', () => {
        service.mouseDown = true;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onKeyDown(keyboardShiftEvent);
        expect(drawRectSpy).toHaveBeenCalled();
    });

    it(' onKeyDown should not call drawRect when mouse down if key != Shift', () => {
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

    it(' after having been adjusted width should be negative if it was so before the adjustment', () => {
        const x = 0;
        const y = 11;
        const startingX = 10;
        const startingY = 10;
        service.shiftDown = true;
        service.startingPos.x = startingX;
        service.startingPos.y = startingY;
        service.adjustRectSize(x, y);
        expect(service.width).toBeLessThan(0);
    });

    it(' after having been adjusted width should be positve if it was so before the adjustment', () => {
        const x = 20;
        const y = 11;
        const startingX = 10;
        const startingY = 10;
        service.shiftDown = true;
        service.startingPos.x = startingX;
        service.startingPos.y = startingY;
        service.adjustRectSize(x, y);
        expect(service.width).toBeGreaterThan(0);
    });

    it(' after having been adjusted height should be negative if it was so before the adjustment', () => {
        const x = 9;
        const y = 4;
        const startingX = 10;
        const startingY = 10;
        service.shiftDown = true;
        service.startingPos.x = startingX;
        service.startingPos.y = startingY;
        service.adjustRectSize(x, y);
        expect(service.height).toBeLessThan(0);
    });

    it(' after having been adjusted height should be positve if it was so before the adjustment', () => {
        const x = 20;
        const y = 50;
        const startingX = 10;
        const startingY = 10;
        service.shiftDown = true;
        service.startingPos.x = startingX;
        service.startingPos.y = startingY;
        service.adjustRectSize(x, y);
        expect(service.height).toBeGreaterThan(0);
    });

    it('when line width changes, stroke width property should as well', () => {
        const INITIAL_LINE_WIDTH = 1;
        const NEW_LINE_WIDTH = 3;

        service['strokeWidthProperty'].strokeWidth = INITIAL_LINE_WIDTH;

        service.lineWidth = NEW_LINE_WIDTH;
        service.onLineWidthChanged();

        expect(service['strokeWidthProperty'].strokeWidth).toEqual(NEW_LINE_WIDTH);
    });

    it(' should change the pixel of the canvas ', () => {
        mouseEvent = { clientX: canvasPosition.x, clientY: canvasPosition.y, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { clientX: canvasPosition.x + 1, clientY: canvasPosition.y, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        service.onMouseUp(mouseEvent);

        // Premier pixel seulement
        const imageData: ImageData = baseCtxStub.getImageData(0, 0, 1, 1);
        // un pixel du canvas étant initialisé à (0,0,0,0) par défaut.
        // sachant également que notre couleur par défaut n'est pas noir
        expect(imageData.data[0]).not.toEqual(0); // R
        expect(imageData.data[1]).not.toEqual(0); // G
        expect(imageData.data[2]).not.toEqual(0); // B
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData.data[3]).not.toEqual(0); // A
    });

    it('when tool is deselected, it should finalize the shape', () => {
        service.onToolDeselect();
        expect(finalizeSpy).toHaveBeenCalled();
    });

    it('when tool is deselected, it should unlock the history service', () => {
        history.isLocked = true;
        service.onToolDeselect();
        expect(history.isLocked).toBeFalse();
    });

    it('when finalizing filled shape, registered user action should contain a fill renderer', () => {
        service.shapeType = ShapeType.Filled;

        service['mouseDown'] = true;
        service.onMouseUp({} as MouseEvent);

        const generatedUserAction = history['past'][0] as UserActionRenderShape;

        const isGeneratedRendererOfTypeFill =
            generatedUserAction['renderers'].find((renderer) => typeof renderer === typeof service['fillRenderer']) != undefined;

        expect(isGeneratedRendererOfTypeFill).toBeTrue();
    });

    it('when finalizing contoured and filled shape, registered user action should contain a fill renderer', () => {
        service.shapeType = ShapeType.ContouredAndFilled;

        service['mouseDown'] = true;
        service.onMouseUp({} as MouseEvent);

        const generatedUserAction = history['past'][0] as UserActionRenderShape;

        const isGeneratedRendererOfTypeFill =
            generatedUserAction['renderers'].find((renderer) => typeof renderer === typeof service['fillRenderer']) != undefined;

        expect(isGeneratedRendererOfTypeFill).toBeTrue();
    });

    it('when finalizing contoured shape, registered user action should contain a contour renderer', () => {
        service.shapeType = ShapeType.Contoured;

        service['mouseDown'] = true;
        service.onMouseUp({} as MouseEvent);

        const generatedUserAction = history['past'][0] as UserActionRenderShape;

        const isGeneratedRendererOfTypeStroke =
            generatedUserAction['renderers'].find((renderer) => typeof renderer === typeof service['strokeRenderer']) != undefined;

        expect(isGeneratedRendererOfTypeStroke).toBeTrue();
    });

    it('when finalizing contoured and filled shape, registered user action should contain a contour renderer', () => {
        service.shapeType = ShapeType.ContouredAndFilled;

        service['mouseDown'] = true;
        service.onMouseUp({} as MouseEvent);

        const generatedUserAction = history['past'][0] as UserActionRenderShape;

        const isGeneratedRendererOfTypeStroke =
            generatedUserAction['renderers'].find((renderer) => typeof renderer === typeof service['strokeRenderer']) != undefined;

        expect(isGeneratedRendererOfTypeStroke).toBeTrue();
    });

    it('when shape is drawn and type is filled, fillRenderer should be invoked', () => {
        service.shapeType = ShapeType.Filled;

        service['drawRect'].call(service, baseCtxStub);

        expect(fillRenderSpy).toHaveBeenCalled();
    });

    it('when shape is drawn and type is contoured and filled, fillRenderer should be invoked', () => {
        service.shapeType = ShapeType.ContouredAndFilled;

        service['drawRect'].call(service, baseCtxStub);

        expect(fillRenderSpy).toHaveBeenCalled();
    });

    it('when shape is drawn and type is contoured, strokeRenderer should be invoked', () => {
        service.shapeType = ShapeType.Contoured;

        service['drawRect'].call(service, baseCtxStub);

        expect(strokeRenderSpy).toHaveBeenCalled();
    });

    it('when shape is drawn and type is contoured and filled, strokeRenderer should be invoked', () => {
        service.shapeType = ShapeType.ContouredAndFilled;

        service['drawRect'].call(service, baseCtxStub);

        expect(strokeRenderSpy).toHaveBeenCalled();
    });

    it('on shift down, if mouse is down, shape should be drawn', () => {
        service.mouseDown = true;
        service.onKeyDown({ key: 'Shift' } as KeyboardEvent);
        expect(drawRectSpy).toHaveBeenCalled();
    });

    it('on shift down, if mouse is up, shape should not be drawn', () => {
        service.mouseDown = false;
        service.onKeyDown({ key: 'Shift' } as KeyboardEvent);
        expect(drawRectSpy).not.toHaveBeenCalled();
    });

    it('on shift up, if mouse is down, shape should be drawn', () => {
        service.mouseDown = true;
        service.onKeyUp({ key: 'Shift' } as KeyboardEvent);
        expect(drawRectSpy).toHaveBeenCalled();
    });

    it('on shift up, if mouse is up, shape should not be drawn', () => {
        service.mouseDown = false;
        service.onKeyUp({ key: 'Shift' } as KeyboardEvent);
        expect(drawRectSpy).not.toHaveBeenCalled();
    });

    it('when primary colour changes, so should fill style', () => {
        const COLOUR = Colour.hexToRgb('424242');

        colourService.setPrimaryColour(COLOUR);

        colourService.primaryColourChanged.subscribe(() => {
            expect(service['fillStyleProperty'].colour).toEqual(COLOUR);
        });
    });

    it('when secondary colour changes, so should stroke style', () => {
        const COLOUR = Colour.hexToRgb('424242');

        colourService.setSecondaryColour(COLOUR);

        colourService.secondaryColourChanged.subscribe(() => {
            expect(service['strokeStyleProperty'].colour).toEqual(COLOUR);
        });
    });
});
