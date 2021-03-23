import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import { EraserShape } from '@app/shapes/eraser-shape';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { EraserRenderer } from './eraser-renderer';

// tslint:disable:no-any
describe('EraserRenderer', () => {
    const DEFAULT_STROKE_WIDTH = 5;

    let renderer: EraserRenderer;
    let shape: EraserShape;
    let properties: ShapeProperty[];
    let vertices: Vec2[];

    let strokeWidth: number;

    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    let ctxMoveToSpy: jasmine.Spy<any>;
    let ctxLineToSpy: jasmine.Spy<any>;

    let drawRightwardPolygonSpy: jasmine.Spy<any>;
    let drawLeftwardPolygonSpy: jasmine.Spy<any>;

    beforeEach(() => {
        strokeWidth = DEFAULT_STROKE_WIDTH;

        properties = new Array<ShapeProperty>();
        vertices = new Array<Vec2>();
        shape = new EraserShape(vertices, strokeWidth);
        renderer = new EraserRenderer(shape, properties);

        canvasTestHelper = new CanvasTestHelper();
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        ctxMoveToSpy = spyOn<any>(ctxStub, 'moveTo').and.callThrough();
        ctxLineToSpy = spyOn<any>(ctxStub, 'lineTo').and.callThrough();

        drawRightwardPolygonSpy = spyOn<any>(renderer, 'drawRightwardPolygon').and.callThrough();
        drawLeftwardPolygonSpy = spyOn<any>(renderer, 'drawLeftwardPolygon').and.callThrough();
    });

    it('drawRightwardPolygon() should draw a rightward Polygon', () => {
        const HALF_WIDTH = 3;
        const TOP_LEFT = { x: 3, y: 5 };
        const BOTTOM_RIGHT = { x: 28, y: 56 };

        renderer.drawRightwardPolygon(ctxStub, TOP_LEFT, BOTTOM_RIGHT, 2 * HALF_WIDTH);

        expect(ctxMoveToSpy).toHaveBeenCalledWith(TOP_LEFT.x - HALF_WIDTH, TOP_LEFT.y - HALF_WIDTH);
        expect(ctxLineToSpy).toHaveBeenCalledWith(TOP_LEFT.x + HALF_WIDTH, TOP_LEFT.y - HALF_WIDTH);
        expect(ctxLineToSpy).toHaveBeenCalledWith(BOTTOM_RIGHT.x + HALF_WIDTH, BOTTOM_RIGHT.y - HALF_WIDTH);
        expect(ctxLineToSpy).toHaveBeenCalledWith(BOTTOM_RIGHT.x + HALF_WIDTH, BOTTOM_RIGHT.y + HALF_WIDTH);
        expect(ctxLineToSpy).toHaveBeenCalledWith(BOTTOM_RIGHT.x - HALF_WIDTH, BOTTOM_RIGHT.y + HALF_WIDTH);
        expect(ctxLineToSpy).toHaveBeenCalledWith(TOP_LEFT.x - HALF_WIDTH, TOP_LEFT.y + HALF_WIDTH);
    });

    it('drawLeftwardPolygon() should draw a leftward Polygon', () => {
        const HALF_WIDTH = 3;
        const TOP_RIGHT = { x: 3, y: 5 };
        const BOTTOM_LEFT = { x: 28, y: 56 };

        renderer.drawLeftwardPolygon(ctxStub, TOP_RIGHT, BOTTOM_LEFT, 2 * HALF_WIDTH);

        expect(ctxMoveToSpy).toHaveBeenCalledWith(TOP_RIGHT.x + HALF_WIDTH, TOP_RIGHT.y - HALF_WIDTH);
        expect(ctxLineToSpy).toHaveBeenCalledWith(TOP_RIGHT.x + HALF_WIDTH, TOP_RIGHT.y + HALF_WIDTH);
        expect(ctxLineToSpy).toHaveBeenCalledWith(BOTTOM_LEFT.x + HALF_WIDTH, BOTTOM_LEFT.y + HALF_WIDTH);
        expect(ctxLineToSpy).toHaveBeenCalledWith(BOTTOM_LEFT.x - HALF_WIDTH, BOTTOM_LEFT.y + HALF_WIDTH);
        expect(ctxLineToSpy).toHaveBeenCalledWith(BOTTOM_LEFT.x - HALF_WIDTH, BOTTOM_LEFT.y - HALF_WIDTH);
        expect(ctxLineToSpy).toHaveBeenCalledWith(TOP_RIGHT.x - HALF_WIDTH, TOP_RIGHT.y - HALF_WIDTH);
    });

    it('draw() should draw (only) a rightward Polygon if movement is down-right', () => {
        shape.vertices.push({ x: 0, y: 0 });
        shape.vertices.push({ x: 34, y: 42 });

        renderer.draw(ctxStub);

        expect(drawRightwardPolygonSpy).toHaveBeenCalled();
        expect(drawLeftwardPolygonSpy).not.toHaveBeenCalled();
    });

    it('drawVertices() should draw (only) a rightward Polygon if movement is up-left', () => {
        shape.vertices.push({ x: 34, y: 42 });
        shape.vertices.push({ x: 0, y: 0 });

        renderer.draw(ctxStub);

        expect(drawRightwardPolygonSpy).toHaveBeenCalled();
        expect(drawLeftwardPolygonSpy).not.toHaveBeenCalled();
    });

    it('drawVertices() should draw (only) a leftward polygon if movement is down-left', () => {
        shape.vertices.push({ x: 34, y: 0 });
        shape.vertices.push({ x: 0, y: 42 });

        renderer.draw(ctxStub);

        expect(drawLeftwardPolygonSpy).toHaveBeenCalled();
        expect(drawRightwardPolygonSpy).not.toHaveBeenCalled();
    });

    it('drawVertices() should draw (only) a leftward polygon if movement is up-right', () => {
        shape.vertices.push({ x: 0, y: 42 });
        shape.vertices.push({ x: 34, y: 0 });

        renderer.draw(ctxStub);

        expect(drawLeftwardPolygonSpy).toHaveBeenCalled();
        expect(drawRightwardPolygonSpy).not.toHaveBeenCalled();
    });
});
