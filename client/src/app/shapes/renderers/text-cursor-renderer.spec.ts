import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { TextShape } from '../text-shape';
import { TextCursorRenderer } from './text-cursor-renderer';
import { TextRenderer } from './text-renderer';

// tslint:disable:no-any
describe('TextCursorRenderer', () => {
    const TEXT = 'Test';
    const POSITION = { x: 42, y: 32 };
    const FONT_SIZE = 24;

    const INITIAL_CURSOR_POSITION = 0;

    let renderer: TextCursorRenderer;
    let shape: TextShape;
    let properties: ShapeProperty[];

    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    let ctxMoveToSpy: jasmine.Spy<any>;

    beforeEach(() => {
        properties = new Array<ShapeProperty>();
        shape = new TextShape(TEXT, POSITION, FONT_SIZE);
        renderer = new TextCursorRenderer(shape, properties, INITIAL_CURSOR_POSITION);

        canvasTestHelper = new CanvasTestHelper();
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        ctxMoveToSpy = spyOn(ctxStub, 'moveTo').and.callThrough();
    });

    it('cursor should be rendered with xOffset relative to the width of characters in the text', () => {
        const X_OFFSET = ctxStub.measureText(shape.text.substr(0, renderer.cursorPosition)).width;
        const EXPECTED_X_POSITION = shape.position.x + X_OFFSET;

        renderer.render(ctxStub);
        expect(ctxMoveToSpy).toHaveBeenCalledWith(EXPECTED_X_POSITION, POSITION.y - FONT_SIZE);
    });

    it('clone should return an identical copy', () => {
        const clone = renderer.clone() as TextRenderer;
        expect(clone).toEqual(renderer);
    });
});
