import { Component, OnInit } from '@angular/core';
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

  constructor(public selectionMover: SelectionMoverService, public selectionService: SelectionService) { 
  }

  setResizingMode(resizingMode : ResizingMode): void{
    this.selectionMover.resizingMode = resizingMode;
  }

  ngOnInit(): void {
    console.log(this.selectionService.isShiftDown);
    this.selectionService.isSelectionBeingMoved.subscribe(isActivated => ( this.showControlPoint = isActivated));
  }

}
