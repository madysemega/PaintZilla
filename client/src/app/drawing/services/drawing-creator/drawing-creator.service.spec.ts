import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import * as Constants from '@app/drawing/constants/drawing-constants';
import { DrawingCreatorService } from '@app/drawing/services/drawing-creator/drawing-creator.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ResizingService } from '@app/drawing/services/resizing-service/resizing.service';
import { of } from 'rxjs';

// tslint:disable:no-any
describe('DrawingCreatorService', () => {
    let service: DrawingCreatorService;
    let drawingServiceSpy: DrawingService;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasSizeStub: Vec2;

    let resizingServiceSpy: ResizingService;
    let matDialogRefSpy: jasmine.SpyObj<any>;
    let matDialogSpy: jasmine.SpyObj<MatDialog>;

    let createNewDrawingSpy: jasmine.Spy<any>;

    let keyboardEvent: KeyboardEvent;
    beforeEach(() => {
        drawingServiceSpy = new DrawingService();
        resizingServiceSpy = new ResizingService(drawingServiceSpy);
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
                { provide: ResizingService, useValue: resizingServiceSpy },
            ],
        });

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service = TestBed.inject(DrawingCreatorService);

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvasSizeStub = { x: Constants.DEFAULT_WIDTH, y: Constants.DEFAULT_HEIGHT };
        drawingServiceSpy.canvas = canvasTestHelper.canvas;
        drawingServiceSpy.baseCtx = baseCtxStub;
        drawingServiceSpy.previewCtx = previewCtxStub;
        drawingServiceSpy.canvasSize = canvasSizeStub;

        createNewDrawingSpy = spyOn<any>(service, 'createNewDrawing').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onKeyUp should call createNewDrawing() with keys Ctrl + o', () => {
        keyboardEvent = {
            key: 'o',
            ctrlKey: true,
        } as KeyboardEvent;
        spyOn(drawingServiceSpy, 'isCanvasEmpty').and.returnValue(true);
        matDialogRefSpy.afterClosed.and.returnValue(of(false));
        service.onKeyUp(keyboardEvent);
        expect(createNewDrawingSpy).toHaveBeenCalled();
    });

    it('onKeyUp should not call createNewDrawing() with other keys', () => {
        keyboardEvent = {
            key: 'T',
            ctrlKey: true,
        } as KeyboardEvent;
        spyOn(drawingServiceSpy, 'isCanvasEmpty').and.returnValue(true);
        matDialogRefSpy.afterClosed.and.returnValue(of(true));
        service.onKeyUp(keyboardEvent);
        expect(createNewDrawingSpy).not.toHaveBeenCalled();
    });

    it('createNewDrawing() should open dialog if canvas is not empty', () => {
        spyOn(drawingServiceSpy, 'isCanvasEmpty').and.returnValue(false);
        spyOn(drawingServiceSpy, 'restoreCanvasStyle').and.returnValue();
        matDialogRefSpy.afterClosed.and.returnValue(of(true));
        service.createNewDrawing();
        expect(matDialogSpy.open).toHaveBeenCalled();
    });

    it('createNewDrawing() should not open dialog if canvas is empty', () => {
        spyOn(drawingServiceSpy, 'isCanvasEmpty').and.returnValue(true);
        matDialogRefSpy.afterClosed.and.returnValue(of(true));
        service.createNewDrawing();
        expect(matDialogSpy.open).not.toHaveBeenCalled();
    });

    it('createNewDrawing() should call clear canvas and reset canvas dimensions if changes are discarded and canvas is not empty', () => {
        const clearCanvasStub = spyOn(drawingServiceSpy, 'clearCanvas').and.stub();
        const resetCanvasDimensionsStub = spyOn(resizingServiceSpy, 'resetCanvasDimensions').and.stub();
        const updateCanvasSizeStub = spyOn(resizingServiceSpy, 'updateCanvasSize').and.stub();
        spyOn(drawingServiceSpy, 'restoreCanvasStyle').and.returnValue();
        matDialogRefSpy.afterClosed.and.returnValue(of(true));
        spyOn(drawingServiceSpy, 'isCanvasEmpty').and.returnValue(false);
        service.createNewDrawing();
        expect(clearCanvasStub).toHaveBeenCalled();
        expect(resetCanvasDimensionsStub).toHaveBeenCalled();
        expect(updateCanvasSizeStub).toHaveBeenCalled();
        expect(drawingServiceSpy.canvasIsEmpty).toEqual(true);
    });

    it('createNewDrawing() should not clear canvas and reset canvas dimensions if changes are not discarded and canvas is not empty', () => {
        const clearCanvasStub = spyOn(drawingServiceSpy, 'clearCanvas').and.stub();
        const resetCanvasDimensionsStub = spyOn(resizingServiceSpy, 'resetCanvasDimensions').and.stub();
        const updateCanvasSizeStub = spyOn(resizingServiceSpy, 'updateCanvasSize').and.stub();
        spyOn(drawingServiceSpy, 'restoreCanvasStyle').and.returnValue();
        matDialogRefSpy.afterClosed.and.returnValue(of(false));
        spyOn(drawingServiceSpy, 'isCanvasEmpty').and.returnValue(false);
        drawingServiceSpy.canvasIsEmpty = false;
        service.createNewDrawing();
        expect(clearCanvasStub).not.toHaveBeenCalled();
        expect(resetCanvasDimensionsStub).not.toHaveBeenCalled();
        expect(updateCanvasSizeStub).not.toHaveBeenCalled();
        expect(drawingServiceSpy.canvasIsEmpty).toEqual(false);
    });
});
