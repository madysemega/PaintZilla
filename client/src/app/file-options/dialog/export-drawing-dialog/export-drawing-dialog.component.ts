import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ResizingService } from '@app/drawing/services/resizing-service/resizing.service';
import { ImgurService } from '@app/file-options/imgur-service/imgur.service';

@Component({
    selector: 'app-export-drawing-dialog',
    templateUrl: './export-drawing-dialog.component.html',
    styleUrls: ['./export-drawing-dialog.component.scss'],
})
export class ExportDrawingDialogComponent implements AfterViewInit {
    SNACK_BAR_DURATION: number = 6000;
    @ViewChild('downloadLink') downloadLink: ElementRef<HTMLLinkElement>;
    @ViewChild('imageCanvas') canvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewCanvas') previewCanvas: ElementRef<HTMLCanvasElement>;

    ctx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    imageName: string | undefined;
    imageFormat: string | undefined = 'png';
    filter: string = 'none';

    constructor(
        public matDialogRef: MatDialogRef<ExportDrawingDialogComponent>,
        public drawingService: DrawingService,
        public resizingService: ResizingService,
        public imgurService: ImgurService,
        private snackBar: MatSnackBar,
    ) {}

    ngAfterViewInit(): void {
        this.canvas.nativeElement.width = this.drawingService.canvasSize.x;
        this.canvas.nativeElement.height = this.drawingService.canvasSize.y;
        this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.ctx.drawImage(this.drawingService.canvas, 0, 0);

        this.previewCanvas.nativeElement.width = this.canvas.nativeElement.width / 2;
        this.previewCanvas.nativeElement.height = this.canvas.nativeElement.height / 2;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawImage();
    }

    updatePreviewImage(event: MatSelectChange): void {
        this.filter = event.value;
        this.ctx.filter = event.value;
        this.ctx.drawImage(this.drawingService.canvas, 0, 0);

        this.previewCtx.filter = event.value;
        this.drawImage();
    }

    drawImage(): void {
        this.previewCtx.drawImage(
            this.drawingService.canvas,
            0,
            0,
            this.resizingService.canvasResize.x,
            this.resizingService.canvasResize.y,
            0,
            0,
            this.previewCanvas.nativeElement.width,
            this.previewCanvas.nativeElement.height,
        );
    }

    updateImageFormat(event: MatSelectChange): void {
        this.imageFormat = event.value;
    }

    changeName(event: KeyboardEvent): void {
        this.imageName = (event.target as HTMLInputElement).value;
        event.stopPropagation();
    }

    downloadImage(): void {
        if (!this.imageName) {
            return;
        }
        if (!this.imageFormat) {
            return;
        }
        this.downloadLink.nativeElement.setAttribute('href', this.canvas.nativeElement.toDataURL('image/' + this.imageFormat));
        this.downloadLink.nativeElement.setAttribute('download', this.imageName + '.' + this.imageFormat);
        this.matDialogRef.close();
    }

    uploadToImgur(): void {
        if (!this.imageName) {
            return;
        }
        if (!this.imageFormat) {
            return;
        }

        this.imgurService
            .uploadToImgur(this.canvas.nativeElement.toDataURL('image/' + this.imageFormat).split(';base64,')[1], this.imageFormat)
            .subscribe(
                (response) => {
                    this.imgurService.openImgurLinkDialog(response.data.link);
                },
                (error: HttpErrorResponse) => {
                    this.openSnackBar("Le dessin n'a pas bien été téléversé sur Imgur. Erreur: " + error.message);
                },
            );
        this.matDialogRef.close();
    }

    openSnackBar(message: string): void {
        this.snackBar.open(message, 'Ok', {
            duration: this.SNACK_BAR_DURATION,
            horizontalPosition: 'left',
            verticalPosition: 'bottom',
        });
        this.matDialogRef.close();
    }
}
