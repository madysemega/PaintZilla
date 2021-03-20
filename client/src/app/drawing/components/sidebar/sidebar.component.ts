import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ExportDrawingDialogComponent } from '@app/components/dialog/export-drawing-dialog/export-drawing-dialog/export-drawing-dialog.component';
import { DrawingCreatorService } from '@app/drawing/services/drawing-creator/drawing-creator.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ExportDrawingService } from '@app/drawing/services/export-drawing/export-drawing.service';
import { SaveDrawingService } from '@app/drawing/services/save-drawing/save-drawing.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';
import { RectangleSelectionCreatorService } from '@app/tools/services/tools/rectangle-selection-creator.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    selectedToolName: string;
    toolNames: string[];
    dialogRef: MatDialogRef<ExportDrawingDialogComponent>;

    constructor(
        private toolSelectorService: ToolSelectorService,
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

    selectTheEntireCanvas(): void {
        this.toolSelectorService.selectTool('rectangle-selection');
        (this.toolSelectorService.getSelectedTool() as RectangleSelectionCreatorService).selectEntireCanvas();
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
    }

    exportDrawing(): void {
        this.exportDrawingService.openExportDrawingDialog();
    }

    saveDrawing(): void {
        this.saveDrawingService.openSaveDrawingDialog();
    }
}
