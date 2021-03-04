import { Component } from '@angular/core';
import { SelectionComponent } from '@app/tools/components/selection/selection/selection.component';
import { RectangleSelectionHelperService } from '@app/tools/services/selection/rectangle/rectangle-selection-helper.service';
import { RectangleSelectionManipulatorService } from '@app/tools/services/selection/rectangle/rectangle-selection-manipulator.service';

@Component({
    selector: 'app-rectangle-selection',
    templateUrl: '../selection/selection.component.html',
    styleUrls: ['../selection/selection.component.scss'],
})
export class RectangleSelectionComponent extends SelectionComponent {
    constructor(public selectionManipulator: RectangleSelectionManipulatorService, public selectionService: RectangleSelectionHelperService) {
        super(selectionManipulator, selectionService);
    }
}
