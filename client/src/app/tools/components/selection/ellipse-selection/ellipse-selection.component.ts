import { Component } from '@angular/core';
import { EllipseSelectionHelperService } from '@app/tools/services/selection/ellipse/ellipse-selection-helper.service';
import { EllipseSelectionManipulatorService } from '@app/tools/services/selection/ellipse/ellipse-selection-manipulator.service';
import { SelectionComponent } from '../selection/selection.component';

@Component({
    selector: 'app-ellipse-selection',
    templateUrl: './ellipse-selection.component.html',
    styleUrls: ['./ellipse-selection.component.scss'],
})
export class EllipseSelectionComponent extends SelectionComponent {

    constructor(public selectionManipulator: EllipseSelectionManipulatorService, public selectionService: EllipseSelectionHelperService) {
        super(selectionManipulator, selectionService);
    }
}
