import { Injectable } from '@angular/core';
import { IDeselectableTool } from '@app/tools/classes/deselectable-tool';
import { MetaWrappedTool } from '@app/tools/classes/meta-wrapped-tool';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';
import { Tool } from '@app/tools/classes/tool';
import { EllipseService } from '@app/tools/services/tools/ellipse-service';
import { EraserService } from '@app/tools/services/tools/eraser-service';
import { LineService } from '@app/tools/services/tools/line.service';
import { PencilService } from '@app/tools/services/tools/pencil-service';
import { RectangleService } from '@app/tools/services/tools/rectangle.service';
import { BehaviorSubject } from 'rxjs';
import { EllipseSelectionCreatorService } from '../tools/ellipse-selection-creator.service';

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
            if ('onToolDeselect' in this.selectedTool.tool) {
                (this.selectedTool.tool as IDeselectableTool).onToolDeselect();
            }
            this.selectedTool = this.tools.get(name) as MetaWrappedTool;
            if ('onToolSelect' in this.selectedTool.tool) {
                (this.selectedTool.tool as ISelectableTool).onToolSelect();
            }
            this.name.next(name);
            return true;
        }
        return false;
    }

    getRegisteredTools(): Map<string, MetaWrappedTool> {
        return this.tools;
    }

    getKeyboardShortcut(toolName: string): string | undefined {
        return this.tools.get(toolName)?.keyboardShortcut;
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
    constructor(
        pencilService: PencilService,
        eraserService: EraserService,
        ellipseService: EllipseService,
        rectangleService: RectangleService,
        lineService: LineService,
        ellipseSelectionService: EllipseSelectionCreatorService,
    ) {
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
        this.tools.set('line', {
            displayName: 'Ligne',
            icon: 'pencil-with-line',
            keyboardShortcut: 'l',
            tool: lineService,
        });

        this.tools.set('test', {
            displayName: 'Sélection par rectangle',
            icon: 'rectangle-selection',
            keyboardShortcut: 'r',
            tool: rectangleService,
        });

        this.tools.set(ellipseSelectionService.key, {
            displayName: 'Sélection par ellipse',
            icon: 'ellipse-selection',
            keyboardShortcut: 's',
            tool: ellipseSelectionService,
        });

        this.selectedTool = this.tools.get(pencilService.key) as MetaWrappedTool;
    }
}
