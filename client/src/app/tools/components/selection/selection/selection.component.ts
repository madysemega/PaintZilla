import { Component, OnInit } from '@angular/core';
import { ResizingMode } from '@app/tools/services/selection/selection-base/resizing-mode';
import { SelectionManipulatorService } from '@app/tools/services/selection/selection-base/selection-manipulator.service';
import { SelectionHelperService } from '@app/tools/services/selection/selection-base/selection-helper.service';

@Component({
    selector: 'app-selection',
    templateUrl: './selection.component.html',
    styleUrls: ['./selection.component.scss'],
})
export class SelectionComponent implements OnInit {
    resizingMode: typeof ResizingMode = ResizingMode;
    showControlPoint: boolean;

    constructor(public selectionManipulator: SelectionManipulatorService, public selectionService: SelectionHelperService) {}

    setResizingMode(resizingMode: ResizingMode): void {
        this.selectionManipulator.resizingMode = resizingMode;
    }

    ngOnInit(): void {
        this.selectionService.isSelectionBeingManipulated.subscribe((isActivated) => (this.showControlPoint = isActivated));
    }

    isXRev(): boolean {
        return this.selectionManipulator.isReversedX;
    }

    isYRev(): boolean {
        return this.selectionManipulator.isReversedY;
    }
}
