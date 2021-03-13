import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import * as Constants from '@app/drawing/constants/drawing-constants';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ResizingService } from '@app/drawing/services/resizing-service/resizing.service';
import { HistoryService } from '@app/history/service/history.service';
import { ExportDrawingDialogComponent } from './export-drawing-dialog.component';

describe('ExportDrawingDialogComponent', () => {
    let component: ExportDrawingDialogComponent;
    let fixture: ComponentFixture<ExportDrawingDialogComponent>;

    let historyServiceStub: HistoryService;
    let drawingServiceSpy: DrawingService;
    let resizingServiceSpy: ResizingService;
    // tslint:disable:no-any
    let matDialogRefSpy: jasmine.SpyObj<any>;

    let canvasTestHelper: CanvasTestHelper;
    let ctx: CanvasRenderingContext2D;
    let previewCtx: CanvasRenderingContext2D;
    let canvasSizeStub: Vec2;

    beforeEach(async(() => {
        historyServiceStub = new HistoryService();
        drawingServiceSpy = new DrawingService(historyServiceStub);
        resizingServiceSpy = new ResizingService(drawingServiceSpy, historyServiceStub);
        matDialogRefSpy = jasmine.createSpyObj('MatDialogRef<ExportDrawingDialogComponent>', ['close']);

        TestBed.configureTestingModule({
            declarations: [ExportDrawingDialogComponent],
            imports: [MatDialogModule],
            providers: [
                { provide: MatDialogRef, useValue: matDialogRefSpy },
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: ResizingService, useValue: resizingServiceSpy },
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
});
