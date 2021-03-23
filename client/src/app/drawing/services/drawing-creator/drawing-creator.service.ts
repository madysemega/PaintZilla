import { EventEmitter, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { DiscardChangesDialogComponent } from '@app/file-options/dialog/discard-changes-dialog/discard-changes-dialog.component';
import { SaveDrawingDialogComponent } from '@app/file-options/dialog/save-drawing-dialog/save-drawing-dialog.component';
import { HistoryService } from '@app/history/service/history.service';
@Injectable({
    providedIn: 'root',
})
export class DrawingCreatorService {
    dialogRef: MatDialogRef<DiscardChangesDialogComponent>;
    drawingRestored: EventEmitter<void> = new EventEmitter<void>();
    constructor(private drawingService: DrawingService, public dialog: MatDialog, private historyService: HistoryService) {}

    onKeyDown(event: KeyboardEvent): void {
        if (event.ctrlKey && event.key === 'o') {
            event.preventDefault();
            this.createNewDrawing();
        }
    }

    createNewDrawing(): void {
        if (!this.drawingService.isCanvasEmpty() && this.noDialogsOpen()) {
            this.dialogRef = this.dialog.open(DiscardChangesDialogComponent, { disableClose: true, panelClass: 'custom-modalbox' });
            this.dialogRef.afterClosed().subscribe((result) => {
                if (result === 'discard') {
                    this.drawingRestored.emit();
                    this.drawingService.canvasIsEmpty = true;
                    this.historyService.clear();
                } else if (result === 'save') {
                    this.dialogRef = this.dialog.open(SaveDrawingDialogComponent, { disableClose: true, panelClass: 'custom-modalbox' });
                    this.dialogRef.afterClosed().subscribe(() => {
                        this.drawingRestored.emit();
                        this.drawingService.canvasIsEmpty = true;
                        this.historyService.clear();
                    });
                }
            });
        }
    }

    noDialogsOpen(): boolean {
        return this.dialog.openDialogs.length === 0;
    }
}
