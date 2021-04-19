import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageNavigationComponent } from '@app/carousel/components/image-navigation/image-navigation.component';
import { SNACK_BAR_DURATION } from '@app/common-constants';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ServerService } from '@app/server-communication/service/server.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingLoaderService {
    constructor(private drawingService: DrawingService, private server: ServerService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

    loadFromServer(imageId: string): void {
        this.server.getDrawingById(imageId).subscribe(
            (drawingData) => {
                this.drawingService.setImageFromBase64(drawingData.drawing);
            },
            (error: HttpErrorResponse) => {
                this.snackBar.open(`Ce dessin n'a pas pu être ouvert, erreur: ${error.message}`, 'Ok', {
                    duration: SNACK_BAR_DURATION,
                    horizontalPosition: 'left',
                    verticalPosition: 'bottom',
                });
                this.dialog.open(ImageNavigationComponent, { panelClass: 'custom-modalbox' });
            },
        );
    }
}
