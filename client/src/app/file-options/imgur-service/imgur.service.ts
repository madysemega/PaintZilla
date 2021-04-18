import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ImgurLinkDialogComponent } from '@app/file-options/dialog/imgur-link-dialog/imgur-link-dialog/imgur-link-dialog.component';
import { HEADER_OPTIONS } from '@app/file-options/imgur-service/imgur-service-constants';
import { ImgurRequest } from '@app/file-options/imgur-service/imgur-utils';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class ImgurService {
    private dialogRef: MatDialogRef<ImgurLinkDialogComponent>;
    constructor(private httpClient: HttpClient, public dialog: MatDialog) {}

    uploadToImgur(image: string, format: string): Observable<ImgurRequest> {
        return this.httpClient.post<ImgurRequest>(
            'https://api.imgur.com/3/image',
            {
                image,
                type: format,
            },
            HEADER_OPTIONS,
        );
    }

    openImgurLinkDialog(link: string): void {
        this.dialogRef = this.dialog.open(ImgurLinkDialogComponent, { panelClass: 'custom-modalbox' });
        this.dialogRef.componentInstance.link = link;
    }
}
