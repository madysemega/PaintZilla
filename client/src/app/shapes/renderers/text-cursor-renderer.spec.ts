import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { FontProperty } from '@app/shapes/properties/font-property';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { TextShape } from '@app/shapes/text-shape';
import { TextCursorRenderer } from './text-cursor-renderer';
import { TextRenderer } from './text-renderer';

// tslint:disable:no-any
// tslint:disable:no-string-literal
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
        properties.push(new FontProperty(FONT_SIZE));
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

    it('offset should reset x when \\n is reached', () => {
        const CURSOR_POSITION = 4;

        renderer['shape'].text = '123\n321';
        expect(renderer['getOffsetsAt'](CURSOR_POSITION, ctxStub).x).toEqual(0);
    });

    it('Y offset should correspond to the nb. of \\n in the text before the cursor (times fontSize)', () => {
        const CURSOR_POSITION = 6;
        const EXPECTED_NB_RETURNS = 2;
        const DEFAULT_FONT_SIZE = 12;
        const EXPECTED_Y_OFFSET = EXPECTED_NB_RETURNS * DEFAULT_FONT_SIZE;

        renderer['shape'].text = '123\n321\nabc\n';
        expect(renderer['getOffsetsAt'](CURSOR_POSITION, ctxStub).y).toEqual(EXPECTED_Y_OFFSET);
    });

    it('clone should return an identical copy', () => {
        const clone = renderer.clone() as TextRenderer;
        expect(clone).toEqual(renderer);
    });
});
