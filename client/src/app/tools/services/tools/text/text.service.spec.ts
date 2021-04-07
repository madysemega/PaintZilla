import { TestBed } from '@angular/core/testing';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { HotkeyModule, HotkeyOptions, HotkeysService } from 'angular2-hotkeys';
import { TextService } from './text.service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal
describe('TextService', () => {
    let service: TextService;
    let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;

    beforeEach(() => {
        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);

        TestBed.configureTestingModule({
            imports: [HotkeyModule.forRoot()],
            providers: [{ provide: HotkeyOptions, useValue: hotkeysServiceStub }],
        });
        service = TestBed.inject(TextService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('When tool is selected, service should be reset', () => {
        const resetSpy = spyOn<any>(service, 'reset').and.stub();
        service.onToolSelect();
        expect(resetSpy).toHaveBeenCalled();
    });

    it('When tool is selected, cursor should be changed to TEXT', () => {
        const setCursorTypeSpy = spyOn(TestBed.inject(DrawingService), 'setCursorType').and.callThrough();
        service.onToolSelect();
        expect(setCursorTypeSpy).toHaveBeenCalledWith(CursorType.TEXT);
    });

    it('When tool is deselected, text should be finalized', () => {
        const finalizeSpy = spyOn<any>(service, 'finalize').and.stub();
        service.onToolDeselect();
        expect(finalizeSpy).toHaveBeenCalled();
    });

    it('When font size changes, the event should be propagated to editor', () => {
        const editorSetFontSizeSpy = spyOn(service['editor'], 'setFontSize').and.stub();

        const NEW_FONT_SIZE = 32;
        service.updateFontSize(NEW_FONT_SIZE);

        expect(editorSetFontSizeSpy).toHaveBeenCalled();
    });

    it('When font name changes, the event should be propagated to editor', () => {
        const editorSetFontNameSpy = spyOn(service['editor'], 'setFontName').and.stub();

        const NEW_FONT_NAME = 'Times New Roman';
        service.updateFontName(NEW_FONT_NAME);

        expect(editorSetFontNameSpy).toHaveBeenCalled();
    });

    it('When font isBold changes, the event should be propagated to editor', () => {
        const editorSetFontIsBoldSpy = spyOn(service['editor'], 'setFontIsBold').and.stub();

        const NEW_FONT_IS_BOLD = true;
        service.updateFontIsBold(NEW_FONT_IS_BOLD);

        expect(editorSetFontIsBoldSpy).toHaveBeenCalled();
    });

    it('When font isItalic changes, the event should be propagated to editor', () => {
        const editorSetFontIsItalicSpy = spyOn(service['editor'], 'setFontIsItalic').and.stub();

        const NEW_FONT_IS_ITALIC = true;
        service.updateFontIsItalic(NEW_FONT_IS_ITALIC);

        expect(editorSetFontIsItalicSpy).toHaveBeenCalled();
    });

    it('Resetting service should reset editor', () => {
        const editorResetSpy = spyOn(service['editor'], 'reset').and.stub();
        service['reset']();
        expect(editorResetSpy).toHaveBeenCalled();
    });

    it('Letters should be allowed in text', () => {
        const LETTERS = ['KeyA', 'KeyB', 'KeyG', 'KeyZ'];
        LETTERS.forEach((letter) => {
            expect(service['isCharAllowed'](letter)).toBeTrue();
        });
    });

    it('Finalizing the shape should disable the cursor', () => {
        const editorDisableCursorSpy = spyOn(service['editor'], 'disableCursor').and.stub();
        spyOn(TestBed.inject(DrawingService), 'clearCanvas').and.stub();
        service['finalize']();
        expect(editorDisableCursorSpy).toHaveBeenCalled();
    });

    it('Finalizing the shape should clear canvas', () => {
        spyOn(service['editor'], 'disableCursor').and.stub();
        const clearCanvasSpy = spyOn(TestBed.inject(DrawingService), 'clearCanvas').and.stub();
        service['finalize']();
        expect(clearCanvasSpy).toHaveBeenCalled();
    });

    it('If editor is not empty, a user action should be registered to the history service upon finalization', () => {
        spyOn(service['editor']['renderer'], 'render').and.stub();
        spyOn(service['editor']['cursorRenderer'], 'render').and.stub();
        spyOn(TestBed.inject(DrawingService), 'clearCanvas').and.stub();
        spyOn(service['editor'], 'getTextRenderer').and.stub();

        const historyDoSpy = spyOn(TestBed.inject(HistoryService), 'do').and.stub();

        service['editor'].write('1234');
        service['finalize']();

        expect(historyDoSpy).toHaveBeenCalled();
    });

    it('Finalizing the shape should set keyboard context to editor', () => {
        const keyboardService = TestBed.inject(KeyboardService);

        spyOn(service['editor']['renderer'], 'render').and.stub();
        spyOn(service['editor']['cursorRenderer'], 'render').and.stub();
        spyOn(TestBed.inject(DrawingService), 'clearCanvas').and.stub();
        spyOn(service['editor'], 'getTextRenderer').and.stub();
        spyOn(TestBed.inject(HistoryService), 'do').and.stub();

        service['finalize']();

        expect(keyboardService.context).toEqual('editor');
    });

    it('Finalizing the shape should unlock the history service', () => {
        const historyService = TestBed.inject(HistoryService);

        spyOn(service['editor']['renderer'], 'render').and.stub();
        spyOn(service['editor']['cursorRenderer'], 'render').and.stub();
        spyOn(TestBed.inject(DrawingService), 'clearCanvas').and.stub();
        spyOn(service['editor'], 'getTextRenderer').and.stub();
        spyOn(TestBed.inject(HistoryService), 'do').and.stub();

        historyService.isLocked = false;
        service['finalize']();
        expect(historyService.isLocked).toBeFalse();

        historyService.isLocked = true;
        service['finalize']();
        expect(historyService.isLocked).toBeFalse();
    });

    it('When starting edition, editor should be reset to given position', () => {
        const GIVEN_POSITION = { x: 32, y: 64 };
        const editorResetSpy = spyOn(service['editor'], 'reset').and.stub();
        spyOn(service['editor'], 'enableCursor').and.stub();
        spyOn(service['editor'], 'render').and.stub();

        service['startEditing'](GIVEN_POSITION);

        expect(editorResetSpy).toHaveBeenCalledWith(GIVEN_POSITION);
    });

    it('When starting edition, cursor should be enabled', () => {
        const GIVEN_POSITION = { x: 32, y: 64 };
        spyOn(service['editor'], 'reset').and.stub();
        const enableCursorSpy = spyOn(service['editor'], 'enableCursor').and.stub();
        spyOn(service['editor'], 'render').and.stub();

        service['startEditing'](GIVEN_POSITION);

        expect(enableCursorSpy).toHaveBeenCalled();
    });

    it('When starting edition, text/cursor should be rendered', () => {
        const GIVEN_POSITION = { x: 32, y: 64 };
        spyOn(service['editor'], 'reset').and.stub();
        spyOn(service['editor'], 'enableCursor').and.stub();
        const renderSpy = spyOn(service['editor'], 'render').and.stub();

        service['startEditing'](GIVEN_POSITION);

        expect(renderSpy).toHaveBeenCalled();
    });

    it('When starting edition, keyboard context should be set to "editing-text"', () => {
        const keyboardService = TestBed.inject(KeyboardService);

        const GIVEN_POSITION = { x: 32, y: 64 };
        spyOn(service['editor'], 'reset').and.stub();
        spyOn(service['editor'], 'enableCursor').and.stub();
        spyOn(service['editor'], 'render').and.stub();

        service['startEditing'](GIVEN_POSITION);

        expect(keyboardService.context).toEqual('editing-text');
    });

    it('When starting edition, history service should be locked', () => {
        const historyService = TestBed.inject(HistoryService);

        const GIVEN_POSITION = { x: 32, y: 64 };
        spyOn(service['editor'], 'reset').and.stub();
        spyOn(service['editor'], 'enableCursor').and.stub();
        spyOn(service['editor'], 'render').and.stub();

        historyService.isLocked = false;
        service['startEditing'](GIVEN_POSITION);
        expect(historyService.isLocked).toBeTrue();

        historyService.isLocked = true;
        service['startEditing'](GIVEN_POSITION);
        expect(historyService.isLocked).toBeTrue();
    });

    it('If editing, right arrow key should move cursor to the right', () => {
        const keyboardEvent = new KeyboardEvent('onKeyUp', { key: 'ArrowRight' });
        const moveCursorRightSpy = spyOn(service['editor'], 'moveCursorRight').and.stub();

        service['isEditing'] = true;
        service.onKeyUp(keyboardEvent);
        expect(moveCursorRightSpy).toHaveBeenCalled();
    });

    it('If editing, left arrow key should move cursor to the left', () => {
        const keyboardEvent = new KeyboardEvent('onKeyUp', { key: 'ArrowLeft' });
        const moveCursorLeftSpy = spyOn(service['editor'], 'moveCursorLeft').and.stub();

        service['isEditing'] = true;
        service.onKeyUp(keyboardEvent);
        expect(moveCursorLeftSpy).toHaveBeenCalled();
    });

    it('If editing, backspace key should remove character to the left of the cursor in the text', () => {
        const keyboardEvent = new KeyboardEvent('onKeyUp', { key: 'Backspace' });
        const backspaceSpy = spyOn(service['editor'], 'backspace').and.stub();

        service['isEditing'] = true;
        service.onKeyUp(keyboardEvent);
        expect(backspaceSpy).toHaveBeenCalled();
    });

    it('If editing, delete key should remove character to the right of the cursor in the text', () => {
        const keyboardEvent = new KeyboardEvent('onKeyUp', { key: 'Delete' });
        const deleteSpy = spyOn(service['editor'], 'delete').and.stub();

        service['isEditing'] = true;
        service.onKeyUp(keyboardEvent);
        expect(deleteSpy).toHaveBeenCalled();
    });

    it('If editing, enter key should write \\n to the text', () => {
        const keyboardEvent = new KeyboardEvent('onKeyUp', { key: 'Enter' });
        const writeSpy = spyOn(service['editor'], 'write').and.stub();

        service['isEditing'] = true;
        service.onKeyUp(keyboardEvent);
        expect(writeSpy).toHaveBeenCalledWith('\n');
    });

    it('If editing, when allowed character is input, it should be written to the text', () => {
        const keyboardEvent = new KeyboardEvent('onKeyUp', { key: 'a', code: 'KeyA' });
        const writeSpy = spyOn(service['editor'], 'write').and.stub();

        service['isEditing'] = true;
        service.onKeyUp(keyboardEvent);
        expect(writeSpy).toHaveBeenCalledWith('a');
    });

    it('If editing, when forbidden character is input, it should not be written to the text', () => {
        const keyboardEvent = new KeyboardEvent('onKeyUp', { key: 'a', code: 'Invalid' });
        const writeSpy = spyOn(service['editor'], 'write').and.stub();

        service['isEditing'] = true;
        service.onKeyUp(keyboardEvent);
        expect(writeSpy).not.toHaveBeenCalled();
    });

    it('If not editing, should not write text', () => {
        const keyboardEvent = new KeyboardEvent('onKeyUp', { key: 'a', code: 'Invalid' });
        const writeSpy = spyOn(service['editor'], 'write').and.stub();

        service['isEditing'] = false;
        service.onKeyUp(keyboardEvent);
        expect(writeSpy).not.toHaveBeenCalled();
    });

    it('When left clicking, isEditing should be toggled', () => {
        const mouseEvent = new MouseEvent('onMouseClick', { button: MouseButton.Left });

        spyOn<any>(service, 'finalize').and.stub();
        spyOn<any>(service, 'startEditing').and.stub();
        spyOn<any>(service, 'getPositionFromMouse').and.stub();

        service['isEditing'] = false;
        service.onMouseClick(mouseEvent);
        expect(service['isEditing']).toBeTrue();

        service['isEditing'] = true;
        service.onMouseClick(mouseEvent);
        expect(service['isEditing']).toBeFalse();
    });

    it('When left clicking, if editing, should finalize shape', () => {
        const mouseEvent = new MouseEvent('onMouseClick', { button: MouseButton.Left });

        const finalizeSpy = spyOn<any>(service, 'finalize').and.stub();
        spyOn<any>(service, 'startEditing').and.stub();
        spyOn<any>(service, 'getPositionFromMouse').and.stub();

        service['isEditing'] = true;
        service.onMouseClick(mouseEvent);
        expect(finalizeSpy).toHaveBeenCalled();
    });

    it('When left clicking, if not editing, should start editing shape', () => {
        const mouseEvent = new MouseEvent('onMouseClick', { button: MouseButton.Left });

        spyOn<any>(service, 'finalize').and.stub();
        const startEditingSpy = spyOn<any>(service, 'startEditing').and.stub();
        spyOn<any>(service, 'getPositionFromMouse').and.stub();

        service['isEditing'] = false;
        service.onMouseClick(mouseEvent);
        expect(startEditingSpy).toHaveBeenCalled();
    });

    it('When right clicking, should not toggle isEditing', () => {
        const mouseEvent = new MouseEvent('onMouseClick', { button: MouseButton.Right });

        spyOn<any>(service, 'finalize').and.stub();
        spyOn<any>(service, 'startEditing').and.stub();
        spyOn<any>(service, 'getPositionFromMouse').and.stub();

        service['isEditing'] = false;
        service.onMouseClick(mouseEvent);
        expect(service['isEditing']).toBeFalse();

        service['isEditing'] = true;
        service.onMouseClick(mouseEvent);
        expect(service['isEditing']).toBeTrue();
    });
});
