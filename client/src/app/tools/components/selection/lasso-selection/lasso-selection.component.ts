import { Component } from '@angular/core';
import { LassoSelectionHelperService } from '@app/tools/services/selection/lasso/lasso-selection-helper.service';
import { LassoSelectionManipulatorService } from '@app/tools/services/selection/lasso/lasso-selection-manipulator.service';
import { SelectionComponent } from '../selection/selection.component';

@Component({
  selector: 'app-lasso-selection',
  templateUrl: '../selection/selection.component.html',
  styleUrls: ['../selection/selection.component.scss'],
})
export class LassoSelectionComponent extends SelectionComponent {
  constructor(public selectionManipulation: LassoSelectionManipulatorService, public selectionService: LassoSelectionHelperService) {
    super(selectionManipulation, selectionService);
  }
}
