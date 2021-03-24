import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import { ContouredBoxShape } from '@app/shapes/contoured-box-shape';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { EllipseFillRenderer } from './ellipse-fill-renderer';

// tslint:disable:no-any
describe('EllipseFillRenderer', () => {
    const INITIAL_TOP_LEFT = { x: 0, y: 0 };
    const INITIAL_BOTTOM_RIGHT = { x: 32, y: 32 };
    const CONTOUR_WIDTH = 6;

    let renderer: EllipseFillRenderer;
    let shape: ContouredBoxShape;
    let properties: ShapeProperty[];

    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    let ctxEllipseSpy: jasmine.Spy<any>;
    let ctxBeginPathSpy: jasmine.Spy<any>;
    let ctxFillSpy: jasmine.Spy<any>;

    beforeEach(() => {
        properties = new Array<ShapeProperty>();
        shape = new ContouredBoxShape(INITIAL_TOP_LEFT, INITIAL_BOTTOM_RIGHT, CONTOUR_WIDTH);
        renderer = new EllipseFillRenderer(shape, properties);

        canvasTestHelper = new CanvasTestHelper();
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        ctxEllipseSpy = spyOn<any>(ctxStub, 'ellipse').and.callThrough();
        ctxBeginPathSpy = spyOn<any>(ctxStub, 'beginPath').and.callThrough();
        ctxFillSpy = spyOn<any>(ctxStub, 'fill').and.callThrough();
    });

    it('should call beginPath once when render() is called', () => {
        renderer.render(ctxStub);
        expect(ctxBeginPathSpy).toHaveBeenCalledTimes(1);
    });

    it('should call fill once when render() is called', () => {
        renderer.render(ctxStub);
        expect(ctxFillSpy).toHaveBeenCalledTimes(1);
    });

    it('should call ellipse with shape position/radii when render() is called', () => {
        const FULL_CIRCLE_DEG = 360;
        const HALF_CONTOUR_WIDTH = CONTOUR_WIDTH / 2;

        const center: Vec2 = {
            x: (shape.topLeft.x + shape.bottomRight.x) / 2,
            y: (shape.topLeft.y + shape.bottomRight.y) / 2,
        };

        const radii: Vec2 = {
            x: Math.max(Math.abs(shape.topLeft.x - shape.bottomRight.x) / 2 - HALF_CONTOUR_WIDTH,0),
            y: Math.max(Math.abs(shape.topLeft.y - shape.bottomRight.y) / 2 - HALF_CONTOUR_WIDTH,0),
        };

        renderer.render(ctxStub);
        expect(ctxEllipseSpy).toHaveBeenCalledWith(center.x, center.y, radii.x, radii.y, 0, 0, FULL_CIRCLE_DEG);
    });
});
