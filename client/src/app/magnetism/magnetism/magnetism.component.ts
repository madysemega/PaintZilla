import { Component } from '@angular/core';
import { MetaWrappedTool } from '@app/tools/classes/meta-wrapped-tool';
import { SelectionManipulatorService } from '@app/tools/services/selection/selection-base/selection-manipulator.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';
import { RectangleSelectionCreatorService } from '@app/tools/services/tools/rectangle-selection-creator.service';

@Component({
  selector: 'app-magnetism',
  templateUrl: './magnetism.component.html',
  styleUrls: ['./magnetism.component.scss']
})
export class MagnetismComponent {
  public isActivated: boolean = false;
  constructor(public selectionManipulator: SelectionManipulatorService, public toolSelector: ToolSelectorService) { }

  toggleMagnetism() {
    this.isActivated = !this.isActivated;
    ((this.toolSelector.getRegisteredTools().get('rectangle-selection') as MetaWrappedTool).tool as RectangleSelectionCreatorService).selectionManipulator.isMagnetismActivated = this.isActivated;
    ((this.toolSelector.getRegisteredTools().get('ellipse-selection') as MetaWrappedTool).tool as RectangleSelectionCreatorService).selectionManipulator.isMagnetismActivated = this.isActivated;
  }

  setGridAnchor(gridAnchor: number): void {
    ((this.toolSelector.getRegisteredTools().get('rectangle-selection') as MetaWrappedTool).tool as RectangleSelectionCreatorService).selectionManipulator.gridMovementAnchor = gridAnchor;
    ((this.toolSelector.getRegisteredTools().get('ellipse-selection') as MetaWrappedTool).tool as RectangleSelectionCreatorService).selectionManipulator.gridMovementAnchor = gridAnchor;
  }
}
