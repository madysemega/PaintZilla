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
        this.editor = new TextEditor({ drawingService: this.drawingService, colourService: this.colourService });
    }

    onToolSelect(): void {
        this.reset();
        this.drawingService.setCursorType(CursorType.TEXT);
    }

    onToolDeselect(): void {
        this.finalize();
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
    }

    updateFontName(name: string): void {
        this.editor.fontName = name;
    }

    getFontName(): string {
        return this.editor.fontName;
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
        let isAllowed = false;
        this.ALLOWED_CHAR_CLASSES.forEach((allowedClass) => {
            if (char.startsWith(allowedClass)) {
                isAllowed = true;
            }
        });
        return isAllowed;
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
