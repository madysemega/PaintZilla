import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { UserActionRenderShape } from '@app/history/user-actions/user-action-render-shape';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { IDeselectableTool } from '@app/tools/classes/deselectable-tool';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';
import { Tool } from '@app/tools/classes/tool';
import { TextEditor } from './text-editor';
import * as Constants from './text-tool.constants';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool implements ISelectableTool, IDeselectableTool {
    private editor: TextEditor;
    private isEditing: boolean;

    constructor(
        drawingService: DrawingService,
        private colourService: ColourService,
        private history: HistoryService,
        private keyboardService: KeyboardService,
    ) {
        super(drawingService);

        this.key = 'text';
        this.editor = new TextEditor({ drawingService: this.drawingService, colourService: this.colourService });

        this.initializeKeyboardShortcuts();
    }

    private initializeKeyboardShortcuts(): void {
        this.keyboardService.registerAction({
            trigger: 'left',
            invoke: () => this.editor.moveCursorLeft(),
            uniqueName: 'Move text cursor to the left',
            contexts: ['editing-text'],
        });

        this.keyboardService.registerAction({
            trigger: 'right',
            invoke: () => this.editor.moveCursorRight(),
            uniqueName: 'Move text cursor to the right',
            contexts: ['editing-text'],
        });

        this.keyboardService.registerAction({
            trigger: 'up',
            invoke: () => this.editor.moveCursorUp(),
            uniqueName: 'Move text cursor upward',
            contexts: ['editing-text'],
        });

        this.keyboardService.registerAction({
            trigger: 'down',
            invoke: () => this.editor.moveCursorDown(),
            uniqueName: 'Move text cursor downward',
            contexts: ['editing-text'],
        });

        this.keyboardService.registerAction({
            trigger: 'enter',
            invoke: () => this.editor.write('\n'),
            uniqueName: 'Add new line to text',
            contexts: ['editing-text'],
        });

        this.keyboardService.registerAction({
            trigger: 'backspace',
            invoke: () => this.editor.backspace(),
            uniqueName: 'Remove character to the left of the cursor in text',
            contexts: ['editing-text'],
        });

        this.keyboardService.registerAction({
            trigger: 'delete',
            invoke: () => this.editor.delete(),
            uniqueName: 'Remove character to the right of the cursor in text',
            contexts: ['editing-text'],
        });

        this.keyboardService.registerAction({
            trigger: 'escape',
            invoke: () => this.cancel(),
            uniqueName: 'Cancel the editing tool',
            contexts: ['editing-text'],
        });
    }

    onToolSelect(): void {
        this.reset();
        this.drawingService.setCursorType(CursorType.TEXT);
    }

    onToolDeselect(): void {
        this.finalize();
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
    }

    updateAlignment(value: CanvasTextAlign): void {
        this.editor.setAlignment(value);
    }

    getAlignment(): CanvasTextAlign {
        return this.editor.getAlignment();
    }

    updateFontIsItalic(value: boolean): void {
        this.editor.setFontIsItalic(value);
    }

    getFontIsItalic(): boolean {
        return this.editor.getFontIsItalic();
    }

    updateFontIsBold(value: boolean): void {
        this.editor.setFontIsBold(value);
    }

    getFontIsBold(): boolean {
        return this.editor.getFontIsBold();
    }

    updateFontName(name: string): void {
        this.editor.setFontName(name);
    }

    getFontName(): string {
        return this.editor.getFontName();
    }

    updateFontSize(size: number): void {
        this.editor.setFontSize(size);
    }

    getFontSize(): number {
        return this.editor.getFontSize();
    }

    private reset(): void {
        this.editor.reset();
        this.isEditing = false;
    }

    private isCharAllowed(char: string): boolean {
        let isInAllowedClass = false;
        Constants.ALLOWED_CHAR_CLASSES.forEach((allowedClass) => {
            if (char.startsWith(allowedClass)) {
                isInAllowedClass = true;
            }
        });
        return isInAllowedClass;
    }

    private finalize(): void {
        this.editor.disableCursor();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        if (!this.editor.isEmpty()) {
            this.history.do(new UserActionRenderShape([this.editor.getTextRenderer()], this.drawingService.baseCtx));
        }

        this.keyboardService.context = 'editor';
        this.history.isLocked = false;
    }

    private cancel(): void {
        this.editor.disableCursor();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.reset();

        this.keyboardService.context = 'editor';
        this.history.isLocked = false;
    }

    private startEditing(position: Vec2): void {
        this.editor.reset(position);
        this.editor.enableCursor();
        this.editor.render();

        this.keyboardService.context = 'editing-text';
        this.history.isLocked = true;
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.isEditing) {
            event.preventDefault();
            event.stopPropagation();

            const isCharAllowed = this.isCharAllowed(event.code);
            if (isCharAllowed) {
                this.editor.write(event.key);
            }
        }
    }

    onMouseClick(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            if (this.isEditing) {
                this.finalize();
            } else {
                this.startEditing(this.getPositionFromMouse(event));
            }

            this.isEditing = !this.isEditing;
        }
    }
}
