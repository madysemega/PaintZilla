import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { EraserService } from './eraser-service';
// tslint:disable:no-any
describe('EraserService', () => {
    let service: EraserService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    let drawVerticesSpy: jasmine.Spy<any>;
    let drawPointSpy: jasmine.Spy<any>;

    let drawRightwardRectangleSpy: jasmine.Spy<any>;
    let drawLeftwardRectangleSpy: jasmine.Spy<any>;

    let canvasPosition: Vec2;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setCursorType']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        canvas = canvasTestHelper.canvas;
        canvasPosition = { x: 50, y: 40 };

        service = TestBed.inject(EraserService);

        spyOn(canvas, 'getBoundingClientRect').and.callFake(
            jasmine
                .createSpy('getBoundingClientRect')
                .and.returnValue({ top: 1, height: 100, left: 2, width: 200, right: 202, x: canvasPosition.x, y: canvasPosition.y }),
        );

        drawVerticesSpy = spyOn<any>(service, 'drawVertices').and.callThrough();
        drawPointSpy = spyOn<any>(service, 'drawPoint').and.callThrough();

        drawRightwardRectangleSpy = spyOn<any>(service, 'drawRightwardRectangle').and.callThrough();
        drawLeftwardRectangleSpy = spyOn<any>(service, 'drawLeftwardRectangle').and.callThrough();

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
    it(' mouseMove should set the mouse to move', () => {
        service.onMouseMove(mouseEvent);
        expect(service.getPositionFromMouse(mouseEvent)).toEqual({ x: 50, y: 60 });
    });
    // tslint:disable:no-magic-numbers
    it(' a eraser width less than 5 should set the width to 5', () => {
        let width = 20;
        width = service.changeWidth(width);
        expect(width).toEqual(20);
    });
    it(' a eraser width more than 5 should set the width to the same thing', () => {
        let width = 2;
        width = service.changeWidth(width);
        expect(width).toEqual(service.minimumWidth);
    });

    it(' onToolDeselect should change the cursor to crosshair', () => {
        service.onToolDeselect();
        expect(drawServiceSpy.canvas.style.cursor).toEqual('');
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
        expect(drawVerticesSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawSegments if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(drawVerticesSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should call drawPoint if mouse was down but did not move', () => {
        service.mouseInCanvas = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawPointSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawPoint if mouse was not down', () => {
        service.mouseInCanvas = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseUp(mouseEvent);
        expect(drawPointSpy).not.toHaveBeenCalled();
    });

    // Exemple de test d'intégration qui est quand même utile
    it(' should change the pixel of the canvas ', () => {
        mouseEvent = { clientX: canvasPosition.x, clientY: canvasPosition.y, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        service.mouseInCanvas = true;
        mouseEvent = { clientX: canvasPosition.x + 1, clientY: canvasPosition.y, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);

        // Premier pixel seulement
        const imageData: ImageData = baseCtxStub.getImageData(0, 0, 1, 1);
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData.data[0]).toEqual(255); // R
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData.data[1]).toEqual(255); // G
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData.data[2]).toEqual(255); // B
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData.data[3]).not.toEqual(0); // A
    });

    it('drawRightwardRectangle() should draw a rightward rectangle', () => {
        const HALF_WIDTH = 3;
        const TOP_LEFT = { x: 3, y: 5 };
        const BOTTOM_RIGHT = { x: 28, y: 56 };

        const baseCtxMoveToSpy = spyOn(drawServiceSpy.baseCtx, 'moveTo').and.callThrough();
        const baseCtxLineToSpy = spyOn(drawServiceSpy.baseCtx, 'lineTo').and.callThrough();

        service.drawRightwardRectangle(drawServiceSpy.baseCtx, TOP_LEFT, BOTTOM_RIGHT, 2 * HALF_WIDTH);

        expect(baseCtxMoveToSpy).toHaveBeenCalledWith(TOP_LEFT.x - HALF_WIDTH, TOP_LEFT.y - HALF_WIDTH);
        expect(baseCtxLineToSpy).toHaveBeenCalledWith(TOP_LEFT.x + HALF_WIDTH, TOP_LEFT.y - HALF_WIDTH);
        expect(baseCtxLineToSpy).toHaveBeenCalledWith(BOTTOM_RIGHT.x + HALF_WIDTH, BOTTOM_RIGHT.y - HALF_WIDTH);
        expect(baseCtxLineToSpy).toHaveBeenCalledWith(BOTTOM_RIGHT.x + HALF_WIDTH, BOTTOM_RIGHT.y + HALF_WIDTH);
        expect(baseCtxLineToSpy).toHaveBeenCalledWith(BOTTOM_RIGHT.x - HALF_WIDTH, BOTTOM_RIGHT.y + HALF_WIDTH);
        expect(baseCtxLineToSpy).toHaveBeenCalledWith(TOP_LEFT.x - HALF_WIDTH, TOP_LEFT.y + HALF_WIDTH);
    });

    it('drawLeftwardRectangle() should draw a leftward rectangle', () => {
        const HALF_WIDTH = 3;
        const TOP_RIGHT = { x: 3, y: 5 };
        const BOTTOM_LEFT = { x: 28, y: 56 };

        const baseCtxMoveToSpy = spyOn(drawServiceSpy.baseCtx, 'moveTo').and.callThrough();
        const baseCtxLineToSpy = spyOn(drawServiceSpy.baseCtx, 'lineTo').and.callThrough();

        service.drawLeftwardRectangle(drawServiceSpy.baseCtx, TOP_RIGHT, BOTTOM_LEFT, 2 * HALF_WIDTH);

        expect(baseCtxMoveToSpy).toHaveBeenCalledWith(TOP_RIGHT.x + HALF_WIDTH, TOP_RIGHT.y - HALF_WIDTH);
        expect(baseCtxLineToSpy).toHaveBeenCalledWith(TOP_RIGHT.x + HALF_WIDTH, TOP_RIGHT.y + HALF_WIDTH);
        expect(baseCtxLineToSpy).toHaveBeenCalledWith(BOTTOM_LEFT.x + HALF_WIDTH, BOTTOM_LEFT.y + HALF_WIDTH);
        expect(baseCtxLineToSpy).toHaveBeenCalledWith(BOTTOM_LEFT.x - HALF_WIDTH, BOTTOM_LEFT.y + HALF_WIDTH);
        expect(baseCtxLineToSpy).toHaveBeenCalledWith(BOTTOM_LEFT.x - HALF_WIDTH, BOTTOM_LEFT.y - HALF_WIDTH);
        expect(baseCtxLineToSpy).toHaveBeenCalledWith(TOP_RIGHT.x - HALF_WIDTH, TOP_RIGHT.y - HALF_WIDTH);
    });

    it('drawVertices() should draw (only) a rightward rectangle if movement is down-right', () => {
        service['vertices'].push({ x: 0, y: 0 });
        service['vertices'].push({ x: 34, y: 42 });

        service.drawVertices(drawServiceSpy.baseCtx);

        expect(drawRightwardRectangleSpy).toHaveBeenCalled();
        expect(drawLeftwardRectangleSpy).not.toHaveBeenCalled();
    });

    it('drawVertices() should draw (only) a rightward rectangle if movement is up-left', () => {
        service['vertices'].push({ x: 34, y: 42 });
        service['vertices'].push({ x: 0, y: 0 });

        service.drawVertices(drawServiceSpy.baseCtx);

        expect(drawRightwardRectangleSpy).toHaveBeenCalled();
        expect(drawLeftwardRectangleSpy).not.toHaveBeenCalled();
    });

    it('drawVertices() should draw (only) a leftward rectangle if movement is down-left', () => {
        service['vertices'].push({ x: 34, y: 0 });
        service['vertices'].push({ x: 0, y: 42 });

        service.drawVertices(drawServiceSpy.baseCtx);

        expect(drawLeftwardRectangleSpy).toHaveBeenCalled();
        expect(drawRightwardRectangleSpy).not.toHaveBeenCalled();
    });

    it('drawVertices() should draw (only) a leftward rectangle if movement is up-right', () => {
        service['vertices'].push({ x: 0, y: 42 });
        service['vertices'].push({ x: 34, y: 0 });

        service.drawVertices(drawServiceSpy.baseCtx);

        expect(drawLeftwardRectangleSpy).toHaveBeenCalled();
        expect(drawRightwardRectangleSpy).not.toHaveBeenCalled();
    });
});
