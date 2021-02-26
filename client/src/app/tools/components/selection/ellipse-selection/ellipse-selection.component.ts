import { Component, HostListener, OnInit } from '@angular/core';
import { ResizingMode, SelectionMoverService } from '@app/tools/services/tools/selection-mover.service';
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

  constructor(public selectionMover: SelectionMoverService, public selectionService: SelectionService) {
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
    this.selectionMover.resizingMode = resizingMode;
  }

  ngOnInit(): void {
    this.selectionService.isSelectionBeingManipulated.subscribe(isActivated => (this.showControlPoint = isActivated));
  }

}
