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
        console.log('called remove in nav');
        this.retainedLabels.splice(index, 1);
        console.log(this.retainedLabels);
        if (this.retainedLabels.length === 0) {  console.log('chulala'); this.filterDrawings(this.labels); console.log(this.drawings); }
        else
            this.filterDrawings(this.retainedLabels);
	}
}
