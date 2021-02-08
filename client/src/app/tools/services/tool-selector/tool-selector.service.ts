import { Injectable } from '@angular/core';
import { MetaWrappedTool } from '@app/tools/classes/meta-wrapped-tool';
import { Tool } from '@app/tools/classes/tool';
import { EllipseService } from '@app/tools/services/tools/ellipse-service.service';
import { EraserService } from '@app/tools/services/tools/eraser-service';
import { PencilService } from '@app/tools/services/tools/pencil-service';
import { RectangleService } from '@app/tools/services/tools/rectangle.service';
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
        return this.tools.get(toolName)?.displayName;
    }

    getIcon(toolName: string): string | undefined {
        return this.tools.get(toolName)?.icon;
    }

    fromKeyboardShortcut(key: string): string | undefined {
        for (const toolData of this.tools) {
            const toolName = toolData[0];
            const toolMetaInfo = toolData[1];

            const keyboardShortcut = toolMetaInfo.keyboardShortcut;
            if (keyboardShortcut === key.toLowerCase()) {
                return toolName;
            }
        }
        return undefined;
    }

    constructor(pencilService: PencilService, eraserService : EraserService, ellipseService: EllipseService, rectangleService: RectangleService) {
        this.tools.set(pencilService.key, {
            displayName: 'Crayon',
            icon: 'pencil',
            keyboardShortcut: 'c',
            tool: pencilService,
        });
        this.tools.set(eraserService.key, {
            displayName: 'Efface',
            icon: 'eraser',
            keyboardShortcut: 'e',
            tool: eraserService,
        });
        this.tools.set(rectangleService.key, {
            displayName: 'Rectangle',
            icon: 'rectangle-contoured',
            keyboardShortcut: '1',
            tool: rectangleService,
        });
        this.tools.set(ellipseService.key, {
            displayName: 'Ellipse',
            icon: 'ellipse-contoured',
            keyboardShortcut: '2',
            tool: ellipseService,
        });

        this.selectedTool = this.tools.get(pencilService.key) as MetaWrappedTool;
    }
}
