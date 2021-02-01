import { OnInit, Component,  HostListener } from '@angular/core';
import { ToolSelectorService } from '@app/services/tool-selector/tool-selector.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    selectedToolName: string;
    toolNames: string[];
    toolIcons: Map<string, string> = new Map<string, string>();

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        this.toolSelectorService.selectTool(event.key);
        this.toolSelectorService.getSelectedTool().onKeyDown(event);
    }

    selectTool(toolName: string): void {
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
        this.toolIcons.set('rectangle', 'rectangle-contoured');
    }

    ngOnInit(): void {
        this.toolSelectorService.name.subscribe((name) => (this.selectedToolName = name));
    }
}
