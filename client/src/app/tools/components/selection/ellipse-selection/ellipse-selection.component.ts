import { Component, OnInit } from '@angular/core';
import { SelectionMoverService } from '@app/tools/services/tools/selection-mover.service';
import { SelectionService } from '@app/tools/services/tools/selection.service';

@Component({
  selector: 'app-ellipse-selection',
  templateUrl: './ellipse-selection.component.html',
  styleUrls: ['./ellipse-selection.component.scss']
})
export class EllipseSelectionComponent implements OnInit {
 
  constructor(public selectionMover: SelectionMoverService, public selectionService: SelectionService) { 
  }

  setResize(isResizingMode : boolean){
    this.selectionMover.isResizingMode = isResizingMode;
  }
  resize(event : MouseEvent):void{
    this.selectionMover.resize(event);
  }

  ngOnInit(): void {
  }

}
