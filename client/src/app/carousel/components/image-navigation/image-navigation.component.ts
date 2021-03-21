import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServerService } from '@app/server-communication/service/server.service';
import { Drawing } from '@common/models/drawing';

@Component({
    selector: 'app-image-navigation',
    templateUrl: './image-navigation.component.html',
    styleUrls: ['./image-navigation.component.scss'],
})
export class ImageNavigationComponent {
    private readonly SNACK_BAR_DELAI = 6000;

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
        this.server.deleteDrawing(imageId).subscribe({
            next: () => this.filterDrawings(this.lastFilterLabels),
            error: (error) => {
                this.snackBar.open("Erreur: le dessin n'a pas pu être supprimé", 'Ok', {
                    duration: this.SNACK_BAR_DELAI,
                    horizontalPosition: 'left',
                    verticalPosition: 'bottom',
                });
            },
            complete: () => {
                this.snackBar.open('Dessin supprimé', 'Ok', {
                    duration: this.SNACK_BAR_DELAI,
                    horizontalPosition: 'left',
                    verticalPosition: 'bottom',
                });
            },
        });
    }

    constructor(public dialogRef: MatDialogRef<ImageNavigationComponent>, private server: ServerService, private snackBar: MatSnackBar) {
        this.labels = [];
        this.lastFilterLabels = [];
        this.drawings = [];

        server.getAllLabels().subscribe((labels) => (this.labels = labels));
        server.getAllDrawings().subscribe((drawings) => (this.drawings = drawings));
    }
}
