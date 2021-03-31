import { Injectable } from '@angular/core';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { UserActionRenderShape } from '@app/history/user-actions/user-action-render-shape';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { IDeselectableTool } from '@app/tools/classes/deselectable-tool';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';
import { Tool } from '@app/tools/classes/tool';
import { TextEditor } from './text-editor';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool implements ISelectableTool, IDeselectableTool {
    private ALLOWED_CHAR_CLASSES: string[] = ['Key', 'Digit', 'Comma', 'Period', 'Quote', 'Backquote', 'Slash', 'Backslash', 'Bracket', 'Space'];

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
    }

    onToolSelect(): void {
        this.reset();
        this.drawingService.setCursorType(CursorType.TEXT);
    }

    onToolDeselect(): void {
        this.keyboardService.context = 'editor';
        this.history.isLocked = false;
        this.drawingService.setCursorType(CursorType.NONE);
    }

    private reset(): void {
        this.editor = new TextEditor({ drawingService: this.drawingService, colourService: this.colourService });
        this.isEditing = false;
    }

    private isCharAllowed(char: string): boolean {
        let isAllowed = false;
        this.ALLOWED_CHAR_CLASSES.forEach((allowedClass) => {
            if (char.startsWith(allowedClass)) {
                isAllowed = true;
            }
        });
        return isAllowed;
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.isEditing) {
            event.preventDefault();
            event.stopPropagation();

            switch (event.key) {
                case 'ArrowRight':
                    this.editor.moveCursorRight();
                    break;

                case 'ArrowLeft':
                    this.editor.moveCursorLeft();
                    break;

                case 'Backspace':
                    this.editor.backspace();
                    break;

                case 'Delete':
                    this.editor.delete();
                    break;

                case 'Enter':
                    this.editor.write('\n');
                    break;

                default:
                    const isCharAllowed = this.isCharAllowed(event.code);
                    if (isCharAllowed) {
                        this.editor.write(event.key);
                    }
                    break;
            }
        }
    }

    onMouseClick(event: MouseEvent): void {
        if (this.isEditing) {
            this.editor.disableCursor();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            if (!this.editor.isEmpty()) {
                this.history.do(new UserActionRenderShape([this.editor.getTextRenderer()], this.drawingService.baseCtx));
            }

            this.editor.reset();
            this.keyboardService.context = 'editor';
            this.history.isLocked = false;
        } else {
            this.editor.reset(this.getPositionFromMouse(event));
            this.editor.render();

            this.keyboardService.context = 'editing-text';
            this.history.isLocked = true;
        }

        this.isEditing = !this.isEditing;
    }
}
