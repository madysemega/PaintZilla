import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { DrawingService } from '@app/drawing/services/drawing/drawing.service';
import { LineShape } from '@app/shapes/line-shape';
import { LineShapeRenderer } from '@app/shapes/renderers/line-shape-renderer';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { LineService } from './line.service';

// tslint:disable:no-any
describe('LineService', () => {
    const VALID_NB_VERTICES_FOR_CLOSING_SHAPE = 5;

    let service: LineService;
    let lineShapeStub: LineShape;
    let lineShapeCloseMethodSpy: jasmine.Spy<any>;

    let lineShapeRendererStub: LineShapeRenderer;
    let lineShapeRendererRenderMethodStub: jasmine.Spy<any>;

    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(LineService);

        // tslint:disable:no-string-literal
        lineShapeStub = service['lineShape'];
        lineShapeRendererStub = service['lineShapeRenderer'];
        service['drawingService'].canvas = canvasTestHelper.canvas;
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;

        lineShapeRendererRenderMethodStub = spyOn<any>(lineShapeRendererStub, 'render').and.stub();
        lineShapeCloseMethodSpy = spyOn<any>(lineShapeStub, 'close').and.stub();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it("onMouseClick() should add the mouse position to the shape's vertices collection and call render() on the shape's renderer with the preview canvas if click is done with left button", () => {
        const mouseEvent: MouseEvent = { button: MouseButton.Left, clientX: 3, clientY: 42 } as MouseEvent;
        service.onMouseClick(mouseEvent);
        expect(lineShapeStub.vertices.length).toEqual(1);
        expect(lineShapeStub.vertices[0]).toEqual({ x: 3, y: 42 });
        expect(lineShapeRendererRenderMethodStub).toHaveBeenCalledWith(drawServiceSpy.previewCtx);
    });

    it("onMouseClick() should not add any vertex to the shape nor should it can render() on the shape's renderer if click is not done with left button", () => {
        const mouseEvent: MouseEvent = { button: MouseButton.Right, clientX: 3, clientY: 42 } as MouseEvent;
        service.onMouseClick(mouseEvent);
        expect(lineShapeStub.vertices.length).not.toEqual(1);
        expect(lineShapeStub.vertices[0]).not.toEqual({ x: 3, y: 42 });
        expect(lineShapeRendererRenderMethodStub).not.toHaveBeenCalledWith(drawServiceSpy.previewCtx);
    });

    it('onMouseDoubleClick() should close the shape if it can and click was done with left button', () => {
        const lineShapeIsCloseableWithMock = spyOn<any>(lineShapeStub, 'isCloseableWith').and.returnValue(true);
        const mouseEvent: MouseEvent = { button: MouseButton.Left, clientX: 3, clientY: 42 } as MouseEvent;

        lineShapeStub.vertices.length = VALID_NB_VERTICES_FOR_CLOSING_SHAPE;
        service.onMouseDoubleClick(mouseEvent);

        expect(lineShapeIsCloseableWithMock).toHaveBeenCalledTimes(1);
        expect(lineShapeCloseMethodSpy).toHaveBeenCalledTimes(1);
    });

    it('onMouseDoubleClick() should not close the shape if it can, but click was not done with left button', () => {
        const lineShapeIsCloseableWithMock = spyOn<any>(lineShapeStub, 'isCloseableWith').and.returnValue(true);
        const mouseEvent: MouseEvent = { button: MouseButton.Right, clientX: 3, clientY: 42 } as MouseEvent;

        lineShapeStub.vertices.length = VALID_NB_VERTICES_FOR_CLOSING_SHAPE;
        service.onMouseDoubleClick(mouseEvent);

        expect(lineShapeIsCloseableWithMock).toHaveBeenCalledTimes(0);
        expect(lineShapeCloseMethodSpy).not.toHaveBeenCalledTimes(1);
    });

    it('onMouseDoubleClick() should not close the shape if it cannot', () => {
        const lineShapeIsCloseableWithMock = spyOn<any>(lineShapeStub, 'isCloseableWith').and.returnValue(false);
        const mouseEventLeft: MouseEvent = { button: MouseButton.Left, clientX: 3, clientY: 42 } as MouseEvent;
        const mouseEventRight: MouseEvent = { button: MouseButton.Left, clientX: 3, clientY: 42 } as MouseEvent;

        lineShapeStub.vertices.length = VALID_NB_VERTICES_FOR_CLOSING_SHAPE;
        service.onMouseDoubleClick(mouseEventLeft);

        expect(lineShapeIsCloseableWithMock).toHaveBeenCalledTimes(1);
        expect(lineShapeCloseMethodSpy).not.toHaveBeenCalledTimes(1);

        lineShapeStub.vertices.length = VALID_NB_VERTICES_FOR_CLOSING_SHAPE;
        service.onMouseDoubleClick(mouseEventRight);

        expect(lineShapeIsCloseableWithMock).toHaveBeenCalledTimes(2);
        expect(lineShapeCloseMethodSpy).not.toHaveBeenCalledTimes(2);
    });

    it("onMouseMove should clear preview canvas and then render on it using the shape's renderer if a line is currently being drawn", () => {
        const mouseEvent: MouseEvent = { clientX: 0, clientY: 0 } as MouseEvent;
        lineShapeStub.vertices.length = 1; // A shape is being drawn
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalledTimes(1);
        expect(lineShapeRendererRenderMethodStub).toHaveBeenCalledTimes(1);
    });

    it('onMouseMove should not clear preview canvas nor it render on it if no line is currently being drawn', () => {
        const mouseEvent: MouseEvent = { clientX: 0, clientY: 0 } as MouseEvent;
        lineShapeStub.vertices.length = 0; // No shape is being drawn
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(lineShapeRendererRenderMethodStub).not.toHaveBeenCalled();
    });
});
