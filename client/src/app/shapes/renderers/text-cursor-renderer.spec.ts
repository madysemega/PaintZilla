import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { FontProperty } from '@app/shapes/properties/font-property';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { TextShape } from '@app/shapes/text-shape/text-shape';
import { TextCursor } from '@app/tools/services/tools/text/text-cursor';
import { TextCursorRenderer } from './text-cursor-renderer';
import { TextRenderer } from './text-renderer';

// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('TextCursorRenderer', () => {
    const TEXT = 'Test';
    const POSITION = { x: 42, y: 32 };
    const FONT_SIZE = 24;
    const FONT_NAME = 'Arial';
    const FONT_IS_BOLD = false;
    const FONT_IS_ITALIC = false;

    const INITIAL_CURSOR_POSITION = 0;

    let renderer: TextCursorRenderer;
    let shape: TextShape;
    let cursor: TextCursor;
    let properties: ShapeProperty[];

    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    let ctxMoveToSpy: jasmine.Spy<any>;

    beforeEach(() => {
        properties = new Array<ShapeProperty>();
        properties.push(new FontProperty(FONT_SIZE, FONT_NAME, FONT_IS_BOLD, FONT_IS_ITALIC));
        shape = new TextShape(TEXT, POSITION, FONT_SIZE);
        cursor = new TextCursor(shape, INITIAL_CURSOR_POSITION);
        renderer = new TextCursorRenderer(shape, properties, cursor);

        canvasTestHelper = new CanvasTestHelper();
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        ctxMoveToSpy = spyOn(ctxStub, 'moveTo').and.callThrough();
    });

    it('cursor should be rendered with xOffset relative to the width of characters in the text', () => {
        const X_OFFSET = ctxStub.measureText(shape.text.substr(0, renderer.cursor.position)).width;
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

    it('getTextCurrentLineWidth() should return width of full text in no \\n is present', () => {
        shape.text = '1234567890';
        expect(renderer['getTextCurrentLineWidth'](ctxStub)).toEqual(ctxStub.measureText(shape.text).width);
    });

    it('getTextCurrentLineWidth() should return 0 if line is empty', () => {
        shape.text = '';
        expect(renderer['getTextCurrentLineWidth'](ctxStub)).toEqual(0);
    });

    it('getRealPosition() should return the start value if alignment is left', () => {
        const START_POSITION = { x: 3, y: 4 };

        properties[0].apply(ctxStub);
        shape.text = '1234567890';
        shape.textAlignment = 'left';

        expect(renderer['getRealPosition'](START_POSITION, ctxStub)).toEqual(START_POSITION);
    });

    it("getRealPosition() should offset by the current line's length if alignment is right", () => {
        const START_POSITION = { x: 3, y: 4 };
        const MAX_LINE_WIDTH = 64;
        const CURRENT_LINE_WIDTH = 32;

        spyOn<any>(renderer, 'getTextCurrentLineWidth').and.returnValue(CURRENT_LINE_WIDTH);
        spyOn<any>(shape, 'getMaxLineWidth').and.returnValue(MAX_LINE_WIDTH);
        shape.textAlignment = 'right';

        expect(renderer['getRealPosition'](START_POSITION, ctxStub)).toEqual({
            x: START_POSITION.x + MAX_LINE_WIDTH - CURRENT_LINE_WIDTH,
            y: START_POSITION.y,
        });
    });

    it("getRealPosition() should offset by half the current line's length if alignment is center", () => {
        const START_POSITION = { x: 3, y: 4 };
        const MAX_LINE_WIDTH = 64;
        const CURRENT_LINE_WIDTH = 32;

        spyOn<any>(renderer, 'getTextCurrentLineWidth').and.returnValue(CURRENT_LINE_WIDTH);
        spyOn<any>(shape, 'getMaxLineWidth').and.returnValue(MAX_LINE_WIDTH);
        shape.textAlignment = 'center';

        expect(renderer['getRealPosition'](START_POSITION, ctxStub)).toEqual({
            x: START_POSITION.x + (MAX_LINE_WIDTH - CURRENT_LINE_WIDTH) / 2,
            y: START_POSITION.y,
        });
    });

    it('getRealPosition() should return the start value if alignment is not left, right nor center', () => {
        const START_POSITION = { x: 3, y: 4 };
        const CURSOR_POSITION = 6;

        shape.text = '1234\n1234\n';
        renderer.cursor.position = CURSOR_POSITION;
        shape.textAlignment = 'start';
        expect(renderer['getRealPosition'](START_POSITION, ctxStub)).toEqual(START_POSITION);
    });

    it('clone should return an identical copy', () => {
        const clone = renderer.clone() as TextRenderer;
        expect(clone).toEqual(renderer);
    });
});
