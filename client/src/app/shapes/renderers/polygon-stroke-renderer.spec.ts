import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import { PolygonShape } from '@app/shapes/polygon-shape';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { MathsHelper } from '../helper/maths-helper.service';
import { PolygonStrokeRenderer } from './polygon-stroke-renderer';

// tslint:disable:no-any
describe('PolygonStrokeRenderer', () => {
    const INITIAL_TOP_LEFT = { x: 0, y: 0 };
    const INITIAL_BOTTOM_RIGHT = { x: 32, y: 32 };
    const INITIAL_NUMBER_SIDES = 3;
    const CONTOUR_WIDTH = 6;

    let renderer: PolygonStrokeRenderer;
    let shape: PolygonShape;
    let properties: ShapeProperty[];

    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    let ctxLineSpy: jasmine.Spy<any>;
    let ctxBeginPathSpy: jasmine.Spy<any>;
    let ctxStrokeSpy: jasmine.Spy<any>;
    let mathsHelper: MathsHelper;

    beforeEach(() => {
        properties = new Array<ShapeProperty>();
        shape = new PolygonShape(INITIAL_TOP_LEFT, INITIAL_BOTTOM_RIGHT, INITIAL_NUMBER_SIDES, CONTOUR_WIDTH);
        mathsHelper = new MathsHelper();
        renderer = new PolygonStrokeRenderer(shape, properties, mathsHelper);

        canvasTestHelper = new CanvasTestHelper();
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        ctxLineSpy = spyOn<any>(ctxStub, 'lineTo').and.callThrough();
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

    it('should call rect with shape position/dimensions when render() is called', () => {
        renderer.render(ctxStub);
        expect(ctxLineSpy).toHaveBeenCalled();
    });
    it('squarePoint should pick component y if smaller than component x', () => {
        const START_POINT: Vec2 = { x: 0, y: 0 };
        const END_POINT: Vec2 = { x: 1, y: 2 };
        const COMP_X = END_POINT.x - START_POINT.x;
        expect(renderer.squarePoint(START_POINT, END_POINT)).toBe(COMP_X);
    });
    it('squarePoint should pick component y if smaller than component x', () => {
        const START_POINT: Vec2 = { x: 0, y: 0 };
        const END_POINT: Vec2 = { x: 2, y: 1 };
        const COMP_Y = END_POINT.y - START_POINT.y;
        expect(renderer.squarePoint(START_POINT, END_POINT)).toBe(COMP_Y);
    });
});
