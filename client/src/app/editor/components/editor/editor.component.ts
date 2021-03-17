import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingCreatorService } from '@app/drawing/services/drawing-creator/drawing-creator.service';
import { ExportDrawingService } from '@app/drawing/services/export-drawing/export-drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})

export class EditorComponent implements AfterViewInit, OnInit {
    @ViewChild('configurationPanelDrawer') configurationPanelDrawer: MatDrawer;
    showColourPicker: boolean;

    constructor(
        private route: ActivatedRoute,
        public toolSelector: ToolSelectorService,
        private drawingCreatorService: DrawingCreatorService,
        private colourService: ColourService,
        private historyService: HistoryService,
        private exportDrawingService: ExportDrawingService,
    ) {
        this.colourService.showColourPickerChange.subscribe((flag: boolean) => {
            this.showColourPicker = flag;
        });

        this.toolSelector.onToolChanged(() => {
            this.configurationPanelDrawer.open();
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe((parameters) => {
            const imageId = parameters['imageId'];
            if(imageId) {
                console.log(`Loading image with id: ${imageId}`);
            }
        });
    }

    ngAfterViewInit(): void {
        this.toolSelector.selectTool(this.toolSelector.getSelectedTool().key);
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
