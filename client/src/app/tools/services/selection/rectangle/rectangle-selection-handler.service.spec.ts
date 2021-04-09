import { TestBed } from '@angular/core/testing';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { RectangleSelectionHandlerService } from './rectangle-selection-handler.service';
import { RectangleSelectionHelperService } from './rectangle-selection-helper.service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-empty
describe('RectangleSelectionHandlerService', () => {
    let service: RectangleSelectionHandlerService;

    let rectangleSelectionHelperService: jasmine.SpyObj<RectangleSelectionHelperService>;
    let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;

    let drawImageSpy: jasmine.Spy<any>;
    let fillSpy: jasmine.Spy<any>;

    beforeEach(() => {
        rectangleSelectionHelperService = jasmine.createSpyObj('RectangleSelectionHelperService', [
            'drawPostSelectionRectangle',
            'drawPerimeter',
            'setIsSelectionBeingManipulated',
        ]);

        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);

        TestBed.configureTestingModule({
            imports: [HotkeyModule.forRoot()],
            providers: [
                { provide: RectangleSelectionHelperService, useValue: rectangleSelectionHelperService },
                { provide: HotkeysService, useValue: hotkeysServiceStub },
            ],
        });
        service = TestBed.inject(RectangleSelectionHandlerService);

        drawImageSpy = spyOn<any>(service.selectionCtx, 'drawImage').and.callThrough();
        fillSpy = spyOn<any>(service.selectionCtx, 'fill').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('extractSelectionFromSource should call drawImage from  CanvasRenderingContext2D', () => {
        const sourceCanvas: HTMLCanvasElement = document.createElement('canvas');
        sourceCanvas.width = 500;
        sourceCanvas.height = 764;
        service.extractSelectionFromSource(sourceCanvas);
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('extracting should use fill if fillItWhite is true', () => {
        const sourceCanvas: HTMLCanvasElement = document.createElement('canvas');
        sourceCanvas.width = 500;
        sourceCanvas.height = 764;
        service.extract(sourceCanvas, service.selectionCtx, true);
        expect(fillSpy).toHaveBeenCalled();
    });

    it('white fill should use drawPostSelectionRectangle from RectangleSelectionHelperService', () => {
        service.whiteFillAtOriginalLocation();
        expect(rectangleSelectionHelperService.drawPostSelectionRectangle).toHaveBeenCalled();
    });
});
