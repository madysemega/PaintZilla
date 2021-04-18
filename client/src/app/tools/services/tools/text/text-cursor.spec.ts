import { TextShape } from '@app/shapes/text-shape/text-shape';
import { TextCursor } from './text-cursor';

// tslint:disable: no-string-literal
describe('TextCursor', () => {
    const INITIAL_CURSOR_POSITION = 0;
    const CANVAS_WIDTH = 100;
    const CANVAS_HEIGHT = 100;

    let shape: TextShape;
    let cursor: TextCursor;

    let ctx: CanvasRenderingContext2D;

    beforeEach(() => {
        shape = new TextShape();
        cursor = new TextCursor(shape, INITIAL_CURSOR_POSITION);

        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('Line property should be 0 if there is only one line', () => {
        const EXPECTED_VALUE = 0;

        cursor['shape'].text = '123';
        expect(cursor.line).toEqual(EXPECTED_VALUE);
    });

    it('Line property should be 0 if there are two lines and cursor is on the first', () => {
        const EXPECTED_VALUE = 0;

        cursor['shape'].text = '123\n321';
        expect(cursor.line).toEqual(EXPECTED_VALUE);
    });

    it('Line property should be 1 if there are two lines and cursor is on the second', () => {
        const EXPECTED_VALUE = 1;

        cursor['shape'].text = '123\n321';
        cursor.moveToLine(1, ctx);

        expect(cursor.line).toEqual(EXPECTED_VALUE);
    });

    it('PositionInLine property should be 0 if cursor is at beginning of text', () => {
        const EXPECTED_VALUE = 0;

        cursor['shape'].text = '123';
        expect(cursor.positionInLine).toEqual(EXPECTED_VALUE);
    });

    it('PositionInLine property should be 3 if cursor is at the 3rd position in the text', () => {
        const EXPECTED_VALUE = 3;

        cursor['shape'].text = '123';
        cursor.position += EXPECTED_VALUE;

        expect(cursor.positionInLine).toEqual(EXPECTED_VALUE);
    });

    it('PositionInLine property should be 3 if cursor is at the 3rd position of the 1st line in a text with 2 lines', () => {
        const EXPECTED_VALUE = 3;

        cursor['shape'].text = '123\n321';
        cursor.position += EXPECTED_VALUE;

        expect(cursor.positionInLine).toEqual(EXPECTED_VALUE);
    });

    it('PositionInLine property should be 3 if cursor is at the 3rd position of the 2nd line in a text with 2 lines', () => {
        const EXPECTED_VALUE = 3;
        const NEW_LINE = 1;

        cursor['shape'].text = '123\n321';
        cursor.position += EXPECTED_VALUE;
        cursor.moveToLine(NEW_LINE, ctx);

        expect(cursor.positionInLine).toEqual(EXPECTED_VALUE);
    });

    it('Line property should be 1 after moving from 1st to 2nd line in text if alignment is left', () => {
        const EXPECTED_VALUE = 1;
        const NEW_LINE = 1;

        cursor['shape'].text = '123\n321';
        cursor['shape'].textAlignment = 'left';
        cursor.moveToLine(NEW_LINE, ctx);

        expect(cursor.line).toEqual(EXPECTED_VALUE);
    });

    it('Line property should be 1 after moving from 1st to 2nd line in text if alignment is center', () => {
        const EXPECTED_VALUE = 1;
        const NEW_LINE = 1;

        cursor['shape'].text = '123\n321';
        cursor['shape'].textAlignment = 'center';
        cursor.moveToLine(NEW_LINE, ctx);

        expect(cursor.line).toEqual(EXPECTED_VALUE);
    });

    it('Line property should be 1 after moving from 1st to 2nd line in text if alignment is right', () => {
        const EXPECTED_VALUE = 1;
        const NEW_LINE = 1;

        cursor['shape'].text = '123\n321';
        cursor['shape'].textAlignment = 'right';
        cursor.moveToLine(NEW_LINE, ctx);

        expect(cursor.line).toEqual(EXPECTED_VALUE);
    });

    it('After moving from 1st to 2nd line in text, position in line should remain the same if it can', () => {
        const EXPECTED_VALUE = 3;
        const NEW_LINE = 1;

        cursor['shape'].text = '123\n321';
        cursor.position += EXPECTED_VALUE;
        cursor.moveToLine(NEW_LINE, ctx);

        expect(cursor.positionInLine).toEqual(EXPECTED_VALUE);
    });

    it('After moving down from end of first line in left aligned text to smaller line, position should be length of new line', () => {
        const EXPECTED_VALUE = 2;
        const INITIAL_POSITION_IN_LINE = 6;
        const NEW_LINE = 1;

        cursor['shape'].textAlignment = 'left';
        cursor['shape'].text = '123321\n32';
        cursor.position = INITIAL_POSITION_IN_LINE;
        cursor.moveToLine(NEW_LINE, ctx);

        expect(cursor.positionInLine).toEqual(EXPECTED_VALUE);
    });

    it('After moving down from beginning of first line in right aligned text to smaller line, position should be 0', () => {
        const EXPECTED_VALUE = 0;
        const INITIAL_POSITION_IN_LINE = 0;
        const NEW_LINE = 1;

        cursor['shape'].textAlignment = 'right';
        cursor['shape'].text = '123321\n32';
        cursor.position = INITIAL_POSITION_IN_LINE;
        cursor.moveToLine(NEW_LINE, ctx);

        expect(cursor.positionInLine).toEqual(EXPECTED_VALUE);
    });

    it('After moving down from beginning of first line in center aligned text to smaller line, position should be 0', () => {
        const EXPECTED_VALUE = 0;
        const INITIAL_POSITION_IN_LINE = 0;
        const NEW_LINE = 1;

        cursor['shape'].textAlignment = 'center';
        cursor['shape'].text = '123321\n32';
        cursor.position = INITIAL_POSITION_IN_LINE;
        cursor.moveToLine(NEW_LINE, ctx);

        expect(cursor.positionInLine).toEqual(EXPECTED_VALUE);
    });

    it('After moving down from end of first line in center aligned text to smaller line, position should be length of new line', () => {
        const EXPECTED_VALUE = 2;
        const INITIAL_POSITION_IN_LINE = 6;
        const NEW_LINE = 1;

        cursor['shape'].textAlignment = 'center';
        cursor['shape'].text = '123321\n32';
        cursor.position = INITIAL_POSITION_IN_LINE;
        cursor.moveToLine(NEW_LINE, ctx);

        expect(cursor.positionInLine).toEqual(EXPECTED_VALUE);
    });

    it('Moving up from first line of text should move cursor to beginning of text', () => {
        const EXPECTED_VALUE = 0;
        const INITIAL_POSITION_IN_LINE = 3;
        const NEW_LINE = -1;

        cursor['shape'].text = '123321\n123321';
        cursor.position = INITIAL_POSITION_IN_LINE;
        cursor.moveToLine(NEW_LINE, ctx);

        expect(cursor.position).toEqual(EXPECTED_VALUE);
    });

    it('Moving down from last line of text should move cursor to end of text', () => {
        const EXPECTED_VALUE = 13;
        const INITIAL_POSITION_IN_LINE = 3;
        const INITIAL_LINE = 1;
        const NEW_LINE = 2;

        cursor['shape'].text = '123321\n123321';
        cursor.position = INITIAL_POSITION_IN_LINE;
        cursor.moveToLine(INITIAL_LINE, ctx);
        cursor.moveToLine(NEW_LINE, ctx);

        expect(cursor.position).toEqual(EXPECTED_VALUE);
    });

    it('Cloning the cursor, should return an identical copy', () => {
        const clone = cursor.clone(shape);
        expect(clone.position).toEqual(cursor.position);
    });
});
