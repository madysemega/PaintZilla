import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DiscardChangesDialogComponent } from '@app/components/dialog/discard-changes-dialog/discard-changes-dialog.component';
import { DrawingService } from '@app/drawing/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingCreatorService {
    dialogRef: MatDialogRef<DiscardChangesDialogComponent>;
    drawingComponentHeight: number;
    drawingComponentWidth: number;

    constructor(private drawingService: DrawingService, public dialog: MatDialog) {}

    onKeyUp(event: KeyboardEvent): void {
        if (event.ctrlKey && event.key == 'O') {
            this.createNewDrawing();
        }
    }

    createNewDrawing(): void {
        if (!this.drawingService.isCanvasEmpty()) {
            this.dialogRef = this.dialog.open(DiscardChangesDialogComponent, { disableClose: true });

            this.dialogRef.afterClosed().subscribe((changesAreDiscarded) => {
                if (changesAreDiscarded) {
                    this.setDefaultCanvasSize();
                }
            });
        }
    }

    setDefaultCanvasSize(): void {
        this.drawingService.setCanvasSize(this.drawingComponentWidth / 2.0, this.drawingComponentHeight / 2.0);
    }
}
