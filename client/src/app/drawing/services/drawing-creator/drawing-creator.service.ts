import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DiscardChangesDialogComponent } from '@app/components/dialog/discard-changes-dialog/discard-changes-dialog.component';
import { DrawingService } from '@app/drawing/services/drawing/drawing.service';

@Injectable({
  providedIn: 'root'
})
export class DrawingCreatorService {
  drawingComponentHeight: number;
  drawingComponentWidth: number;

  constructor(private drawingService: DrawingService, public dialog: MatDialog) { }

  onKeyUp(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key == 'O') {
        this.createNewDrawing();
    }
  }
  
  createNewDrawing(): void {
    if (!this.drawingService.isCanvasEmpty()) {
        let dialogReference = this.dialog.open(DiscardChangesDialogComponent, { disableClose: true });

        dialogReference.afterClosed().subscribe(changesAreDiscarded => {
            if (changesAreDiscarded) {
                this.setDefaultCanvasSize();
            }
        });
    }
  }

  setDefaultCanvasSize(): void {
    this.drawingService.canvas.width = 0.5 * this.drawingComponentWidth;
    this.drawingService.canvas.height = 0.5 * this.drawingComponentHeight;
    this.drawingService.previewCanvas.width = 0.5 * this.drawingComponentWidth;
    this.drawingService.previewCanvas.height = 0.5 * this.drawingComponentHeight;
  }
}
