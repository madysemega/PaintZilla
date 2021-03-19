import { AfterViewInit, Component, HostListener, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingCreatorService } from '@app/drawing/services/drawing-creator/drawing-creator.service';
import { ExportDrawingService } from '@app/drawing/services/export-drawing/export-drawing.service';
import { SaveDrawingService } from '@app/drawing/services/save-drawing/save-drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements AfterViewInit {
    @ViewChild('configurationPanelDrawer') configurationPanelDrawer: MatDrawer;

    showColourPicker: boolean;

    constructor(
        public toolSelector: ToolSelectorService,
        private drawingCreatorService: DrawingCreatorService,
        private colourService: ColourService,
        private historyService: HistoryService,
        private exportDrawingService: ExportDrawingService,
        private saveDrawingService: SaveDrawingService,
    ) {
        this.colourService.showColourPickerChange.subscribe((flag: boolean) => {
            this.showColourPicker = flag;
        });

        this.toolSelector.onToolChanged(() => {
            this.configurationPanelDrawer.open();
        });
    }

    ngAfterViewInit(): void {
        this.toolSelector.selectTool(this.toolSelector.getSelectedTool().key);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (this.drawingCreatorService.noDialogsOpen() && this.exportDrawingService.noDialogsOpen() && this.saveDrawingService.noDialogsOpen()) {
            this.toolSelector.getSelectedTool().onKeyDown(event);
            const isCtrl: boolean = event.ctrlKey;
            const isA: boolean = event.key === 'a';

            if (isCtrl && isA) {
                this.toolSelector.selectTool('rectangle-selection');
            }
        }
        this.drawingCreatorService.onKeyDown(event);
        this.exportDrawingService.onKeyDown(event);
        this.saveDrawingService.onKeyDown(event);
    }

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        if (this.drawingCreatorService.noDialogsOpen() && this.exportDrawingService.noDialogsOpen() && this.saveDrawingService.noDialogsOpen()) {
            const isCtrl: boolean = event.ctrlKey;
            const isZ: boolean = event.key.toUpperCase() === 'Z';
            const isShift: boolean = event.shiftKey;

            if (isCtrl) {
                if (isZ && isShift) {
                    this.historyService.redo();
                } else if (isZ) {
                    this.historyService.undo();
                }
                return;
            }

            this.toolSelector.selectTool(this.toolSelector.fromKeyboardShortcut(event.key));
            this.toolSelector.getSelectedTool().onKeyUp(event);
        }
        this.drawingCreatorService.onKeyDown(event);
        this.exportDrawingService.onKeyDown(event);
        this.saveDrawingService.onKeyDown(event);
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (this.colourService.showColourPicker && !this.colourService.onColourPicker) {
            this.colourService.onColourPicker = false;
            this.showColourPicker = false;
        }
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

    get height(): number {
        return window.innerHeight;
    }
}
