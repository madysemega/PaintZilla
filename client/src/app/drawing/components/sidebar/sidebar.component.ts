import { Component, OnInit } from '@angular/core';
import { DrawingCreatorService } from '@app/drawing/services/drawing-creator/drawing-creator.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
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

    constructor(
        private toolSelectorService: ToolSelectorService,
        private drawingCreatorService: DrawingCreatorService,
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
}
