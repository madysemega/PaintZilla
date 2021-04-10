import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import * as Constants from '@app/drawing/constants/drawing-constants';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ResizingService } from '@app/drawing/services/resizing-service/resizing.service';
import { ImgurService } from '@app/file-options/imgur-service/imgur.service';
import { HistoryService } from '@app/history/service/history.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { Observable, of, Subject, throwError } from 'rxjs';
import { ExportDrawingDialogComponent } from './export-drawing-dialog.component';

describe('ExportDrawingDialogComponent', () => {
    let component: ExportDrawingDialogComponent;
    let fixture: ComponentFixture<ExportDrawingDialogComponent>;

    let historyServiceStub: HistoryService;
    let drawingServiceSpy: DrawingService;
    let resizingServiceSpy: ResizingService;
    let keyboardServiceStub: jasmine.SpyObj<KeyboardService>;
    // tslint:disable:no-any
    let matDialogRefSpy: jasmine.SpyObj<any>;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    let postSubject: Subject<any>;
    let snackBarSpy: jasmine.SpyObj<any>;
    let imgurServiceSpy: jasmine.SpyObj<any>;

    let canvasTestHelper: CanvasTestHelper;
    let ctx: CanvasRenderingContext2D;
    let previewCtx: CanvasRenderingContext2D;
    let canvasSizeStub: Vec2;

    beforeEach(async(() => {
        keyboardServiceStub = jasmine.createSpyObj('KeyboardService', ['registerAction', 'saveContext', 'restoreContext']);
        keyboardServiceStub.registerAction.and.stub();
        keyboardServiceStub.saveContext.and.stub();
        keyboardServiceStub.restoreContext.and.stub();
        historyServiceStub = new HistoryService(keyboardServiceStub);
        drawingServiceSpy = new DrawingService(historyServiceStub);
        resizingServiceSpy = new ResizingService(drawingServiceSpy, historyServiceStub);
        postSubject = new Subject<any>();
        matDialogRefSpy = jasmine.createSpyObj('MatDialogRef<ExportDrawingDialogComponent>', ['close']);
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
        snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
        httpClientSpy.post.and.returnValue(postSubject);
        imgurServiceSpy = jasmine.createSpyObj('ImgurService', ['uploadToImgur', 'openImgurLinkDialog']);
        imgurServiceSpy.openImgurLinkDialog.and.callFake(() => {
            return;
        });

        TestBed.configureTestingModule({
            declarations: [ExportDrawingDialogComponent],
            imports: [
                MatDialogModule,
                MatFormFieldModule,
                MatSelectModule,
                MatOptionModule,
                MatInputModule,
                BrowserAnimationsModule,
                CommonModule,
                MatTooltipModule,
            ],
            providers: [
                { provide: MatDialogRef, useValue: matDialogRefSpy },
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: ResizingService, useValue: resizingServiceSpy },
                { provide: HttpClient, useValue: httpClientSpy },
                { provide: MatSnackBar, useValue: snackBarSpy },
                { provide: ImgurService, useValue: imgurServiceSpy },
            ],
        }).compileComponents();

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvasSizeStub = { x: Constants.DEFAULT_WIDTH, y: Constants.DEFAULT_HEIGHT };
        drawingServiceSpy.canvasSize = canvasSizeStub;
        drawingServiceSpy.canvas = canvasTestHelper.canvas;
        drawingServiceSpy.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportDrawingDialogComponent);
        component = fixture.componentInstance;
        component.ctx = ctx;
        component.previewCtx = previewCtx;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('ngAfterViewInit should set the canvas size to the image size', () => {
    //     component.ngAfterViewInit();
    //     const hasCorrectWidth: boolean = component.canvas.nativeElement.width === drawingServiceSpy.canvasSize.x;
    //     const hasCorrectHeight: boolean = component.canvas.nativeElement.height === drawingServiceSpy.canvasSize.y;
    //     expect(hasCorrectHeight && hasCorrectWidth).toEqual(true);
    // });

    it('ngAfterViewInit should initialize the context', () => {
        component.ngAfterViewInit();
        const contextIsInitialized = component.ctx === (component.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D);
        expect(contextIsInitialized).toEqual(true);
    });

    it('ngAfterViewInit should draw the image to the canvas', () => {
        const drawImageSpy = spyOn(component.ctx, 'drawImage').and.stub();
        component.ngAfterViewInit();
        expect(drawImageSpy).toHaveBeenCalled();
    });

    // it('ngAfterViewInit should set the previewCanvas size to half the image size', () => {
    //     component.ngAfterViewInit();
    //     const hasCorrectWidth: boolean = component.previewCanvas.nativeElement.width === drawingServiceSpy.canvasSize.x / 2.0;
    //     const hasCorrectHeight: boolean = component.previewCanvas.nativeElement.height === drawingServiceSpy.canvasSize.y / 2.0;
    //     expect(hasCorrectHeight && hasCorrectWidth).toEqual(true);
    // });

    it('ngAfterViewInit should initialize the preview context', () => {
        component.ngAfterViewInit();
        const previewContextIsInitialized =
            component.previewCtx === (component.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D);
        expect(previewContextIsInitialized).toEqual(true);
    });

    it('ngAfterViewInit should draw the image to the preview canvas', () => {
        const drawImageSpy = spyOn(component.previewCtx, 'drawImage').and.stub();
        component.ngAfterViewInit();
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('updatePreviewImage should apply filter to canvas', () => {
        const matSelectEvent = {
            value: 'sepia(1)',
        } as MatSelectChange;
        component.updatePreviewImage(matSelectEvent);
        expect(component.ctx.filter === 'sepia(1)').toEqual(true);
    });

    it('updatePreviewImage should draw the image to the canvas', () => {
        const matSelectEvent = {
            value: 'sepia(1)',
        } as MatSelectChange;
        const drawImageSpy = spyOn(component.ctx, 'drawImage').and.stub();
        component.updatePreviewImage(matSelectEvent);
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('updatePreviewImage should apply filter to preview canvas', () => {
        const matSelectEvent = {
            value: 'sepia(1)',
        } as MatSelectChange;
        component.updatePreviewImage(matSelectEvent);
        expect(component.previewCtx.filter === 'sepia(1)').toEqual(true);
    });

    it('updatePreviewImage should draw the image to the preview canvas', () => {
        const matSelectEvent = {
            value: 'sepia(1)',
        } as MatSelectChange;
        const drawImageSpy = spyOn(component.previewCtx, 'drawImage').and.stub();
        component.updatePreviewImage(matSelectEvent);
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('updateImageFormat should change the image format', () => {
        const matSelectEvent = {
            value: 'png',
        } as MatSelectChange;
        component.updateImageFormat(matSelectEvent);
        expect(component.imageFormat === 'png').toEqual(true);
    });

    it('changeName should change the image name', () => {
        const event = ({
            target: { value: 'test' },
            stopPropagation(): void {
                return;
            },
        } as unknown) as KeyboardEvent;
        const stopPropagationSpy = spyOn(event, 'stopPropagation').and.stub();
        component.changeName(event);
        expect(component.imageName === 'test').toEqual(true);
        expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('downloadImage should do nothing if the image does not have a name', () => {
        component.imageFormat = 'png';
        component.imageName = undefined;
        component.downloadImage();
        expect(matDialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('downloadImage should do nothing if the image does not have a format', () => {
        component.imageFormat = undefined;
        component.imageName = '123';
        component.downloadImage();
        expect(matDialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('downloadImage should download the image if the image has a name and a format', () => {
        component.imageName = '123';
        component.imageFormat = 'png';
        component.downloadImage();
        expect(matDialogRefSpy.close).toHaveBeenCalled();
    });

    it('downloadImage should download the image if the image has a name and a format', () => {
        component.imageName = '123';
        component.imageFormat = 'png';
        const setAttributeSpy = spyOn(component.downloadLink.nativeElement, 'setAttribute').and.stub();
        component.downloadImage();
        expect(matDialogRefSpy.close).toHaveBeenCalled();
        expect(setAttributeSpy).toHaveBeenCalled();
    });

    it('uploadToImgur should do nothing if the image does not have a name', () => {
        component.imageFormat = 'png';
        component.imageName = undefined;
        component.uploadToImgur();
        expect(matDialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('uploadToImgur should do nothing if the image does not have a format', () => {
        component.imageFormat = undefined;
        component.imageName = '123';
        component.uploadToImgur();
        expect(matDialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('uploadToImgur should call ImgurService.uploadToImgur if the image has a name and a format', () => {
        component.imageName = '123';
        component.imageFormat = 'png';
        imgurServiceSpy.uploadToImgur.and.callFake(() => {
            return new Observable<any>();
        });
        component.uploadToImgur();
        expect(imgurServiceSpy.uploadToImgur).toHaveBeenCalled();
    });

    it('uploadToImgur should call ImgurService.openImgurLinkDialog if the image has a name and a format', () => {
        component.imageName = '123';
        component.imageFormat = 'png';
        imgurServiceSpy.uploadToImgur.and.returnValue(of({ data: { link: '' } }));
        component.uploadToImgur();
        expect(imgurServiceSpy.openImgurLinkDialog).toHaveBeenCalled();
    });

    it('uploadToImgur should call ImgurService.openImgurLinkDialog if the image has a name and a format', () => {
        component.imageName = '123';
        component.imageFormat = 'png';
        const openSnackBarSpy = spyOn(component, 'openSnackBar').and.stub();
        const error: HttpErrorResponse = new HttpErrorResponse({
            error: '',
        });
        component.imageName = 'tree';
        imgurServiceSpy.uploadToImgur.and.returnValue(throwError(error));
        component.uploadToImgur();
        expect(openSnackBarSpy).toHaveBeenCalled();
    });

    it('openSnackBar should call snackBar.open() and close the dialog', () => {
        component.openSnackBar('test');
        expect(snackBarSpy.open).toHaveBeenCalled();
        expect(matDialogRefSpy.close).toHaveBeenCalled();
    });
});
