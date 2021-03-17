import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-image-navigation',
    templateUrl: './image-navigation.component.html',
    styleUrls: ['./image-navigation.component.scss'],
})
export class ImageNavigationComponent {
    labels: string[] = ['La Joconde de Samuel', 'Paysage', 'Comic'];

    constructor(public dialogRef: MatDialogRef<ImageNavigationComponent>) {}
}
