import { Component, Input } from '@angular/core';
import { ResizableTool } from '@app/app/classes/resizable-tool';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';

@Component({
    selector: 'app-resizable-tool-configuration',
    templateUrl: './resizable-tool-configuration.component.html',
    styleUrls: ['./resizable-tool-configuration.component.scss'],
})
export class ResizableToolConfigurationComponent {
    @Input() toolService: ResizableTool;
    info: string = 'Épaisseur du trait';
    position: string = 'right';

    get lineWidth(): number {
        return this.toolService.lineWidth;
    }

    changeWidth(width: number): void {
        this.toolService.adjustLineWidth(width);
    }

    constructor(protected toolSelectorService: ToolSelectorService) {}
}
