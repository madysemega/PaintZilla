import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExportDrawingDialogComponent } from '@app/components/dialog/export-drawing-dialog/export-drawing-dialog/export-drawing-dialog.component';

@Injectable({
    providedIn: 'root',
})
export class ExportDrawingService {
    dialogRef: MatDialogRef<ExportDrawingDialogComponent>;

    constructor(public dialog: MatDialog) {}

    onKeyDown(event: KeyboardEvent): void {
        if (event.ctrlKey && event.key === 'e') {
            event.preventDefault();
            this.openExportDrawingDialog();
        }
    }

    openExportDrawingDialog(): void {
        if (this.dialog.openDialogs.length === 0) {
            this.dialogRef = this.dialog.open(ExportDrawingDialogComponent, { disableClose: true, panelClass: 'custom-modalbox' });
        }
    }

    noDialogsOpen(): boolean {
        return this.dialog.openDialogs.length === 0;
    }
}
