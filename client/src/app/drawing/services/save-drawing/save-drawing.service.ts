import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SaveDrawingDialogComponent } from '@app/file-options/dialog/save-drawing-dialog/save-drawing-dialog.component';

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
        if (this.noDialogsOpen()) {
            this.dialogRef = this.dialog.open(SaveDrawingDialogComponent, { disableClose: true, panelClass: 'custom-modalbox' });
        }
    }

    noDialogsOpen(): boolean {
        return this.dialog.openDialogs.length === 0;
    }
}
