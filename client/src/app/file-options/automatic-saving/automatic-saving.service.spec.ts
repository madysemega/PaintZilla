import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { AutomaticSavingService } from './automatic-saving.service';

describe('AutomaticSavingService', () => {
    let service: AutomaticSavingService;

    let historyServiceStub: HistoryService;
    let drawingStub: DrawingService;
    let canvasTestHelper: CanvasTestHelper;

    beforeEach(() => {
        historyServiceStub = new HistoryService();
        drawingStub = new DrawingService(historyServiceStub);

        // Taken from https://stackoverflow.com/questions/11485420/how-to-mock-localstorage-in-javascript-unit-tests
        const store: Map<string, string> = new Map<string, string>();

        spyOn(localStorage, 'getItem').and.callFake((key: string) => {
            return store.get(key) as string;
        });
        spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
            return store.set(key, value + '');
        });
        spyOn(localStorage, 'clear').and.callFake(() => {
            store.clear();
        });

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: HistoryService, useValue: historyServiceStub },
            ],
        });
        service = TestBed.inject(AutomaticSavingService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        drawingStub.canvas = canvasTestHelper.canvas;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call saveDrawingLocally() when drawings are loaded', () => {
        const saveDrawingLocallySpy = spyOn(service, 'saveDrawingLocally').and.stub();
        drawingStub.onDrawingLoaded.emit();
        expect(saveDrawingLocallySpy).toHaveBeenCalled();
    });

    it('should call saveDrawingLocally() when the drawing is modified', () => {
        const saveDrawingLocallySpy = spyOn(service, 'saveDrawingLocally').and.stub();
        historyServiceStub.onDrawingModification.emit();
        expect(saveDrawingLocallySpy).toHaveBeenCalled();
    });

    it('loadMostRecentDrawing should get the drawing stored locally and call drawingService.setImageSavedLocally()', () => {
        const setImageSavedLocallySpy = spyOn(drawingStub, 'setImageSavedLocally').and.stub();
        localStorage.setItem('drawing', '123');
        service.loadMostRecentDrawing();
        expect(localStorage.getItem).toHaveBeenCalled();
        expect(setImageSavedLocallySpy).toHaveBeenCalled();
    });

    it('loadMostRecentDrawing should not call drawingService.setImageSavedLocally() if there is no drawing stored', () => {
        const setImageSavedLocallySpy = spyOn(drawingStub, 'setImageSavedLocally').and.stub();
        service.loadMostRecentDrawing();
        expect(setImageSavedLocallySpy).not.toHaveBeenCalled();
    });

    it('saveDrawingLocally should call localStorage.setItem()', () => {
        service.saveDrawingLocally();
        expect(localStorage.setItem).toHaveBeenCalled();
    });
});
