import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SaveDrawingService } from '@app/drawing/services/save-drawing/save-drawing.service';

@Component({
    selector: 'app-discard-changes-dialog',
    templateUrl: './discard-changes-dialog.component.html',
    styleUrls: ['./discard-changes-dialog.component.scss'],
})
export class DiscardChangesDialogComponent {
    constructor(public matDialogRef: MatDialogRef<DiscardChangesDialogComponent>, private saveDrawingService: SaveDrawingService) {}

    openSaveDialog(): void {
        this.matDialogRef.close();
        setTimeout(() => {
            this.saveDrawingService.openSaveDrawingDialog();
        }, 100);
    }
}
