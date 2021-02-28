import { Component, OnInit } from '@angular/core';
import { EllipseSelectionHelperService } from '@app/tools/services/selection/ellipse-selection-helper.service';
import { EllipseSelectionManipulatorService } from '@app/tools/services/selection/ellipse-selection-manipulator.service';
import { ResizingMode, } from '@app/tools/services/selection/selection-manipulator.service';

@Component({
  selector: 'app-ellipse-selection',
  templateUrl: './ellipse-selection.component.html',
  styleUrls: ['./ellipse-selection.component.scss']
})
export class EllipseSelectionComponent implements OnInit {

  public resizingMode: typeof ResizingMode = ResizingMode;
  public showControlPoint: boolean

  constructor(public selectionManipulator: EllipseSelectionManipulatorService, public selectionService: EllipseSelectionHelperService) {
  }

  setResizingMode(resizingMode: ResizingMode): void {
    this.selectionManipulator.resizingMode = resizingMode;
  }

  ngOnInit(): void {
    this.selectionService.isSelectionBeingManipulated.subscribe(isActivated => (this.showControlPoint = isActivated));
  }

}
