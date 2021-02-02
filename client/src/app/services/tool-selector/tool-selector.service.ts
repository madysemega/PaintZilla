import { Injectable } from '@angular/core';
import { MetaWrappedTool } from '@app/classes/meta-wrapped-tool';
import { Tool } from '@app/classes/tool';
import { EllipseService } from '@app/services/tools/ellipse-service.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectorService {
    private tools: Map<string, MetaWrappedTool> = new Map<string, MetaWrappedTool>();
    selectedTool: MetaWrappedTool;
    name: BehaviorSubject<string> = new BehaviorSubject<string>('pencil');

    getSelectedTool(): Tool {
        return this.selectedTool.tool;
    }

    selectTool(name: string | undefined): boolean {
        if (name === undefined) return false;

        if (this.tools.has(name)) {
            this.selectedTool = this.tools.get(name) as MetaWrappedTool;
            this.name.next(name);
            return true;
        }
        return false;
    }

    getRegisteredTools(): Map<string, MetaWrappedTool> {
        return this.tools;
    }

    getDisplayName(toolName: string): string | undefined {
        return this.tools.get(toolName)?.name;
    }

    getIcon(toolName: string): string | undefined {
        return this.tools.get(toolName)?.icon;
    }

    fromKeyboardShortcut(key: string): string | undefined {
        for (const toolData of this.tools) {
            const toolName = toolData[0];
            const toolMetaInfo = toolData[1];

            if (toolMetaInfo === undefined) {
                continue;
            } else {
                const keyboardShortcut = toolMetaInfo.keyboardShortcut;
                if (keyboardShortcut === key.toLowerCase()) {
                    return toolName;
                }
            }
        }
        return undefined;
    }

    constructor(pencilService: PencilService, ellipseService: EllipseService, rectangleService: RectangleService) {
        this.tools.set('pencil', {
            name: 'Crayon',
            icon: 'pencil',
            keyboardShortcut: 'c',
            tool: pencilService,
        });
        this.tools.set('rectangle', {
            name: 'Rectangle',
            icon: 'rectangle-contoured',
            keyboardShortcut: '1',
            tool: rectangleService,
        });
        this.tools.set('ellipse', {
            name: 'Ellipse',
            icon: 'ellipse-contoured',
            keyboardShortcut: '2',
            tool: ellipseService,
        });

        this.selectedTool = this.tools.get('pencil') as MetaWrappedTool;
    }
}
