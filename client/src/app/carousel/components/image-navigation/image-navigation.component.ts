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
    retainedLabels: string[];
    drawings: Drawing[];

    filterDrawings(labels: string[]): void {
        this.server.getDrawingsByLabelsAllMatch(labels).subscribe((drawings) => (this.drawings = drawings));
    }

    constructor(public dialogRef: MatDialogRef<ImageNavigationComponent>, private server: ServerService) {
        this.labels = [];
        this.retainedLabels=[];
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
        if (this.retainedLabels.length === 0)   this.filterDrawings(this.labels);
        else
            this.filterDrawings(this.retainedLabels);
	}
}
