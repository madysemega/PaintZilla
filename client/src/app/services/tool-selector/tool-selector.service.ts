import { Injectable } from '@angular/core';
import { NamedTool } from '@app/classes/named-tool';
import { Tool } from '@app/classes/tool';
import { EllipseService } from '@app/services/tools/ellipse-service.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectorService {
    private tools: Map<string, NamedTool> = new Map<string, NamedTool>();
    selectedTool: NamedTool;
    name: BehaviorSubject<string> = new BehaviorSubject<string>('pencil');

    getSelectedTool(): Tool {
        return this.selectedTool.tool;
    }

    selectTool(name: string): boolean {
        switch (name) {
            case '1':
                return this.select('rectangle');
            case '2':
                return this.select('ellipse');
            case 'c':
                return this.select('pencil');
            default:
                return this.select(name);
        }
    }

    private select(name: string): boolean {
        if (this.tools.has(name)) {
            this.selectedTool = this.tools.get(name) as NamedTool;
            this.name.next(name.toString());
            return true;
        }
        return false;
    }

    getRegisteredTools(): Map<string, NamedTool> {
        return this.tools;
    }

    getDisplayName(toolName: string): string | undefined {
        return this.tools.get(toolName)?.name;
    }

    constructor(pencilService: PencilService, ellipseService: EllipseService, rectangleService: RectangleService) {
        this.tools.set('pencil', { name: 'Crayon', tool: pencilService });
        this.tools.set('rectangle', { name: 'Rectangle', tool: rectangleService });
        this.tools.set('ellipse', { name: 'Ellipse', tool: ellipseService });
        this.selectedTool =this.tools.get("pencil") as NamedTool;
    }
}
