import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import { LineShape } from '@app/shapes/line-shape';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { LineShapeRenderer } from './line-shape-renderer';

// tslint:disable:no-any
describe('LineShapeRenderer', () => {
    let lineShapeRenderer: LineShapeRenderer;
    let lineShape: LineShape;
    let properties: ShapeProperty[];
    let vertices: Vec2[];

    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    let ctxLineToSpy: jasmine.Spy<any>;
    let ctxBeginPathSpy: jasmine.Spy<any>;
    let ctxStrokeSpy: jasmine.Spy<any>;

    beforeEach(() => {
        properties = new Array<ShapeProperty>();
        vertices = new Array<Vec2>();
        lineShape = new LineShape(vertices);
        lineShapeRenderer = new LineShapeRenderer(lineShape, properties);

        canvasTestHelper = new CanvasTestHelper();
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        ctxLineToSpy = spyOn<any>(ctxStub, 'lineTo').and.callThrough();
        ctxBeginPathSpy = spyOn<any>(ctxStub, 'beginPath').and.callThrough();
        ctxStrokeSpy = spyOn<any>(ctxStub, 'stroke').and.callThrough();
    });

    it('should call beginPath once when render() is called', () => {
        vertices.push({ x: 0, y: 0 });
        vertices.push({ x: 0, y: 20 });
        vertices.push({ x: 20, y: 20 });

        lineShapeRenderer.render(ctxStub);

        expect(ctxBeginPathSpy).toHaveBeenCalledTimes(1);
    });

    it('should call stroke once when render() is called', () => {
        vertices.push({ x: 0, y: 0 });
        vertices.push({ x: 0, y: 20 });
        vertices.push({ x: 20, y: 20 });

        lineShapeRenderer.render(ctxStub);

        expect(ctxStrokeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call lineTo for every vertex when render() is called', () => {
        vertices.push({ x: 0, y: 0 });
        vertices.push({ x: 0, y: 20 });
        vertices.push({ x: 20, y: 20 });

        lineShapeRenderer.render(ctxStub);

        expect(ctxLineToSpy).toHaveBeenCalledWith(vertices[0].x, vertices[0].y);
        expect(ctxLineToSpy).toHaveBeenCalledWith(vertices[1].x, vertices[1].y);
        expect(ctxLineToSpy).toHaveBeenCalledWith(vertices[2].x, vertices[2].y);
    });
});
