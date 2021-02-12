import { Component, Input, OnInit } from '@angular/core';
import { ResizableTool } from '@app/app/classes/resizable-tool';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';

@Component({
    selector: 'app-resizable-tool-configuration',
    templateUrl: './resizable-tool-configuration.component.html',
    styleUrls: ['./resizable-tool-configuration.component.scss'],
})
export class ResizableToolConfigurationComponent implements OnInit {
    @Input() toolService: ResizableTool;
    lineWidth: number;
    info: string = 'Épaisseur du trait';
    position: string = 'right';

    constructor(public toolSelectorService: ToolSelectorService) {
        this.lineWidth = 1;
    }

    changeWidth(width: number): void {
        this.toolService.lineWidth = width;
        this.lineWidth = width;
    }

    ngOnInit(): void {
        this.lineWidth = this.toolService.lineWidth;
    }
}
