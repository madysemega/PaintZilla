import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ServerService } from '@app/server-communication/service/server.service';
import { Drawing } from '@common/models/drawing';

@Component({
    selector: 'app-image-navigation',
    templateUrl: './image-navigation.component.html',
    styleUrls: ['./image-navigation.component.scss'],
})
export class ImageNavigationComponent {
    labels: string[];
    drawings: Drawing[];

    filterDrawings(labels: string[]): void {
        this.server.getDrawingsByLabelsAllMatch(labels).subscribe((drawings) => (this.drawings = drawings));
    }

    constructor(public dialogRef: MatDialogRef<ImageNavigationComponent>, private server: ServerService) {
        this.labels = [];
        this.drawings = [];

        server.getAllLabels().subscribe((labels) => (this.labels = labels));
        server.getAllDrawings().subscribe((drawings) => (this.drawings = drawings));
    }
}
