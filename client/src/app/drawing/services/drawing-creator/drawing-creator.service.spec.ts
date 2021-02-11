import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DrawingService } from '@app/drawing/services/drawing/drawing.service';
import { of } from 'rxjs';
import { DrawingCreatorService } from './drawing-creator.service';

// tslint:disable:no-any
describe('DrawingCreatorService', () => {
    let service: DrawingCreatorService;

    let setDefaultCanvasSizeSpy: jasmine.Spy<any>;
    let createNewDrawingSpy: jasmine.Spy<any>;
    let matDialogRefSpy: jasmine.SpyObj<any>;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let matDialogSpy: jasmine.SpyObj<MatDialog>;

    let keyboardEvent: KeyboardEvent;
    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['isCanvasEmpty', 'setCanvasSize']);

        matDialogRefSpy = jasmine.createSpyObj('MatDialogRef<DiscardChangesDialogComponent>', ['afterClosed']);

        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'openDialogs']);
        matDialogSpy.open.and.callFake(() => {
            return matDialogRefSpy;
        });

        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            providers: [
                { provide: MatDialog, useValue: matDialogSpy },
                { provide: DrawingService, useValue: drawingServiceSpy },
            ],
        });

        service = TestBed.inject(DrawingCreatorService);

        createNewDrawingSpy = spyOn<any>(service, 'createNewDrawing').and.callThrough();
        setDefaultCanvasSizeSpy = spyOn<any>(service, 'setDefaultCanvasSize').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onKeyUp should call createNewDrawing() with keys Ctrl + o', () => {
        keyboardEvent = {
            key: 'o',
            ctrlKey: true,
        } as KeyboardEvent;
        drawingServiceSpy.isCanvasEmpty.and.returnValue(true);
        matDialogRefSpy.afterClosed.and.returnValue(of(true));
        service.onKeyUp(keyboardEvent);
        expect(createNewDrawingSpy).toHaveBeenCalled();
    });

    it('onKeyUp should not call createNewDrawing() with other keys', () => {
        keyboardEvent = {
            key: 'T',
            ctrlKey: true,
        } as KeyboardEvent;
        drawingServiceSpy.isCanvasEmpty.and.returnValue(true);
        matDialogRefSpy.afterClosed.and.returnValue(of(true));
        service.onKeyUp(keyboardEvent);
        expect(createNewDrawingSpy).not.toHaveBeenCalled();
    });

    it('should not resize canvas if it is already empty', () => {
        drawingServiceSpy.isCanvasEmpty.and.returnValue(true);
        service.createNewDrawing();
        expect(setDefaultCanvasSizeSpy).not.toHaveBeenCalled();
    });

    it('should resize canvas if it is not empty and changes are discarded', () => {
        drawingServiceSpy.isCanvasEmpty.and.returnValue(false);
        matDialogRefSpy.afterClosed.and.returnValue(of(true));
        service.createNewDrawing();
        expect(setDefaultCanvasSizeSpy).toHaveBeenCalled();
    });

    it('should not resize canvas if it is not empty and changes are kept', () => {
        drawingServiceSpy.isCanvasEmpty.and.returnValue(false);
        matDialogRefSpy.afterClosed.and.returnValue(of(false));
        service.createNewDrawing();
        expect(setDefaultCanvasSizeSpy).not.toHaveBeenCalled();
    });
});
