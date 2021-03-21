import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { ContouredBoxShape } from '@app/shapes/contoured-box-shape';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { RectangleStrokeRenderer } from './rectangle-stroke-renderer';

// tslint:disable:no-any
describe('RectangleStrokeRenderer', () => {
    const INITIAL_TOP_LEFT = { x: 0, y: 0 };
    const INITIAL_BOTTOM_RIGHT = { x: 32, y: 32 };
    const CONTOUR_WIDTH = 6;

    let renderer: RectangleStrokeRenderer;
    let shape: ContouredBoxShape;
    let properties: ShapeProperty[];

    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    let ctxRectSpy: jasmine.Spy<any>;
    let ctxBeginPathSpy: jasmine.Spy<any>;
    let ctxStrokeSpy: jasmine.Spy<any>;

    beforeEach(() => {
        properties = new Array<ShapeProperty>();
        shape = new ContouredBoxShape(INITIAL_TOP_LEFT, INITIAL_BOTTOM_RIGHT, CONTOUR_WIDTH);
        renderer = new RectangleStrokeRenderer(shape, properties);

        canvasTestHelper = new CanvasTestHelper();
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        ctxRectSpy = spyOn<any>(ctxStub, 'rect').and.callThrough();
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
        const HALF_CONTOUR_WIDTH = CONTOUR_WIDTH / 2;

        renderer.render(ctxStub);
        expect(ctxRectSpy).toHaveBeenCalledWith(
            shape.topLeft.x - HALF_CONTOUR_WIDTH,
            shape.topLeft.y - HALF_CONTOUR_WIDTH,
            shape.width + CONTOUR_WIDTH,
            shape.height + CONTOUR_WIDTH,
        );
    });
});
