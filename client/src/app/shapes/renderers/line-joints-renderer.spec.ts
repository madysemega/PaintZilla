import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import { LineShape } from '@app/shapes/line-shape/line-shape';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { LineJointsRenderer } from './line-joints-renderer';

// tslint:disable:no-any
describe('LineJointsRenderer', () => {
    let lineJointsRenderer: LineJointsRenderer;
    let lineShape: LineShape;
    let properties: ShapeProperty[];
    let vertices: Vec2[];

    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    let ctxEllipseSpy: jasmine.Spy<any>;
    let ctxBeginPathSpy: jasmine.Spy<any>;
    let ctxFillSpy: jasmine.Spy<any>;

    beforeEach(() => {
        properties = new Array<ShapeProperty>();
        vertices = new Array<Vec2>();
        lineShape = new LineShape(vertices);
        lineJointsRenderer = new LineJointsRenderer(lineShape, properties);

        canvasTestHelper = new CanvasTestHelper();
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        ctxEllipseSpy = spyOn<any>(ctxStub, 'ellipse').and.callThrough();
        ctxBeginPathSpy = spyOn<any>(ctxStub, 'beginPath').and.callThrough();
        ctxFillSpy = spyOn<any>(ctxStub, 'fill').and.callThrough();
    });

    it('should call ellipse with the right parameters when render() is called', () => {
        const FULL_CIRCLE_DEGREES = 360;

        const verticesToAdd: Vec2[] = [
            { x: 0, y: 0 },
            { x: 0, y: 20 },
            { x: 20, y: -20 },
        ];

        const expectedRadius = lineShape.jointsDiameter / 2;

        verticesToAdd.forEach((vertex) => vertices.push(vertex));

        lineJointsRenderer.render(ctxStub);

        verticesToAdd.forEach((vertex) => {
            expect(ctxEllipseSpy).toHaveBeenCalledWith(vertex.x, vertex.y, expectedRadius, expectedRadius, 0, 0, FULL_CIRCLE_DEGREES);
        });
    });

    it('should call beginPath as many times as there are vertices when render() is called', () => {
        const verticesToAdd: Vec2[] = [
            { x: 0, y: 0 },
            { x: 0, y: 20 },
            { x: 20, y: -20 },
        ];

        verticesToAdd.forEach((vertex) => vertices.push(vertex));

        lineJointsRenderer.render(ctxStub);

        expect(ctxBeginPathSpy).toHaveBeenCalledTimes(verticesToAdd.length);
    });

    it('should call stroke as many times as there are vertices when render() is called', () => {
        const verticesToAdd: Vec2[] = [
            { x: 0, y: 0 },
            { x: 0, y: 20 },
            { x: 20, y: -20 },
        ];

        verticesToAdd.forEach((vertex) => vertices.push(vertex));

        lineJointsRenderer.render(ctxStub);

        expect(ctxFillSpy).toHaveBeenCalledTimes(verticesToAdd.length);
    });
});
