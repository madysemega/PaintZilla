import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-discard-changes-dialog',
    templateUrl: './discard-changes-dialog.component.html',
    styleUrls: ['./discard-changes-dialog.component.scss'],
})
export class DiscardChangesDialogComponent {
    constructor(public matDialogRef: MatDialogRef<DiscardChangesDialogComponent>) {}
}
