import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-imgur-link-dialog',
    templateUrl: './imgur-link-dialog.component.html',
    styleUrls: ['./imgur-link-dialog.component.scss'],
})
export class ImgurLinkDialogComponent {
    link: string;
    constructor(public matDialogRef: MatDialogRef<ImgurLinkDialogComponent>) {}

    // Taken from https://stackoverflow.com/questions/49102724/angular-5-copy-to-clipboard
    copyLink(): void {
        navigator.clipboard
            .writeText(this.link)
            .then()
            .catch((e) => console.error(e));
        this.matDialogRef.close();
    }
}
