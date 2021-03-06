import { Component, OnInit } from '@angular/core';
import { DrawingCreatorService } from '@app/drawing/services/drawing-creator/drawing-creator.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ExportDrawingService } from '@app/drawing/services/export-drawing/export-drawing.service';
import { SaveDrawingService } from '@app/drawing/services/save-drawing/save-drawing.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    selectedToolName: string;
    toolNames: string[];

    constructor(
        public toolSelectorService: ToolSelectorService,
        private drawingCreatorService: DrawingCreatorService,
        private exportDrawingService: ExportDrawingService,
        private saveDrawingService: SaveDrawingService,
        public drawingService: DrawingService,
    ) {
        this.toolNames = Array.from(this.toolSelectorService.getRegisteredTools().keys());
    }

    selectTool(toolName: string): void {
        this.toolSelectorService.selectTool(toolName);
    }

    getTooltipInfo(toolName: string): string {
        return this.getDisplayName(toolName).concat(' (' + this.getKeyboardShortcut(toolName) + ')');
    }

    getKeyboardShortcut(toolName: string): string {
        const displayName = this.toolSelectorService.getKeyboardShortcut(toolName);
        return displayName === undefined ? '<Outil inconnu>' : displayName;
    }

    getDisplayName(toolName: string): string {
        const displayName = this.toolSelectorService.getDisplayName(toolName);
        return displayName === undefined ? '<Outil inconnu>' : displayName;
    }

    getIconName(toolName: string): string {
        const iconName = this.toolSelectorService.getIcon(toolName);
        return iconName === undefined ? 'unknown' : iconName;
    }

    ngOnInit(): void {
        this.toolSelectorService.name.subscribe((name) => (this.selectedToolName = name));
    }

    createNewDrawing(): void {
        this.drawingCreatorService.createNewDrawing();
        this.deselect();
    }

    exportDrawing(): void {
        this.exportDrawingService.openExportDrawingDialog();
        this.deselect();
    }

    saveDrawing(): void {
        this.saveDrawingService.openSaveDrawingDialog();
        this.deselect();
    }

    deselect(): void {
        this.toolSelectorService.deselect();
    }
}
