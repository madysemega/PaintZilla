import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
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

    constructor(pencilService: PencilService) {
        this.tools.set('pencil', pencilService);
    }
}
