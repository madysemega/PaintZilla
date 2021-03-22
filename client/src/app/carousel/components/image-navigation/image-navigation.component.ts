import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { ServerService } from '@app/server-communication/service/server.service';
import { Drawing } from '@common/models/drawing';

@Component({
    selector: 'app-image-navigation',
    templateUrl: './image-navigation.component.html',
    styleUrls: ['./image-navigation.component.scss'],
})
export class ImageNavigationComponent {
    private readonly SNACK_BAR_DELAI: number = 6000;

    labels: string[];
    drawings: Drawing[];

    private lastFilterLabels: string[];

    filterDrawings(labels: string[]): void {
        this.lastFilterLabels = labels;

        if (this.lastFilterLabels.length > 0) {
            this.server.getDrawingsByLabelsAllMatch(labels).subscribe((drawings) => (this.drawings = drawings));
        } else {
            this.server.getAllDrawings().subscribe((drawings) => (this.drawings = drawings));
        }
    }

    handleDeleteImageEvent(imageId: string): void {
        this.server.deleteDrawing(imageId).subscribe(
            () => {
                this.filterDrawings(this.lastFilterLabels);
                this.displayMessage('Dessin supprimé');
            },
            (error: HttpErrorResponse) => {
                this.displayMessage(`Erreur: le dessin n'a pas pu être supprimé, raison : ${error.message}`);
            },
        );
    }

    displayMessage(message: string): void {
        this.snackBar.open(message, 'Ok', {
            duration: this.SNACK_BAR_DELAI,
            horizontalPosition: 'left',
            verticalPosition: 'bottom',
        });
    }

    constructor(
        public dialogRef: MatDialogRef<ImageNavigationComponent>,
        private server: ServerService,
        keyboardService: KeyboardService,
        private snackBar: MatSnackBar,
    ) {
        this.labels = [];
        this.lastFilterLabels = [];
        this.drawings = [];

        server.getAllLabels().subscribe((labels) => (this.labels = labels));
        server.getAllDrawings().subscribe((drawings) => (this.drawings = drawings));

        keyboardService.saveContext();
        keyboardService.context = 'carousel';
        this.dialogRef.afterClosed().subscribe(() => keyboardService.restoreContext());
    }
}
