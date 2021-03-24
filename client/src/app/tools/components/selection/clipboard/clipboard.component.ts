import { Component, OnInit } from '@angular/core';
import { HistoryService } from '@app/history/service/history.service';
import { ClipboardService } from '@app/tools/services/selection/clipboard/clipboard.service';
import { SelectionCreatorService } from '@app/tools/services/selection/selection-base/selection-creator.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';

@Component({
  selector: 'app-clipboard',
  templateUrl: './clipboard.component.html',
  styleUrls: ['./clipboard.component.scss']
})
export class ClipboardComponent implements OnInit {

  constructor(public clipboardService: ClipboardService, public historyService: HistoryService, public toolSelector: ToolSelectorService) {
    //console.log(manipulator.isReversedX);
  }

  isSelectionBeingManipulated() {
    if ( this.toolSelector.getSelectedTool() instanceof SelectionCreatorService) {
      return (this.toolSelector.getSelectedTool() as SelectionCreatorService).isSelectionBeingManipulated();
    }
    return false;
  }
  
  isClipboardEmpty() {
    return this.clipboardService.isEmpty;
  }

  copy(): void {
    const selector: SelectionCreatorService = this.toolSelector.getSelectedTool() as SelectionCreatorService;
    selector.copy();
  }

  cut(): void {
    const selector: SelectionCreatorService = this.toolSelector.getSelectedTool() as SelectionCreatorService;
    selector.cut();
  }

  paste(): void {
    this.toolSelector.selectTool(this.clipboardService.copyOwner.key);
    this.clipboardService.paste();
    this.historyService.isLocked = true;
  }

  delete(): void {
    const selector: SelectionCreatorService = this.toolSelector.getSelectedTool() as SelectionCreatorService;
    selector.selectionManipulator.delete();
  }

  ngOnInit(): void {
  }

}
