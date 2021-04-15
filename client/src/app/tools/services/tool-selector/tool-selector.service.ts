import { Injectable } from '@angular/core';
import { HistoryService } from '@app/history/service/history.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { IDeselectableTool } from '@app/tools/classes/deselectable-tool';
import { MetaWrappedTool } from '@app/tools/classes/meta-wrapped-tool';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';
import { Tool } from '@app/tools/classes/tool';
import { ClipboardService } from '@app/tools/services/selection/clipboard/clipboard.service';
import { SelectionCreatorService } from '@app/tools/services/selection/selection-base/selection-creator.service';
import { EllipseSelectionCreatorService } from '@app/tools/services/tools/ellipse-selection-creator.service';
import { EllipseService } from '@app/tools/services/tools/ellipse-service';
import { EraserService } from '@app/tools/services/tools/eraser-service';
import { LineService } from '@app/tools/services/tools/line.service';
import { PaintBucketService } from '@app/tools/services/tools/paint-bucket.service';
import { PencilService } from '@app/tools/services/tools/pencil-service';
import { PipetteService } from '@app/tools/services/tools/pipette-service';
import { PolygonService } from '@app/tools/services/tools/polygon.service';
import { RectangleSelectionCreatorService } from '@app/tools/services/tools/rectangle-selection-creator.service';
import { RectangleService } from '@app/tools/services/tools/rectangle.service';
import { SprayService } from '@app/tools/services/tools/spray-service';
import { StampService } from '@app/tools/services/tools/stamp.service';
import { TextService } from '@app/tools/services/tools/text/text.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectorService {
    private tools: Map<string, MetaWrappedTool> = new Map<string, MetaWrappedTool>();
    selectedTool: MetaWrappedTool;
    name: BehaviorSubject<string> = new BehaviorSubject<string>('pencil');

    private onToolChangedObservers: (() => void)[];

    onToolChanged(callback: () => void): void {
        this.onToolChangedObservers.push(callback);
    }

    getSelectedTool(): Tool {
        return this.selectedTool.tool;
    }

    getActiveSelectionTool(): SelectionCreatorService | undefined {
        if (this.getSelectedTool() instanceof SelectionCreatorService) {
            return this.getSelectedTool() as SelectionCreatorService;
        }
        return undefined;
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
            this.onToolChangedObservers.forEach((observer) => observer());

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

    private registerKeyboardShortcuts(): void {
        this.tools.forEach((toolMetaData) => {
            this.keyboardService.registerAction({
                trigger: toolMetaData.keyboardShortcut,
                invoke: () => this.selectTool(toolMetaData.tool.key),
                uniqueName: `Change tool to ${toolMetaData.tool.key}`,
                contexts: ['editor'],
            });
        });

        this.keyboardService.registerAction({
            trigger: 'ctrl+a',
            invoke: () => {
                this.selectTool('rectangle-selection');
                (this.selectedTool.tool as RectangleSelectionCreatorService).selectEntireCanvas();
            },
            uniqueName: 'Select all',
            contexts: ['editor'],
        });

        this.keyboardService.registerAction({
            trigger: 'ctrl+c',
            invoke: () => {
                const isCurrentToolSelection =
                    ['rectangle-selection', 'ellipse-selection'].find((key) => key === this.selectedTool.tool.key) != undefined;

                if (isCurrentToolSelection) {
                    const selectionService = this.selectedTool.tool as SelectionCreatorService;
                    selectionService.copy();
                }
            },
            uniqueName: 'Copy clipboard content',
            contexts: ['editor'],
        });

        this.keyboardService.registerAction({
            trigger: 'ctrl+x',
            invoke: () => {
                const isCurrentToolSelection =
                    ['rectangle-selection', 'ellipse-selection'].find((key) => key === this.selectedTool.tool.key) != undefined;

                if (isCurrentToolSelection) {
                    const selectionService = this.selectedTool.tool as SelectionCreatorService;
                    selectionService.cut();
                }
            },
            uniqueName: 'Cut clipboard content',
            contexts: ['editor'],
        });

        this.keyboardService.registerAction({
            trigger: 'del',
            invoke: () => {
                const isCurrentToolSelection =
                    ['rectangle-selection', 'ellipse-selection'].find((key) => key === this.selectedTool.tool.key) != undefined;

                if (isCurrentToolSelection) {
                    const selectionService = this.selectedTool.tool as SelectionCreatorService;
                    selectionService.delete();
                }
            },
            uniqueName: 'Delete clipboard content',
            contexts: ['editor'],
        });

        this.keyboardService.registerAction({
            trigger: 'ctrl+v',
            invoke: () => {
                if (!this.clipboardService.isEmpty) {
                    this.selectTool(this.clipboardService.copyOwner.key);
                    this.clipboardService.paste();
                    this.history.isLocked = true;
                }
            },
            uniqueName: 'Paste clipboard content',
            contexts: ['editor'],
        });
    }

    constructor(
        private keyboardService: KeyboardService,
        private clipboardService: ClipboardService,
        private history: HistoryService,
        pencilService: PencilService,
        pipetteService: PipetteService,
        sprayService: SprayService,
        eraserService: EraserService,
        ellipseService: EllipseService,
        rectangleService: RectangleService,
        lineService: LineService,
        polygonService: PolygonService,
        ellipseSelectionCreatorService: EllipseSelectionCreatorService,
        rectangleSelectionCreatorService: RectangleSelectionCreatorService,
        stampService: StampService,
        textService: TextService,
        paintBucketService: PaintBucketService,
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
        this.tools.set(pipetteService.key, {
            displayName: 'Pipette',
            icon: 'pipette',
            keyboardShortcut: 'i',
            tool: pipetteService,
        });
        this.tools.set(sprayService.key, {
            displayName: 'Aerosol',
            icon: 'spray',
            keyboardShortcut: 'a',
            tool: sprayService,
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
        this.tools.set(polygonService.key, {
            displayName: 'Polygon',
            icon: 'polygon-shape',
            keyboardShortcut: '3',
            tool: polygonService,
        });
        this.tools.set(stampService.key, {
            displayName: 'Étampe',
            icon: 'black-stamp',
            keyboardShortcut: 'd',
            tool: stampService,
        });
        this.tools.set(rectangleSelectionCreatorService.key, {
            displayName: 'Sélection par rectangle',
            icon: 'rectangle-selection',
            keyboardShortcut: 'r',
            tool: rectangleSelectionCreatorService,
        });

        this.tools.set(ellipseSelectionCreatorService.key, {
            displayName: 'Sélection par ellipse',
            icon: 'ellipse-selection',
            keyboardShortcut: 's',
            tool: ellipseSelectionCreatorService,
        });

        this.tools.set(textService.key, {
            displayName: 'Texte',
            icon: 'text-format',
            keyboardShortcut: 't',
            tool: textService,
        });

        this.tools.set(paintBucketService.key, {
            displayName: 'Sceau de peinture',
            icon: 'paint-bucket',
            keyboardShortcut: 'b',
            tool: paintBucketService,
        });

        this.selectedTool = this.tools.get(pencilService.key) as MetaWrappedTool;
        this.onToolChangedObservers = new Array<() => void>();

        this.registerKeyboardShortcuts();
    }
}
