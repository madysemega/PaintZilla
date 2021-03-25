import { Component } from '@angular/core';
import { HistoryService } from '@app/history/service/history.service';
import { ClipboardService } from '@app/tools/services/selection/clipboard/clipboard.service';
import { SelectionCreatorService } from '@app/tools/services/selection/selection-base/selection-creator.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';

@Component({
    selector: 'app-clipboard',
    templateUrl: './clipboard.component.html',
    styleUrls: ['./clipboard.component.scss'],
})
export class ClipboardComponent {
    constructor(public clipboardService: ClipboardService, public historyService: HistoryService, public toolSelector: ToolSelectorService) {
        // console.log(manipulator.isReversedX);
    }

    isSelectionBeingManipulated(): boolean {
        if (this.toolSelector.getSelectedTool() instanceof SelectionCreatorService) {
            return (this.toolSelector.getSelectedTool() as SelectionCreatorService).isSelectionBeingManipulated();
        }
        return false;
    }

    isClipboardEmpty(): boolean {
        return this.clipboardService.isEmpty;
    }

    copy(): void {
        const creator: SelectionCreatorService = this.toolSelector.getSelectedTool() as SelectionCreatorService;
        creator.copy();
    }

    cut(): void {
        const creator: SelectionCreatorService = this.toolSelector.getSelectedTool() as SelectionCreatorService;
        creator.cut();
    }

    paste(): void {
        this.toolSelector.selectTool(this.clipboardService.copyOwner.key);
        this.clipboardService.paste();
        this.historyService.isLocked = true;
    }

    delete(): void {
        const creator: SelectionCreatorService = this.toolSelector.getSelectedTool() as SelectionCreatorService;
        creator.selectionManipulator.delete();
    }
}
