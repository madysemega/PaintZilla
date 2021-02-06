import { Component, HostListener } from '@angular/core';
import { Tool } from '@app/tools/classes/tool';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {

    constructor(public toolSelector: ToolSelectorService){}

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        this.toolSelector.getSelectedTool().onKeyDown(event);
    }

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        const toolName = this.toolSelector.fromKeyboardShortcut(event.key);
        this.toolSelector.selectTool(toolName);
        this.toolSelector.getSelectedTool().onKeyUp(event);
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.toolSelector.getSelectedTool().onMouseMove(event);
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.toolSelector.getSelectedTool().onMouseUp(event);
    }

    getCurrentTool(): Tool {
        return this.toolSelector.getSelectedTool();
    }
}
