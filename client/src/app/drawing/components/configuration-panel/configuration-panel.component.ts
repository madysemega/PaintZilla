import { Component, OnInit } from '@angular/core';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';

@Component({
    selector: 'app-configuration-panel',
    templateUrl: './configuration-panel.component.html',
    styleUrls: ['./configuration-panel.component.scss'],
})
export class ConfigurationPanelComponent implements OnInit {
    selectedToolName: string;

    constructor(private toolSelectorService: ToolSelectorService) {}

    ngOnInit(): void {
        this.toolSelectorService.name.subscribe((name) => (this.selectedToolName = name));
    }
}
