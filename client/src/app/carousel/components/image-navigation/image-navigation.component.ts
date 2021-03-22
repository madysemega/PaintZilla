import { HttpErrorResponse } from '@angular/common/http';
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
    private readonly SNACK_BAR_DELAI: number = 6000;

    labels: string[];
    retainedLabels: string[];
    drawings: Drawing[];

    private lastFilterLabels: string[];

    filterDrawings(labels: string[]): void {
        this.lastFilterLabels = labels;

        if (this.lastFilterLabels.length > 0) {
            this.server.getDrawingsByLabelsOneMatch(labels).subscribe((drawings) => (this.drawings = drawings));
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

    constructor(public dialogRef: MatDialogRef<ImageNavigationComponent>, private server: ServerService, private snackBar: MatSnackBar) {
        this.labels = [];
        this.retainedLabels = [];
        this.lastFilterLabels = [];
        this.drawings = [];

        server.getAllLabels().subscribe((labels) => (this.labels = labels));
        server.getAllDrawings().subscribe((drawings) => (this.drawings = drawings));
    }
    addFilter(label: string): void {
        this.retainedLabels.push(label);
        this.filterDrawings(this.retainedLabels);
    }
    removeFilter(index: number): void {
        this.retainedLabels.splice(index, 1);
        if (this.retainedLabels.length === 0) this.filterDrawings([]);
        else this.filterDrawings(this.retainedLabels);
    }
}
