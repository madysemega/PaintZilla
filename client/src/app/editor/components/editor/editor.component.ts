import { AfterViewInit, Component, HostListener, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingCreatorService } from '@app/drawing/services/drawing-creator/drawing-creator.service';
import { DrawingLoaderService } from '@app/drawing/services/drawing-loader/drawing-loader.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ExportDrawingService } from '@app/drawing/services/export-drawing/export-drawing.service';
import { SaveDrawingService } from '@app/drawing/services/save-drawing/save-drawing.service';
import { AutomaticSavingService } from '@app/file-options/automatic-saving/automatic-saving.service';
import { HistoryService } from '@app/history/service/history.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';
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
        private route: ActivatedRoute,
        public toolSelector: ToolSelectorService,
        private drawingCreatorService: DrawingCreatorService,
        private colourService: ColourService,
        private historyService: HistoryService,
        private exportDrawingService: ExportDrawingService,
        private keyboardService: KeyboardService,
        private saveDrawingService: SaveDrawingService,
        private drawingLoader: DrawingLoaderService,
        private drawingService: DrawingService,
        private automaticSavingService: AutomaticSavingService,
    ) {
        this.colourService.showColourPickerChange.subscribe((flag: boolean) => {
            this.showColourPicker = flag;
        });

        this.handleToolChange();
    }

    private handleToolChange(): void {
        this.toolSelector.onToolChanged(() => {
            this.configurationPanelDrawer.open();
        });
    }

    ngAfterViewInit(): void {
        this.keyboardService.context = 'editor';

        setTimeout(() => {
            this.toolSelector.selectTool(this.toolSelector.getSelectedTool().key);
            this.historyService.clear();
        });

        this.route.params.subscribe((parameters) => this.initializeImage(parameters.imageId));
    }

    private initializeImage(imageId: string | undefined): void {
        if (imageId) {
            this.drawingLoader.loadFromServer(imageId);
        } else {
            this.drawingService.initialImage = undefined;
        }
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        this.toolSelector.getSelectedTool().onKeyDown(event);

        this.drawingCreatorService.onKeyDown(event);
        this.exportDrawingService.onKeyDown(event);
        this.saveDrawingService.onKeyDown(event);
    }

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        this.toolSelector.getSelectedTool().onKeyUp(event);

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

    @HostListener('window:beforeunload', ['$event'])
    onBeforeUnload(event: Event): void {
        this.automaticSavingService.saveDrawingLocally();
    }

    @HostListener('window:load', ['$event'])
    onLoad(event: Event): void {
        this.automaticSavingService.loadMostRecentDrawing();
    }

    updateColour(): void {
        this.colourService.updateColour();
    }

    get height(): number {
        return window.innerHeight;
    }
}
