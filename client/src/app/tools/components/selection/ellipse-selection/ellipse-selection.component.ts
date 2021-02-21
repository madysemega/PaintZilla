import { Component, OnInit } from '@angular/core';
import { ResizingMode, SelectionMoverService } from '@app/tools/services/tools/selection-mover.service';
import { SelectionService } from '@app/tools/services/tools/selection.service';


@Component({
  selector: 'app-ellipse-selection',
  templateUrl: './ellipse-selection.component.html',
  styleUrls: ['./ellipse-selection.component.scss']
})
export class EllipseSelectionComponent implements OnInit {
 
  public resizingMode : typeof ResizingMode = ResizingMode;

  constructor(public selectionMover: SelectionMoverService, public selectionService: SelectionService) { 
  }

  setResizingMode(resizingMode : ResizingMode){
    this.selectionMover.resizingMode = resizingMode;
  }

  ngOnInit(): void {
  }

}
