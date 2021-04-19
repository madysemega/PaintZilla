import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import { BoxShape } from '@app/shapes/box-shape';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { MathsHelper } from '../helper/maths-helper.service';
import { EllipseStrokeRenderer } from './ellipse-stroke-renderer';

// tslint:disable:no-any
describe('EllipseStrokeRenderer', () => {
    const INITIAL_TOP_LEFT = { x: 0, y: 0 };
    const INITIAL_BOTTOM_RIGHT = { x: 32, y: 32 };

    let renderer: EllipseStrokeRenderer;
    let shape: BoxShape;
    let properties: ShapeProperty[];

    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    let ctxEllipseSpy: jasmine.Spy<any>;
    let ctxBeginPathSpy: jasmine.Spy<any>;
    let ctxStrokeSpy: jasmine.Spy<any>;
    let mathsHelper: MathsHelper = TestBed.inject(MathsHelper);


    beforeEach(() => {
        properties = new Array<ShapeProperty>();
        shape = new BoxShape(INITIAL_TOP_LEFT, INITIAL_BOTTOM_RIGHT);

        renderer = new EllipseStrokeRenderer(shape, properties, mathsHelper);

        canvasTestHelper = new CanvasTestHelper();
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        ctxEllipseSpy = spyOn<any>(ctxStub, 'ellipse').and.callThrough();
        ctxBeginPathSpy = spyOn<any>(ctxStub, 'beginPath').and.callThrough();
        ctxStrokeSpy = spyOn<any>(ctxStub, 'stroke').and.callThrough();
    });

    it('should call beginPath once when render() is called', () => {
        renderer.render(ctxStub);
        expect(ctxBeginPathSpy).toHaveBeenCalledTimes(1);
    });

    it('should call stroke once when render() is called', () => {
        renderer.render(ctxStub);
        expect(ctxStrokeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call ellipse with shape position/radii when render() is called', () => {
        const FULL_CIRCLE_DEG = 360;

        const center: Vec2 = {
            x: (shape.topLeft.x + shape.bottomRight.x) / 2,
            y: (shape.topLeft.y + shape.bottomRight.y) / 2,
        };

        const radii: Vec2 = {
            x: Math.abs(shape.topLeft.x - shape.bottomRight.x) / 2,
            y: Math.abs(shape.topLeft.y - shape.bottomRight.y) / 2,
        };

        renderer.render(ctxStub);
        expect(ctxEllipseSpy).toHaveBeenCalledWith(center.x, center.y, radii.x, radii.y, 0, 0, FULL_CIRCLE_DEG);
    });
});
