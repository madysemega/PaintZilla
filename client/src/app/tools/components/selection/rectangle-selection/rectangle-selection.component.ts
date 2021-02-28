import { Component, OnInit } from '@angular/core';
import { RectangleSelectionHelperService } from '@app/tools/services/selection/rectangle/rectangle-selection-helper.service';
import { RectangleSelectionManipulatorService } from '@app/tools/services/selection/rectangle/rectangle-selection-manipulator.service';
import { ResizingMode } from '@app/tools/services/selection/selection-base/selection-manipulator.service';

@Component({
  selector: 'app-rectangle-selection',
  templateUrl: './rectangle-selection.component.html',
  styleUrls: ['./rectangle-selection.component.scss']
})
export class RectangleSelectionComponent implements OnInit {

  public resizingMode: typeof ResizingMode = ResizingMode;
  public showControlPoint: boolean

  constructor(public selectionManipulator: RectangleSelectionManipulatorService, public selectionService: RectangleSelectionHelperService) {
  }

  setResizingMode(resizingMode: ResizingMode): void {
    this.selectionManipulator.resizingMode = resizingMode;
  }

  ngOnInit(): void {
    this.selectionService.isSelectionBeingManipulated.subscribe(isActivated => (this.showControlPoint = isActivated));
  }

}
