import { Component, OnInit } from '@angular/core';
import { ResizingMode, SelectionManipulatorService } from '@app/tools/services/tools/selection-manipulator.service';
import { SelectionService } from '@app/tools/services/tools/selection.service';


@Component({
  selector: 'app-ellipse-selection',
  templateUrl: './ellipse-selection.component.html',
  styleUrls: ['./ellipse-selection.component.scss']
})
export class EllipseSelectionComponent implements OnInit {

  public resizingMode: typeof ResizingMode = ResizingMode;
  public showControlPoint: boolean
  //public isShiftDown: boolean;

  constructor(public selectionManipulator: SelectionManipulatorService, public selectionService: SelectionService) {
  }

 /* @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Shift') {
      this.isShiftDown = true;
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Shift') {
      this.isShiftDown = false;
    }
  }*/

  setResizingMode(resizingMode: ResizingMode): void {
    this.selectionManipulator.resizingMode = resizingMode;
  }

  ngOnInit(): void {
    this.selectionService.isSelectionBeingManipulated.subscribe(isActivated => (this.showControlPoint = isActivated));
  }

}
