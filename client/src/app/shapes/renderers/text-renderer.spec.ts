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

    it('getAlignmentAjustedXPosition() should return shape position if alignment is left', () => {
        const MAX_LINE_POSITION = 64;
        const X_POSITION = 32;

        spyOn<any>(shape, 'getMaxLineWidth').and.returnValue(MAX_LINE_POSITION);
        shape.position.x = X_POSITION;
        shape.textAlignment = 'left';

        expect(renderer['getAlignmentAjustedXPosition'](ctxStub)).toEqual(X_POSITION);
    });

    it('getAlignmentAjustedXPosition() should offset shape position by the max line width if alignment is right', () => {
        const MAX_LINE_POSITION = 64;
        const X_POSITION = 32;

        spyOn<any>(shape, 'getMaxLineWidth').and.returnValue(MAX_LINE_POSITION);
        shape.position.x = X_POSITION;
        shape.textAlignment = 'right';

        expect(renderer['getAlignmentAjustedXPosition'](ctxStub)).toEqual(X_POSITION + MAX_LINE_POSITION);
    });

    it('getAlignmentAjustedXPosition() should offset shape position by half the max line width if alignment is center', () => {
        const MAX_LINE_POSITION = 64;
        const X_POSITION = 32;

        spyOn<any>(shape, 'getMaxLineWidth').and.returnValue(MAX_LINE_POSITION);
        shape.position.x = X_POSITION;
        shape.textAlignment = 'center';

        expect(renderer['getAlignmentAjustedXPosition'](ctxStub)).toEqual(X_POSITION + MAX_LINE_POSITION / 2);
    });

    it('clone should return an identical copy', () => {
        const clone = renderer.clone() as TextRenderer;
        expect(clone).toEqual(renderer);
    });
});
