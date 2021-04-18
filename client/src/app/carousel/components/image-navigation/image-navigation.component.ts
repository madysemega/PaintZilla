import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SNACK_BAR_DURATION } from '@app/common-constants';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { ServerService } from '@app/server-communication/service/server.service';
import { Drawing } from '@common/models/drawing';
@Component({
    selector: 'app-image-navigation',
    templateUrl: './image-navigation.component.html',
    styleUrls: ['./image-navigation.component.scss'],
})
export class ImageNavigationComponent {
    labels: string[];
    private retainedLabels: string[];
    drawings: Drawing[];

    isLoadingDrawings: boolean;

    private lastFilterLabels: string[];

    filterDrawings(labels: string[] = this.lastFilterLabels): void {
        this.isLoadingDrawings = true;

        this.lastFilterLabels = labels;

        if (this.lastFilterLabels.length > 0) {
            this.server.getDrawingsByLabelsOneMatch(labels).subscribe(
                (drawings) => {
                    this.drawings = drawings;
                    this.isLoadingDrawings = false;
                },
                (error: HttpErrorResponse) => this.handleRequestError(error),
            );
        } else {
            this.server.getAllDrawings().subscribe(
                (drawings) => {
                    this.drawings = drawings;
                    this.isLoadingDrawings = false;
                },
                (error: HttpErrorResponse) => this.handleRequestError(error),
            );
        }
    }

    handleDeleteImageEvent(imageId: string): void {
        this.server.deleteDrawing(imageId).subscribe(
            () => {
                this.filterDrawings();
                this.displayMessage('Dessin supprimé');
            },
            (error: HttpErrorResponse) => {
                this.displayMessage(`Erreur: le dessin n'a pas pu être supprimé, raison : ${error.message}`);
            },
        );
    }

    displayMessage(message: string): void {
        this.snackBar.open(message, 'Ok', {
            duration: SNACK_BAR_DURATION,
            horizontalPosition: 'left',
            verticalPosition: 'bottom',
        });
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

    private handleRequestError(error: HttpErrorResponse): void {
        this.displayMessage(`Nous n'avons pas pu accéder au serveur, erreur : ${error.message}`);
        this.dialogRef.close();
    }

    private handleKeyboardContext(): void {
        this.keyboardService.saveContext();
        this.keyboardService.context = 'carousel';
        this.dialogRef.afterClosed().subscribe(() => this.keyboardService.restoreContext());
    }

    constructor(
        public dialogRef: MatDialogRef<ImageNavigationComponent>,
        private server: ServerService,
        private keyboardService: KeyboardService,
        private snackBar: MatSnackBar,
    ) {
        this.labels = [];
        this.retainedLabels = [];
        this.lastFilterLabels = [];
        this.drawings = [];

        this.isLoadingDrawings = false;

        server.getAllLabels().subscribe((labels) => (this.labels = labels));
        this.filterDrawings();

        this.handleKeyboardContext();
    }
}
