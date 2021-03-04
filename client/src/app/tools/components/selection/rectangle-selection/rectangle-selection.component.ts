import { Component } from '@angular/core';
import { RectangleSelectionHelperService } from '@app/tools/services/selection/rectangle/rectangle-selection-helper.service';
import { RectangleSelectionManipulatorService } from '@app/tools/services/selection/rectangle/rectangle-selection-manipulator.service';
import { SelectionComponent } from '@app/tools/components/selection/selection/selection.component';

@Component({
    selector: 'app-rectangle-selection',
    templateUrl: './rectangle-selection.component.html',
    styleUrls: ['./rectangle-selection.component.scss'],
})
export class RectangleSelectionComponent extends SelectionComponent {

    constructor(public selectionManipulator: RectangleSelectionManipulatorService, public selectionService: RectangleSelectionHelperService) {
        super(selectionManipulator, selectionService);
    }
}
