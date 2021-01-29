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

    selectTool(toolName: string): void {
        this.selectedToolName = toolName;
        this.toolSelectorService.selectTool(toolName);
    }

    getDisplayName(toolName: string): string {
        const displayName = this.toolSelectorService.getDisplayName(toolName);
        return displayName === undefined ? '<Outil inconnu>' : displayName;
    }

    constructor(private toolSelectorService: ToolSelectorService) {
        this.toolNames = Array.from(this.toolSelectorService.getRegisteredTools().keys());
    }
}
