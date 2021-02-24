import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingCreatorService } from '@app/drawing/services/drawing-creator/drawing-creator.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements AfterViewInit {
    @ViewChild('drawingContainer') drawingContainer: ElementRef<HTMLDivElement>;
    showColourPicker: boolean;
    constructor(
        public toolSelector: ToolSelectorService,
        private drawingCreatorService: DrawingCreatorService,
        private colourService: ColourService,
    ) {
        this.colourService.showColourPickerChange.subscribe((flag: boolean) => (this.showColourPicker = flag));
    }

    ngAfterViewInit(): void {
        this.toolSelector.selectTool(this.toolSelector.getSelectedTool().key);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        this.toolSelector.getSelectedTool().onKeyDown(event);
        this.drawingCreatorService.onKeyDown(event);
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

    updateColour(): void {
        this.colourService.updateColour();
    }
}
