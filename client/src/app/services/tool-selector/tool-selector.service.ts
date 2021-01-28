import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { EllipseService } from '@app/services/tools/ellipse-service.service';
import { PencilService } from '@app/services/tools/pencil-service';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectorService {
    private tools: Map<string, Tool> = new Map<string, Tool>();
    private selectedTool: Tool;

    getSelectedTool(): Tool {
        return this.selectedTool;
    }

    selectTool(toolName: string): void {
        if (this.tools.has(toolName)) {
            this.selectedTool = this.tools.get(toolName) as Tool;
        }
    }

    getRegisteredTools(): Map<string, Tool> {
        return this.tools;
    }

    constructor(pencilService: PencilService, ellipseService: EllipseService) {
        this.tools.set('pencil', pencilService);
        this.tools.set('ellipse', ellipseService);
    }
}
