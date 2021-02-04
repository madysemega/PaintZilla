import { Component, HostListener, OnInit } from '@angular/core';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    selectedToolName: string;
    toolNames: string[];

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        this.toolSelectorService.getSelectedTool().onKeyDown(event);
    }

    @HostListener('keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        this.toolSelectorService.selectTool(this.toolSelectorService.fromKeyboardShortcut(event.key));
        this.toolSelectorService.getSelectedTool().onKeyUp(event);
    }

    selectTool(toolName: string): void {
        this.toolSelectorService.selectTool(toolName);
    }

    getDisplayName(toolName: string): string {
        const displayName = this.toolSelectorService.getDisplayName(toolName);
        return displayName === undefined ? '<Outil inconnu>' : displayName;
    }

    getIconName(toolName: string): string {
        const iconName = this.toolSelectorService.getIcon(toolName);
        return iconName === undefined ? 'unknown' : iconName;
    }

    constructor(private toolSelectorService: ToolSelectorService) {
        this.toolNames = Array.from(this.toolSelectorService.getRegisteredTools().keys());
    }

    ngOnInit(): void {
        this.toolSelectorService.name.subscribe((name) => (this.selectedToolName = name));
    }
}
