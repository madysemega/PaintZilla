import { AfterViewInit, Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageNavigationComponent } from '@app/carousel/components/image-navigation/image-navigation.component';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingCreatorService } from '@app/drawing/services/drawing-creator/drawing-creator.service';
import { ExportDrawingService } from '@app/drawing/services/export-drawing/export-drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements AfterViewInit {
    showColourPicker: boolean;
    constructor(
        public toolSelector: ToolSelectorService,
        private drawingCreatorService: DrawingCreatorService,
        private colourService: ColourService,
        private historyService: HistoryService,
        private exportDrawingService: ExportDrawingService,
        private keyboardService: KeyboardService,
        private dialog: MatDialog,
    ) {
        this.colourService.showColourPickerChange.subscribe((flag: boolean) => {
            this.showColourPicker = flag;
        });

        this.keyboardService.registerAction({
            trigger: 'ctrl+g',
            invoke: () => {
                this.dialog.open(ImageNavigationComponent);
            },
            context: 'editor',
        });
    }

    ngAfterViewInit(): void {
        this.toolSelector.selectTool(this.toolSelector.getSelectedTool().key);
        this.keyboardService.context = 'editor';
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (this.drawingCreatorService.noDialogsOpen() && this.exportDrawingService.noDialogsOpen()) {
            this.toolSelector.getSelectedTool().onKeyDown(event);
            const isCtrl: boolean = event.ctrlKey;
            const isA: boolean = event.key === 'a';

            if (isCtrl && isA) {
                this.toolSelector.selectTool('rectangle-selection');
            }
        } else {
            this.drawingCreatorService.onKeyDown(event);
            this.exportDrawingService.onKeyDown(event);
        }
    }

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        if (this.drawingCreatorService.noDialogsOpen() && this.exportDrawingService.noDialogsOpen()) {
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
