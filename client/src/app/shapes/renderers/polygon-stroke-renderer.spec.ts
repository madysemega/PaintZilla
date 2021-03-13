import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { PolygonShape } from '@app/shapes/polygon-shape';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { PolygonStrokeRenderer } from './polygon-stroke-renderer';

// tslint:disable:no-any
describe('PolygonStrokeRenderer', () => {
    const INITIAL_TOP_LEFT = { x: 0, y: 0 };
    const INITIAL_BOTTOM_RIGHT = { x: 32, y: 32 };
    const INITIAL_NUMBER_SIDES = 3;

    let renderer: PolygonStrokeRenderer;
    let shape: PolygonShape;
    let properties: ShapeProperty[];

    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    let ctxLineSpy: jasmine.Spy<any>;
    let ctxBeginPathSpy: jasmine.Spy<any>;
    let ctxStrokeSpy: jasmine.Spy<any>;

    beforeEach(() => {
        properties = new Array<ShapeProperty>();
        shape = new PolygonShape(INITIAL_TOP_LEFT, INITIAL_BOTTOM_RIGHT, INITIAL_NUMBER_SIDES);
        renderer = new PolygonStrokeRenderer(shape, properties);

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
});
