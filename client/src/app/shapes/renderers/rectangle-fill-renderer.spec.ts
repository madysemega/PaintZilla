import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { ContouredBoxShape } from '../contoured-box-shape';
import { RectangleFillRenderer } from './rectangle-fill-renderer';

// tslint:disable:no-any
describe('RectangleFillRenderer', () => {
    const INITIAL_TOP_LEFT = { x: 0, y: 0 };
    const INITIAL_BOTTOM_RIGHT = { x: 32, y: 32 };
    const CONTOUR_WIDTH = 6;

    let renderer: RectangleFillRenderer;
    let shape: ContouredBoxShape;
    let properties: ShapeProperty[];

    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    let ctxRectSpy: jasmine.Spy<any>;
    let ctxBeginPathSpy: jasmine.Spy<any>;
    let ctxFillSpy: jasmine.Spy<any>;

    beforeEach(() => {
        properties = new Array<ShapeProperty>();
        shape = new ContouredBoxShape(INITIAL_TOP_LEFT, INITIAL_BOTTOM_RIGHT, CONTOUR_WIDTH);
        renderer = new RectangleFillRenderer(shape, properties);

        canvasTestHelper = new CanvasTestHelper();
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        ctxRectSpy = spyOn<any>(ctxStub, 'rect').and.callThrough();
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

    it('should call rect with shape position/dimensions when render() is called', () => {
        const HALF_CONTOUR_WIDTH = CONTOUR_WIDTH / 2;

        renderer.render(ctxStub);
        expect(ctxRectSpy).toHaveBeenCalledWith(
            shape.topLeft.x + HALF_CONTOUR_WIDTH,
            shape.topLeft.y + HALF_CONTOUR_WIDTH,
            shape.width - CONTOUR_WIDTH,
            shape.height - CONTOUR_WIDTH,
        );
    });
});
