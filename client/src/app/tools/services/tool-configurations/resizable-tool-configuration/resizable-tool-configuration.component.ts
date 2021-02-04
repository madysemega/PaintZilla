import { Component, Input, OnInit } from '@angular/core';
import { ResizableTool } from '@app/classes/resizable-tool';
import { ToolSelectorService } from '@app/services/tool-selector/tool-selector.service';

@Component({
    selector: 'app-resizable-tool-configuration',
    templateUrl: './resizable-tool-configuration.component.html',
    styleUrls: ['./resizable-tool-configuration.component.scss'],
})
export class ResizableToolConfigurationComponent implements OnInit {
    @Input() toolService: ResizableTool;
    lineWidth: number;

    constructor(public toolSelectorService: ToolSelectorService) {}

    changeWidth(width: number): void {
        this.lineWidth = width;
        this.toolService.adjustLineWidth(width);
    }

    ngOnInit(): void {
        this.lineWidth = this.toolService.lineWidth;
    }
}
