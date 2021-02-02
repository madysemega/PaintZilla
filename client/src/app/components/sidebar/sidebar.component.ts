import { Component } from '@angular/core';
import { ToolSelectorService } from '@app/services/tool-selector/tool-selector.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    selectedToolName: string = 'pencil';

    toolNames: string[];
    toolIcons: Map<string, string> = new Map<string, string>();

    selectTool(toolName: string): void {
        this.selectedToolName = toolName;
        this.toolSelectorService.selectTool(toolName);
    }

    getDisplayName(toolName: string): string {
        const displayName = this.toolSelectorService.getDisplayName(toolName);
        return displayName === undefined ? '<Outil inconnu>' : displayName;
    }

    getIconName(toolName: string): string {
        const iconName: string | undefined = this.toolIcons.get(toolName);
        return iconName === undefined ? 'unknown' : iconName;
    }

    constructor(private toolSelectorService: ToolSelectorService) {
        this.toolNames = Array.from(this.toolSelectorService.getRegisteredTools().keys());

        this.toolIcons.set('pencil', 'pencil');
        this.toolIcons.set('ellipse', 'ellipse-contoured');
        this.toolIcons.set('line', 'pencil-with-line');
    }
}
