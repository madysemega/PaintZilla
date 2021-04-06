import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { TextShape } from '@app/shapes/text-shape';
import { TextRenderer } from './text-renderer';

// tslint:disable:no-any
describe('TextRenderer', () => {
    const TEXT = 'Test';
    const POSITION = { x: 42, y: 32 };
    const FONT_SIZE = 24;

    let renderer: TextRenderer;
    let shape: TextShape;
    let properties: ShapeProperty[];

    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    let ctxFillTextSpy: jasmine.Spy<any>;

    beforeEach(() => {
        properties = new Array<ShapeProperty>();
        shape = new TextShape(TEXT, POSITION, FONT_SIZE);
        renderer = new TextRenderer(shape, properties);

        canvasTestHelper = new CanvasTestHelper();
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        ctxFillTextSpy = spyOn<any>(ctxStub, 'fillText').and.callThrough();
    });

    it('should fillText with givent shape data', () => {
        renderer.render(ctxStub);
        expect(ctxFillTextSpy).toHaveBeenCalledWith(TEXT, POSITION.x, POSITION.y);
    });

    it('clone should return an identical copy', () => {
        const clone = renderer.clone() as TextRenderer;
        expect(clone).toEqual(renderer);
    });
});
