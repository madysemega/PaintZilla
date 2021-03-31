import { Injectable } from '@angular/core';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { UserActionRenderShape } from '@app/history/user-actions/user-action-render-shape';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';
import { Tool } from '@app/tools/classes/tool';
import { TextEditor } from './text-editor';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool implements ISelectableTool {
    // private readonly ALLOWED_CHARACTERS_IN_TEXT: RegExp = /[!'^+%&/()=?_\-~`;#$½{[\]}\\|<>@,.a-zA-Z0-9éêèàâûüïîç]/gi;

    private editor: TextEditor;
    private isEditing: boolean;

    constructor(drawingService: DrawingService, private colourService: ColourService, private history: HistoryService) {
        super(drawingService);

        this.key = 'text';
    }

    onToolSelect(): void {
        this.reset();
    }

    private reset(): void {
        this.editor = new TextEditor({ drawingService: this.drawingService, colourService: this.colourService });
        this.isEditing = false;
    }

    onKeyUp(event: KeyboardEvent): void {
        event.preventDefault();
        event.stopPropagation();

        switch (event.key) {
            case 'ArrowRight':
                this.editor.moveCursorRight();
                break;

            case 'ArrowLeft':
                this.editor.moveCursorLeft();
                break;

            default:
                // if (this.ALLOWED_CHARACTERS_IN_TEXT.test(event.key)) {
                this.editor.write(event.key);
                // }
                break;
        }
    }

    onMouseClick(event: MouseEvent): void {
        if (this.isEditing) {
            this.editor.disableCursor();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            this.history.do(new UserActionRenderShape([this.editor.getTextRenderer()], this.drawingService.baseCtx));
        } else {
            this.editor.reset(this.getPositionFromMouse(event));
            this.editor.render();
        }

        this.isEditing = !this.isEditing;
    }
}
