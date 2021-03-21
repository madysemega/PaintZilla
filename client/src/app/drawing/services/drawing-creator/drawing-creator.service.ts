import { EventEmitter, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DiscardChangesDialogComponent } from '@app/components/dialog/discard-changes-dialog/discard-changes-dialog.component';
import { SaveDrawingDialogComponent } from '@app/components/dialog/save-drawing-dialog/save-drawing-dialog/save-drawing-dialog.component';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ResizingService } from '@app/drawing/services/resizing-service/resizing.service';
@Injectable({
    providedIn: 'root',
})
export class DrawingCreatorService {
    dialogRef: MatDialogRef<DiscardChangesDialogComponent>;
    drawingRestored: EventEmitter<void> = new EventEmitter<void>();
    constructor(public drawingService: DrawingService, public resizingService: ResizingService, public dialog: MatDialog) {}

    onKeyDown(event: KeyboardEvent): void {
        if (event.ctrlKey && event.key === 'o') {
            event.preventDefault();
            this.createNewDrawing();
        }
    }

    createNewDrawing(): void {
        if (!this.drawingService.isCanvasEmpty() && this.dialog.openDialogs.length === 0) {
            this.dialogRef = this.dialog.open(DiscardChangesDialogComponent, { disableClose: true, panelClass: 'custom-modalbox' });
            this.dialogRef.afterClosed().subscribe((result) => {
                if (result === 'discard') {
                    this.drawingRestored.emit();
                    this.drawingService.canvasIsEmpty = true;
                } else if (result === 'save') {
                    this.dialogRef = this.dialog.open(SaveDrawingDialogComponent, { disableClose: true, panelClass: 'custom-modalbox' });
                    this.dialogRef.afterClosed().subscribe(() => {
                        this.drawingRestored.emit();
                        this.drawingService.canvasIsEmpty = true;
                    });
                }
            });
        }
    }

    noDialogsOpen(): boolean {
        return this.dialog.openDialogs.length === 0;
    }
}
