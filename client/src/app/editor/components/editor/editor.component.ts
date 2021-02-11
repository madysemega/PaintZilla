import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DrawingCreatorService } from '@app/drawing/services/drawing-creator/drawing-creator.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements AfterViewInit {
    @ViewChild('drawingContainer') drawingContainer: ElementRef<HTMLDivElement>;

    ngAfterViewInit(): void {
        this.drawingCreatorService.drawingComponentHeight = this.drawingContainer.nativeElement.offsetHeight;
        this.drawingCreatorService.drawingComponentWidth = this.drawingContainer.nativeElement.offsetWidth;
        this.drawingCreatorService.setDefaultCanvasSize();
    }

    constructor(public toolSelector: ToolSelectorService, public drawingCreatorService: DrawingCreatorService) {}

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        this.toolSelector.getSelectedTool().onKeyDown(event);
    }

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        event.preventDefault();
        const toolName = this.toolSelector.fromKeyboardShortcut(event.key);
        this.toolSelector.selectTool(toolName);
        this.toolSelector.getSelectedTool().onKeyUp(event);
        this.drawingCreatorService.onKeyUp(event);
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.toolSelector.getSelectedTool().onMouseMove(event);
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.toolSelector.getSelectedTool().onMouseUp(event);
    }
}
