import { Colour } from '@app/colour-picker/classes/colours.class';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { TextEditor } from './text-editor';
import { DEFAULT_TEXT } from './text-tool.constants';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal
// tslint:disable:max-file-line-count
describe('TextEditor', () => {
    let editor: TextEditor;

    let drawingServiceStub: DrawingService;
    let colourService: ColourService;

    beforeEach(() => {
        drawingServiceStub = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        colourService = new ColourService({} as ColourPickerService);

        editor = new TextEditor({
            drawingService: drawingServiceStub,
            colourService,
        });
    });

    it('Reset should disable cursor', () => {
        const disableCursorSpy = spyOn(editor, 'disableCursor').and.stub();
        editor.reset();
        expect(disableCursorSpy).toHaveBeenCalled();
    });

    it('Reset should reset text', () => {
        editor.reset();
        expect(editor['shape'].text).toEqual(DEFAULT_TEXT);
    });

    it('Reset should reset position', () => {
        editor.reset();
        expect(editor['shape'].position).toEqual({ x: 0, y: 0 });
    });

    it('setFontSize() should set the font size in both the property and the shape', () => {
        const NEW_SIZE = 32;

        spyOn(editor, 'render').and.stub();
        editor.setFontSize(NEW_SIZE);

        expect(editor['fontProperty'].fontSize).toEqual(NEW_SIZE);
        expect(editor['shape'].fontSize).toEqual(NEW_SIZE);
    });

    it('setFontName() should set the font name in both the property and the shape', () => {
        const NEW_NAME = 'Times New Roman';
        spyOn(editor, 'render').and.stub();
        editor.setFontName(NEW_NAME);
        expect(editor['fontProperty'].fontName).toEqual(NEW_NAME);
        expect(editor['shape'].fontName).toEqual(NEW_NAME);
    });

    it('setFontIsBold() should set font isBold in the property', () => {
        const NEW_IS_BOLD = true;
        spyOn(editor, 'render').and.stub();
        editor.setFontIsBold(NEW_IS_BOLD);
        expect(editor['fontProperty'].isBold).toEqual(NEW_IS_BOLD);
    });

    it('setFontIsItalic() should set font isItalic in the property', () => {
        const NEW_IS_ITALIC = true;
        spyOn(editor, 'render').and.stub();
        editor.setFontIsItalic(NEW_IS_ITALIC);
        expect(editor['fontProperty'].isItalic).toEqual(NEW_IS_ITALIC);
    });

    it('setAlignment() should set font alignment in the property', () => {
        const NEW_ALIGNMENT = 'right';
        spyOn(editor, 'render').and.stub();
        editor.setAlignment(NEW_ALIGNMENT);
        expect(editor['textAlignmentProperty'].value).toEqual(NEW_ALIGNMENT);
    });

    it('Enabling the cursor should start an interval', () => {
        const setIntervalSpy = spyOn(window, 'setInterval').and.stub();
        editor.enableCursor();
        expect(setIntervalSpy).toHaveBeenCalled();
    });

    it('When cursor is enabled, it should blink', () => {
        // tslint:disable-next-line: ban-types
        spyOn(window, 'setInterval').and.callFake((callback: Function) => callback());
        const renderSpy = spyOn(editor, 'render').and.stub();

        const SHOW_CURSOR_INITIAL_VALUE = false;
        editor['showCursor'] = SHOW_CURSOR_INITIAL_VALUE;
        editor.enableCursor();
        expect(editor['showCursor']).toBeTrue();
        editor.enableCursor();
        expect(editor['showCursor']).toBeFalse();

        expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    it('Moving cursor right should show cursor', () => {
        spyOn(editor, 'render').and.stub();

        editor['showCursor'] = false;
        editor.moveCursorRight();
        expect(editor['showCursor']).toBeTrue();

        editor['showCursor'] = true;
        editor.moveCursorRight();
        expect(editor['showCursor']).toBeTrue();
    });

    it('Moving cursor right should move right if not at the end of text', () => {
        spyOn(editor, 'render').and.stub();

        editor.write('1234567890');
        const INITIAL_CURSOR_POSITION = 3;
        editor['cursorRenderer'].cursor.position = INITIAL_CURSOR_POSITION;

        editor.moveCursorRight();
        expect(editor['cursorRenderer'].cursor.position).toEqual(INITIAL_CURSOR_POSITION + 1);
    });

    it('Moving cursor right should not move right if at the end of text', () => {
        spyOn(editor, 'render').and.stub();

        editor.write('1234567890');
        const INITIAL_CURSOR_POSITION = 10;
        editor['cursorRenderer'].cursor.position = INITIAL_CURSOR_POSITION;

        editor.moveCursorRight();
        expect(editor['cursorRenderer'].cursor.position).toEqual(INITIAL_CURSOR_POSITION);
    });

    it('Moving cursor right should render', () => {
        const renderSpy = spyOn(editor, 'render').and.stub();
        editor.moveCursorRight();
        expect(renderSpy).toHaveBeenCalled();
    });

    it('Moving cursor left should show cursor', () => {
        spyOn(editor, 'render').and.stub();

        editor['showCursor'] = false;
        editor.moveCursorLeft();
        expect(editor['showCursor']).toBeTrue();

        editor['showCursor'] = true;
        editor.moveCursorLeft();
        expect(editor['showCursor']).toBeTrue();
    });

    it('Moving cursor left should move left if not at the beginning of text', () => {
        spyOn(editor, 'render').and.stub();

        editor.write('1234567890');
        const INITIAL_CURSOR_POSITION = 3;
        editor['cursorRenderer'].cursor.position = INITIAL_CURSOR_POSITION;

        editor.moveCursorLeft();
        expect(editor['cursorRenderer'].cursor.position).toEqual(INITIAL_CURSOR_POSITION - 1);
    });

    it('Moving cursor left should not move left if at the beginning of text', () => {
        spyOn(editor, 'render').and.stub();

        editor.write('1234567890');
        const INITIAL_CURSOR_POSITION = 0;
        editor['cursorRenderer'].cursor.position = INITIAL_CURSOR_POSITION;

        editor.moveCursorLeft();
        expect(editor['cursorRenderer'].cursor.position).toEqual(INITIAL_CURSOR_POSITION);
    });

    it('Moving cursor left should render', () => {
        const renderSpy = spyOn(editor, 'render').and.stub();
        editor.moveCursorLeft();
        expect(renderSpy).toHaveBeenCalled();
    });

    it('Moving cursor down should move cursor downward', () => {
        const EXPECTED_LINE = 1;

        spyOn(editor, 'render').and.stub();

        editor.write('123\n321');
        editor.moveCursorDown();

        expect(editor['cursor'].line).toEqual(EXPECTED_LINE);
    });

    it('Moving cursor up should move cursor upward', () => {
        const EXPECTED_LINE = 0;

        spyOn(editor, 'render').and.stub();

        editor.write('123\n321');
        editor.moveCursorDown();
        editor.moveCursorUp();

        expect(editor['cursor'].line).toEqual(EXPECTED_LINE);
    });

    it('Should be able to write text in the middle of the text', () => {
        spyOn(editor, 'render').and.stub();

        const INITIAL_TEXT = '1234567890';
        editor.write(INITIAL_TEXT);

        editor.moveCursorRight();
        editor.moveCursorRight();
        editor.moveCursorRight();

        const NEW_TEXT = '321';
        editor.write(NEW_TEXT);

        const EXPECTED_TEXT = '1234321567890';
        expect(editor['shape'].text).toEqual(EXPECTED_TEXT);
    });

    it('Should be able to write text in the beginning of the text', () => {
        spyOn(editor, 'render').and.stub();

        const INITIAL_TEXT = '1234567890';
        editor.write(INITIAL_TEXT);

        editor.moveCursorLeft();

        const NEW_TEXT = '321';
        editor.write(NEW_TEXT);

        const EXPECTED_TEXT = '3211234567890';
        expect(editor['shape'].text).toEqual(EXPECTED_TEXT);
    });

    it('Should be able to write text in the end of the text', () => {
        spyOn(editor, 'render').and.stub();

        const INITIAL_TEXT = '123';
        editor.write(INITIAL_TEXT);

        editor.moveCursorRight();
        editor.moveCursorRight();

        const NEW_TEXT = '321';
        editor.write(NEW_TEXT);

        const EXPECTED_TEXT = '123321';
        expect(editor['shape'].text).toEqual(EXPECTED_TEXT);
    });

    it('Backspace should remove the character left to the cursor in the text', () => {
        spyOn(editor, 'render').and.stub();

        const INITIAL_TEXT = '1234567890';
        editor.write(INITIAL_TEXT);

        editor.moveCursorRight();
        editor.backspace();

        const EXPECTED_TEXT = '134567890';
        expect(editor['shape'].text).toEqual(EXPECTED_TEXT);
    });

    it('Backspace should not remove any character if cursor in at beginning of text', () => {
        spyOn(editor, 'render').and.stub();

        const INITIAL_TEXT = '1234567890';
        editor.write(INITIAL_TEXT);

        editor.moveCursorLeft();
        editor.backspace();

        const EXPECTED_TEXT = '1234567890';
        expect(editor['shape'].text).toEqual(EXPECTED_TEXT);
    });

    it('Delete should remove the character right to the cursor in the text', () => {
        spyOn(editor, 'render').and.stub();

        const INITIAL_TEXT = '1234567890';
        editor.write(INITIAL_TEXT);

        editor.moveCursorRight();
        editor.delete();

        const EXPECTED_TEXT = '124567890';
        expect(editor['shape'].text).toEqual(EXPECTED_TEXT);
    });

    it('Delete should not remove any character if cursor in at end of text', () => {
        spyOn(editor, 'render').and.stub();

        const INITIAL_TEXT = '123';
        editor.write(INITIAL_TEXT);

        editor.moveCursorRight();
        editor.moveCursorRight();
        editor.delete();

        const EXPECTED_TEXT = '123';
        expect(editor['shape'].text).toEqual(EXPECTED_TEXT);
    });

    it('render should clear canvas', () => {
        spyOn(editor['renderer'], 'render').and.stub();
        spyOn(editor['cursorRenderer'], 'render').and.stub();

        editor.render();
        expect(drawingServiceStub.clearCanvas).toHaveBeenCalled();
    });

    it('render should render text', () => {
        const renderTextSpy = spyOn(editor['renderer'], 'render').and.stub();
        spyOn(editor['cursorRenderer'], 'render').and.stub();

        editor.render();
        expect(renderTextSpy).toHaveBeenCalled();
    });

    it('render should render cursor if cursor flag is up', () => {
        spyOn(editor['renderer'], 'render').and.stub();
        const renderCursorSpy = spyOn(editor['cursorRenderer'], 'render').and.stub();

        editor['showCursor'] = true;

        editor.render();
        expect(renderCursorSpy).toHaveBeenCalled();
    });

    it('render should not render cursor if cursor flag is down', () => {
        spyOn(editor['renderer'], 'render').and.stub();
        const renderCursorSpy = spyOn(editor['cursorRenderer'], 'render').and.stub();

        editor['showCursor'] = false;

        editor.render();
        expect(renderCursorSpy).not.toHaveBeenCalled();
    });

    it('getTextRenderer() should return an identical copy of the text renderer', () => {
        const clone = editor.getTextRenderer();
        expect(clone).toEqual(editor['renderer']);
    });

    it('If text is empty, isEmpty() should return true', () => {
        expect(editor.isEmpty()).toBeTrue();
    });

    it('If text is not empty, isEmpty() should return false', () => {
        spyOn(editor, 'render').and.stub();
        editor.write('Hi there !');
        expect(editor.isEmpty()).toBeFalse();
    });

    it('When primary colour changes, so should text colour', (done) => {
        const NEW_COLOUR = Colour.hexToRgb('222333444');

        colourService.primaryColourChanged.subscribe(() => {
            expect(editor['colourProperty'].colour).toEqual(NEW_COLOUR);
            done();
        });

        colourService.primaryColourChanged.emit(NEW_COLOUR);
    });
});
