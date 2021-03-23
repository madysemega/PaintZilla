import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-discard-changes-modal',
    templateUrl: './discard-changes-modal.component.html',
    styleUrls: ['./discard-changes-modal.component.scss'],
})
export class DiscardChangesModalComponent {
    // tslint:disable-next-line: no-any
    constructor(dialogRef: MatDialogRef<DiscardChangesModalComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {}

    confirm(): void {
        this.data.confirmCallback();
    }
}
