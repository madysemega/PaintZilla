import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import * as Constants from '@app/drawing/constants/drawing-constants';
import { DrawingCreatorService } from '@app/drawing/services/drawing-creator/drawing-creator.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ResizingService } from '@app/drawing/services/resizing-service/resizing.service';
import { AutomaticSavingService } from '@app/file-options/automatic-saving/automatic-saving.service';
import { HistoryService } from '@app/history/service/history.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { MagnetismService } from '@app/magnetism/magnetism.service';
import { of } from 'rxjs';

// tslint:disable:no-any
describe('DrawingCreatorService', () => {
    let service: DrawingCreatorService;
    let historyServiceStub: HistoryService;
    // tslint:disable:prefer-const
    let magnetismServiceStub: MagnetismService;
    let drawingServiceSpy: DrawingService;
    let automaticSavingService: AutomaticSavingService;
    let keyboardServiceStub: jasmine.SpyObj<KeyboardService>;

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
        keyboardServiceStub = jasmine.createSpyObj('KeyboardService', ['registerAction', 'saveContext', 'restoreContext']);
        keyboardServiceStub.registerAction.and.stub();
        keyboardServiceStub.saveContext.and.stub();
        keyboardServiceStub.restoreContext.and.stub();
        historyServiceStub = new HistoryService(keyboardServiceStub);
        drawingServiceSpy = new DrawingService(historyServiceStub);
        resizingServiceSpy = new ResizingService(drawingServiceSpy, historyServiceStub, magnetismServiceStub);
        automaticSavingService = new AutomaticSavingService(drawingServiceSpy, historyServiceStub);
        matDialogRefSpy = jasmine.createSpyObj('MatDialogRef<DiscardChangesDialogComponent>', ['afterClosed']);
        historyServiceStub = jasmine.createSpyObj('HistoryService', ['clear']);

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
                { provide: HistoryService, useValue: historyServiceStub },
                { provide: AutomaticSavingService, useValue: automaticSavingService },
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

    it('onKeyDown should call createNewDrawing() with keys Ctrl + o', () => {
        keyboardEvent = {
            key: 'o',
            ctrlKey: true,
            preventDefault(): void {
                return;
            },
        } as KeyboardEvent;
        spyOn(drawingServiceSpy, 'isCanvasEmpty').and.returnValue(true);
        matDialogRefSpy.afterClosed.and.returnValue(of(false));
        service.onKeyDown(keyboardEvent);
        expect(createNewDrawingSpy).toHaveBeenCalled();
    });

    it('onKeyDown should call preventDefault() with keys Ctrl + o', () => {
        keyboardEvent = {
            key: 'o',
            ctrlKey: true,
            preventDefault(): void {
                return;
            },
        } as KeyboardEvent;
        spyOn(drawingServiceSpy, 'isCanvasEmpty').and.returnValue(true);
        const preventDefaultSpy = spyOn<any>(keyboardEvent, 'preventDefault').and.callThrough();
        matDialogRefSpy.afterClosed.and.returnValue(of(false));
        service.onKeyDown(keyboardEvent);
        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('onKeyDown should not call createNewDrawing() with other keys', () => {
        keyboardEvent = {
            key: 'T',
            ctrlKey: true,
        } as KeyboardEvent;
        spyOn(drawingServiceSpy, 'isCanvasEmpty').and.returnValue(true);
        matDialogRefSpy.afterClosed.and.returnValue(of(true));
        service.onKeyDown(keyboardEvent);
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

    it('createNewDrawing() should call emit if changes are discarded and canvas is not empty', () => {
        matDialogRefSpy.afterClosed.and.returnValue(of('discard'));
        spyOn(drawingServiceSpy, 'isCanvasEmpty').and.returnValue(false);
        drawingServiceSpy.canvasIsEmpty = false;
        spyOn(service.drawingRestored, 'emit');
        service.createNewDrawing();
        expect(service.drawingRestored.emit).toHaveBeenCalled();
        expect(drawingServiceSpy.canvasIsEmpty).toEqual(true);
    });

    it('createNewDrawing() should clear undo-redo history if changes are discarded and canvas is not empty', () => {
        matDialogRefSpy.afterClosed.and.returnValue(of('discard'));
        spyOn(drawingServiceSpy, 'isCanvasEmpty').and.returnValue(false);
        drawingServiceSpy.canvasIsEmpty = false;
        service.createNewDrawing();
        expect(historyServiceStub.clear).toHaveBeenCalled();
    });

    it('createNewDrawing() should call emit if changes are saved and canvas is not empty', () => {
        matDialogRefSpy.afterClosed.and.returnValue(of('save'));
        spyOn(drawingServiceSpy, 'isCanvasEmpty').and.returnValue(false);
        drawingServiceSpy.canvasIsEmpty = false;
        spyOn(service.drawingRestored, 'emit');
        service.createNewDrawing();
        expect(service.drawingRestored.emit).toHaveBeenCalled();
        expect(drawingServiceSpy.canvasIsEmpty).toEqual(true);
    });

    it('createNewDrawing() should clear undo-redo history if changes are saved and canvas is not empty', () => {
        matDialogRefSpy.afterClosed.and.returnValue(of('save'));
        spyOn(drawingServiceSpy, 'isCanvasEmpty').and.returnValue(false);
        drawingServiceSpy.canvasIsEmpty = false;
        service.createNewDrawing();
        expect(historyServiceStub.clear).toHaveBeenCalled();
    });

    it('noDialogsOpen should return true if there are no dialogs', () => {
        const noDialogsOpen: boolean = service.noDialogsOpen();
        expect(noDialogsOpen).toEqual(true);
    });
});
