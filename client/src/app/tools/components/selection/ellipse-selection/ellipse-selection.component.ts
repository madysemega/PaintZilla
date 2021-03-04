import { Component } from '@angular/core';
import { SelectionComponent } from '@app/tools/components/selection/selection/selection.component';
import { EllipseSelectionHelperService } from '@app/tools/services/selection/ellipse/ellipse-selection-helper.service';
import { EllipseSelectionManipulatorService } from '@app/tools/services/selection/ellipse/ellipse-selection-manipulator.service';

@Component({
    selector: 'app-ellipse-selection',
    templateUrl: '../selection/selection.component.html',
    styleUrls: ['../selection/selection.component.scss'],
})
export class EllipseSelectionComponent extends SelectionComponent {
    constructor(public selectionManipulator: EllipseSelectionManipulatorService, public selectionService: EllipseSelectionHelperService) {
        super(selectionManipulator, selectionService);
    }
}
