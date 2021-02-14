import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { LineShape } from '@app/shapes/line-shape';
import { LineJointsRenderer } from '@app/shapes/renderers/line-joints-renderer';
import { LineShapeRenderer } from '@app/shapes/renderers/line-shape-renderer';
import { LineType } from '@app/shapes/types/line-type';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { LineService } from './line.service';

// tslint:disable:no-any
// tslint:disable: max-file-line-count
describe('LineService', () => {
    const VALID_NB_VERTICES_FOR_CLOSING_SHAPE = 5;

    let service: LineService;
    let lineShapeStub: LineShape;
    let lineShapeCloseMethodSpy: jasmine.Spy<any>;

    let lineShapeRendererStub: LineShapeRenderer;
    let lineShapeRendererRenderMethodStub: jasmine.Spy<any>;

    let lineJointsRendererStub: LineJointsRenderer;
    let lineJointsRendererRenderMethodStub: jasmine.Spy<any>;

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
        lineJointsRendererStub = service['lineJointsRenderer'];
        service['drawingService'].canvas = canvasTestHelper.canvas;
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;

        lineShapeRendererRenderMethodStub = spyOn<any>(lineShapeRendererStub, 'render').and.stub();
        lineJointsRendererRenderMethodStub = spyOn<any>(lineJointsRendererStub, 'render').and.stub();
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
        expect(lineShapeRendererRenderMethodStub).not.toHaveBeenCalled();
    });

    it('onMouseClick() should preview the joints if line type is WITH_JOINTS and mouse button is left', () => {
        service['lineType'] = LineType.WITH_JOINTS;

        const mouseEventLeft: MouseEvent = { button: MouseButton.Left, clientX: 3, clientY: 42 } as MouseEvent;
        service.onMouseClick(mouseEventLeft);
        expect(lineJointsRendererRenderMethodStub).toHaveBeenCalledWith(drawServiceSpy.previewCtx);
    });

    it('onMouseClick() should not preview the joints if line type is WITH_JOINTS but mouse button is not left', () => {
        service['lineType'] = LineType.WITH_JOINTS;

        const mouseEventRight: MouseEvent = { button: MouseButton.Right, clientX: 3, clientY: 42 } as MouseEvent;
        service.onMouseClick(mouseEventRight);
        expect(lineJointsRendererRenderMethodStub).not.toHaveBeenCalled();
    });

    it('onMouseClick() should not preview the joints if line type is WITHOUT_JOINTS', () => {
        service['lineType'] = LineType.WITHOUT_JOINTS;

        const mouseEventLeft: MouseEvent = { button: MouseButton.Left, clientX: 3, clientY: 42 } as MouseEvent;
        service.onMouseClick(mouseEventLeft);
        expect(lineJointsRendererRenderMethodStub).not.toHaveBeenCalled();

        const mouseEventRight: MouseEvent = { button: MouseButton.Right, clientX: 3, clientY: 42 } as MouseEvent;
        service.onMouseClick(mouseEventRight);
        expect(lineJointsRendererRenderMethodStub).not.toHaveBeenCalled();
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

    it('onMouseDoubleClick() should render the joints on the base canvas if line type is WITH_JOINTS and mouse button is left', () => {
        service['lineType'] = LineType.WITH_JOINTS;
        lineShapeStub.vertices.length = VALID_NB_VERTICES_FOR_CLOSING_SHAPE;
        spyOn<any>(lineShapeStub, 'isCloseableWith').and.returnValue(false);

        const mouseEvent: MouseEvent = { button: MouseButton.Left, clientX: 3, clientY: 42 } as MouseEvent;
        service.onMouseDoubleClick(mouseEvent);
        expect(lineJointsRendererRenderMethodStub).toHaveBeenCalledWith(drawServiceSpy.baseCtx);
    });

    it('onMouseDoubleClick() should not render the joints on the base canvas if line type is WITH_JOINTS but mouse button is not left', () => {
        service['lineType'] = LineType.WITH_JOINTS;
        lineShapeStub.vertices.length = VALID_NB_VERTICES_FOR_CLOSING_SHAPE;
        spyOn<any>(lineShapeStub, 'isCloseableWith').and.returnValue(false);

        const mouseEvent: MouseEvent = { button: MouseButton.Right, clientX: 3, clientY: 42 } as MouseEvent;
        service.onMouseDoubleClick(mouseEvent);
        expect(lineJointsRendererRenderMethodStub).not.toHaveBeenCalled();
    });

    it('onMouseDoubleClick() should not render the joints on the base canvas if line type is WITHOUT_JOINTS', () => {
        service['lineType'] = LineType.WITHOUT_JOINTS;
        lineShapeStub.vertices.length = VALID_NB_VERTICES_FOR_CLOSING_SHAPE;
        spyOn<any>(lineShapeStub, 'isCloseableWith').and.returnValue(false);

        const mouseEventLeft: MouseEvent = { button: MouseButton.Left, clientX: 3, clientY: 42 } as MouseEvent;
        service.onMouseDoubleClick(mouseEventLeft);
        expect(lineJointsRendererRenderMethodStub).not.toHaveBeenCalled();

        const mouseEventRight: MouseEvent = { button: MouseButton.Right, clientX: 3, clientY: 42 } as MouseEvent;
        service.onMouseDoubleClick(mouseEventRight);
        expect(lineJointsRendererRenderMethodStub).not.toHaveBeenCalled();
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

    it('onKeyDown should set isShiftDown to true if key is shift', () => {
        service['isShiftDown'] = false;
        service.onKeyDown({ key: 'Shift' } as KeyboardEvent);
        expect(service['isShiftDown']).toBeTruthy();

        service['isShiftDown'] = true;
        service.onKeyDown({ key: 'Shift' } as KeyboardEvent);
        expect(service['isShiftDown']).toBeTruthy();
    });

    it('onKeyDown should not set isShiftDown to true if key is invalid', () => {
        service['isShiftDown'] = false;
        service.onKeyDown({ key: 'Fake key' } as KeyboardEvent);
        expect(service['isShiftDown']).toBeFalsy();

        service['isShiftDown'] = true;
        service.onKeyDown({ key: 'Fake key' } as KeyboardEvent);
        expect(service['isShiftDown']).toBeTruthy();
    });

    it('onKeyUp should set isShiftDown to false if key is shift', () => {
        service['isShiftDown'] = false;
        service.onKeyUp({ key: 'Shift' } as KeyboardEvent);
        expect(service['isShiftDown']).toBeFalsy();

        service['isShiftDown'] = true;
        service.onKeyUp({ key: 'Shift' } as KeyboardEvent);
        expect(service['isShiftDown']).toBeFalsy();
    });

    it('onKeyUp should not set isShiftDown to false if key is invalid', () => {
        service['isShiftDown'] = false;
        service.onKeyUp({ key: 'Fake key' } as KeyboardEvent);
        expect(service['isShiftDown']).toBeFalsy();

        service['isShiftDown'] = true;
        service.onKeyUp({ key: 'Fake key' } as KeyboardEvent);
        expect(service['isShiftDown']).toBeTruthy();
    });

    it('onKeyUp should remove all vertices from shape if key is escape', () => {
        const INITIAL_NB_VERTICES = 3;
        lineShapeStub.vertices.length = INITIAL_NB_VERTICES;

        service.onKeyUp({ key: 'Escape' } as KeyboardEvent);

        expect(lineShapeStub.vertices.length).toEqual(0);
    });

    it('onKeyUp should not remove any vertex from shape if key is invalid', () => {
        const INITIAL_NB_VERTICES = 3;
        lineShapeStub.vertices.length = INITIAL_NB_VERTICES;

        service.onKeyUp({ key: 'Fake key' } as KeyboardEvent);

        expect(lineShapeStub.vertices.length).toEqual(INITIAL_NB_VERTICES);
    });

    it('onKeyUp should remove the last vertex from shape if key is backspace', () => {
        const INITIAL_NB_VERTICES = 3;
        lineShapeStub.vertices.length = INITIAL_NB_VERTICES;

        service.onKeyUp({ key: 'Backspace' } as KeyboardEvent);

        expect(lineShapeStub.vertices.length).toEqual(INITIAL_NB_VERTICES - 1);
    });

    it('onKeyUp should not remove the last vertex from shape if key is invalid', () => {
        const INITIAL_NB_VERTICES = 3;
        lineShapeStub.vertices.length = INITIAL_NB_VERTICES;

        service.onKeyUp({ key: 'Fake key' } as KeyboardEvent);

        expect(lineShapeStub.vertices.length).toEqual(INITIAL_NB_VERTICES);
    });

    it('onKeyUp() should preview joints if key is backspace and line type is WITH_JOINTS', () => {
        const keyboardEvent = { key: 'Backspace' } as KeyboardEvent;

        service['lineType'] = LineType.WITH_JOINTS;
        service.onKeyUp(keyboardEvent);

        expect(lineJointsRendererRenderMethodStub).toHaveBeenCalledWith(drawServiceSpy.previewCtx);
    });

    it('onKeyUp() should not preview joints if key is not backspace and line type is WITH_JOINTS', () => {
        const keyboardEvent = { key: 'Invalid key' } as KeyboardEvent;

        service['lineType'] = LineType.WITH_JOINTS;
        service.onKeyUp(keyboardEvent);

        expect(lineJointsRendererRenderMethodStub).not.toHaveBeenCalled();
    });

    it('onKeyUp() should not preview joints if line type is WITHOUT_JOINTS', () => {
        service['lineType'] = LineType.WITHOUT_JOINTS;

        const keyboardEventBackspace = { key: 'Backspace' } as KeyboardEvent;
        service.onKeyUp(keyboardEventBackspace);

        const keyboardEventInvalid = { key: 'Invalid key' } as KeyboardEvent;
        service.onKeyUp(keyboardEventInvalid);

        expect(lineJointsRendererRenderMethodStub).not.toHaveBeenCalled();
    });

    it('previewLine() should preview the joints if shape is being drawn and line type is WITH_JOINTS', () => {
        service['lineType'] = LineType.WITH_JOINTS;

        lineShapeStub.vertices.length = 1; // A shape is being drawn

        const mousePosition: Vec2 = { x: 3, y: 42 };
        service.previewLine(mousePosition);

        expect(lineJointsRendererRenderMethodStub).toHaveBeenCalledWith(drawServiceSpy.previewCtx);
    });

    it('previewLine() should not preview the joints if shape is not being drawn and line type is WITH_JOINTS', () => {
        service['lineType'] = LineType.WITH_JOINTS;

        lineShapeStub.vertices.length = 0; // A shape is not being drawn

        const mousePosition: Vec2 = { x: 3, y: 42 };
        service.previewLine(mousePosition);

        expect(lineJointsRendererRenderMethodStub).not.toHaveBeenCalled();
    });

    it('previewLine() should not preview the joints if type is WITHOUT_JOINTS', () => {
        service['lineType'] = LineType.WITHOUT_JOINTS;

        const mousePosition: Vec2 = { x: 3, y: 42 };

        lineShapeStub.vertices.length = 0; // A shape is not being drawn
        service.previewLine(mousePosition);

        lineShapeStub.vertices.length = 1; // A shape is being drawn
        service.previewLine(mousePosition);

        expect(lineJointsRendererRenderMethodStub).not.toHaveBeenCalled();
    });

    it("ajustLineWidth() method should change the line's stroke width property", () => {
        const INITIAL_LINE_WIDTH = 1;
        const NEW_LINE_WIDTH = 3;

        service['strokeWidthProperty'].strokeWidth = INITIAL_LINE_WIDTH;
        service.adjustLineWidth(NEW_LINE_WIDTH);

        expect(service['strokeWidthProperty'].strokeWidth).toEqual(NEW_LINE_WIDTH);
    });

    it('setLineType() method should change the line type attribute accordintly', () => {
        const LINE_TYPES = [LineType.WITH_JOINTS, LineType.WITHOUT_JOINTS];

        LINE_TYPES.forEach((initialType) => {
            LINE_TYPES.forEach((givenType) => {
                service['lineType'] = initialType;
                service.setLineType(givenType);
                expect(service['lineType']).toEqual(givenType);
            });
        });
    });

    it("setJointsDiameter() method should change the shape's jointsDiameter attribute accordingly", () => {
        // tslint:disable-next-line: no-magic-numbers
        const SAMPLE_DIAMETERS = [5, 0, 52, 42];

        SAMPLE_DIAMETERS.forEach((initialDiameter) => {
            SAMPLE_DIAMETERS.forEach((givenDiameter) => {
                lineShapeStub.jointsDiameter = initialDiameter;
                service.setJointsDiameter(givenDiameter);
                expect(lineShapeStub.jointsDiameter).toEqual(givenDiameter);
            });
        });
    });
});
