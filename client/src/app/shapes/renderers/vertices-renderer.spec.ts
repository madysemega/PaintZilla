import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { VerticesShape } from '@app/shapes/vertices-shape';
import { VerticesRenderer } from './vertices-renderer';

// tslint:disable:no-any
describe('Verticesrenderer', () => {
    let renderer: VerticesRenderer;
    let shape: VerticesShape;
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
        shape = new VerticesShape(vertices);
        renderer = new VerticesRenderer(shape, properties);

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

        renderer.render(ctxStub);

        expect(ctxBeginPathSpy).toHaveBeenCalledTimes(1);
    });

    it('should call stroke once when render() is called', () => {
        vertices.push({ x: 0, y: 0 });
        vertices.push({ x: 0, y: 20 });
        vertices.push({ x: 20, y: 20 });

        renderer.render(ctxStub);

        expect(ctxStrokeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call lineTo for every vertex when render() is called', () => {
        vertices.push({ x: 0, y: 0 });
        vertices.push({ x: 0, y: 20 });
        vertices.push({ x: 20, y: 20 });

        renderer.render(ctxStub);

        expect(ctxLineToSpy).toHaveBeenCalledWith(vertices[0].x, vertices[0].y);
        expect(ctxLineToSpy).toHaveBeenCalledWith(vertices[1].x, vertices[1].y);
        expect(ctxLineToSpy).toHaveBeenCalledWith(vertices[2].x, vertices[2].y);
    });
});
