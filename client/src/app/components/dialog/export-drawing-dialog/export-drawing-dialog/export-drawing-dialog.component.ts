import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ResizingService } from '@app/drawing/services/resizing-service/resizing.service';

@Component({
    selector: 'app-export-drawing-dialog',
    templateUrl: './export-drawing-dialog.component.html',
    styleUrls: ['./export-drawing-dialog.component.scss'],
})
export class ExportDrawingDialogComponent implements AfterViewInit {
    @ViewChild('downloadLink') downloadLink: ElementRef<HTMLLinkElement>;
    @ViewChild('nameInput') imageNameInput: ElementRef<HTMLInputElement>;
    @ViewChild('formatSelect') imageFormatSelect: ElementRef<HTMLSelectElement>;
    @ViewChild('imageCanvas') canvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewCanvas') previewCanvas: ElementRef<HTMLCanvasElement>;

    ctx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    imageName: string;
    imageFormat: string;

    constructor(
        public matDialogRef: MatDialogRef<ExportDrawingDialogComponent>,
        public drawingService: DrawingService,
        public resizingService: ResizingService,
    ) {}

    ngAfterViewInit(): void {
        this.canvas.nativeElement.width = this.drawingService.canvasSize.x;
        this.canvas.nativeElement.height = this.drawingService.canvasSize.y;
        console.log('export image size: ' + this.canvas.nativeElement.width + ' ' + this.canvas.nativeElement.height);
        this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.ctx.drawImage(this.drawingService.canvas, 0, 0);

        this.previewCanvas.nativeElement.width = this.canvas.nativeElement.width / 2;
        this.previewCanvas.nativeElement.height = this.canvas.nativeElement.height / 2;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        console.log('preview image size: ' + this.previewCanvas.nativeElement.width + ' ' + this.previewCanvas.nativeElement.height);
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
        console.log('resizing service resize: ' + this.resizingService.canvasResize.x + ' ' + this.resizingService.canvasResize.y);
    }

    updatePreviewImage(event: MatSelectChange): void {
        this.ctx.filter = event.value;
        this.ctx.drawImage(this.drawingService.canvas, 0, 0);

        this.previewCtx.filter = event.value;
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
        console.log('resizing service resize: ' + this.resizingService.canvasResize.x + ' ' + this.resizingService.canvasResize.y);
    }

    updateImageFormat(event: MatSelectChange): void {
        this.imageFormat = event.value;
    }

    changeName(event: any): void {
        this.imageName = event.target.value;
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
}
