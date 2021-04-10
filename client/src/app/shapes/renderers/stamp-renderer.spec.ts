import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { StampShape } from '@app/shapes/stamp-shape';
import { StampRenderer } from './stamp-renderer';
// tslint:disable:no-any
describe('StampRenderer', () => {
    const INITIAL_TOP_LEFT = { x: 0, y: 0 };
    const INITIAL_BOTTOM_RIGHT = { x: 32, y: 32 };
    const INITIAL_ANGLE = 0;
    const INITIAL_SRC = 'test';

    let renderer: StampRenderer;
    let shape: StampShape;
    let properties: ShapeProperty[];

    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    let ctxImageSpy: jasmine.Spy<any>;
    let ctxTranslateSpy: jasmine.Spy<any>;

    beforeEach(() => {
        properties = new Array<ShapeProperty>();
        shape = new StampShape(INITIAL_TOP_LEFT, INITIAL_BOTTOM_RIGHT, new Image(), INITIAL_ANGLE, INITIAL_SRC);
        renderer = new StampRenderer(shape, properties);

        canvasTestHelper = new CanvasTestHelper();
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        ctxImageSpy = spyOn<any>(ctxStub, 'drawImage').and.callThrough();
        ctxTranslateSpy = spyOn<any>(ctxStub, 'translate').and.callThrough();
    });

    it('render should call drawImage once', () => {
        renderer.render(ctxStub);
        expect(ctxImageSpy).toHaveBeenCalledTimes(1);
    });

    it('render should call translate on ctx', () => {
        renderer.render(ctxStub);
        expect(ctxTranslateSpy).toHaveBeenCalledTimes(2);
    });
    it('clone', () => {
        const CLONE = renderer.clone();
        expect(CLONE).toEqual(renderer);
    });
});
