import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SaveDrawingDialogComponent } from '@app/components/dialog/save-drawing-dialog/save-drawing-dialog/save-drawing-dialog.component';

@Injectable({
    providedIn: 'root',
})
export class SaveDrawingService {
    dialogRef: MatDialogRef<SaveDrawingDialogComponent>;

    constructor(public dialog: MatDialog) {}

    onKeyDown(event: KeyboardEvent): void {
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            this.openSaveDrawingDialog();
        }
    }

    openSaveDrawingDialog(): void {
        if (this.dialog.openDialogs.length === 0) {
            this.dialogRef = this.dialog.open(SaveDrawingDialogComponent, { disableClose: true });
        }
    }

    noDialogsOpen(): boolean {
        return this.dialog.openDialogs.length === 0;
    }
}
