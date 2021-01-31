import { Injectable } from '@angular/core';
import { NamedTool } from '@app/classes/named-tool';
import { Tool } from '@app/classes/tool';
import { EllipseService } from '@app/services/tools/ellipse-service.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle.service'

@Injectable({
    providedIn: 'root',
})
export class ToolSelectorService {
    private tools: Map<string, NamedTool> = new Map<string, NamedTool>();
    private selectedTool: NamedTool;

    getSelectedTool(): Tool {
        return this.selectedTool.tool;
    }

    selectTool(toolName: string): void {
        if (this.tools.has(toolName)) {
            this.selectedTool = this.tools.get(toolName) as NamedTool;
        }
    }

    getRegisteredTools(): Map<string, NamedTool> {
        return this.tools;
    }

    getDisplayName(toolName: string): string | undefined {
        return this.tools.get(toolName)?.name;
    }

    constructor(pencilService: PencilService, ellipseService: EllipseService, rectangleService: RectangleService) {
        this.tools.set('pencil', { name: 'Crayon', tool: pencilService });
        this.tools.set('ellipse', { name: 'Ellipse', tool: ellipseService });
        this.tools.set('rectangle', { name: 'Rectangle', tool: rectangleService })
    }
}
