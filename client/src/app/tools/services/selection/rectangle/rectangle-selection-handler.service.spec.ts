import { TestBed } from '@angular/core/testing';

import { RectangleSelectionHandlerService } from './rectangle-selection-handler.service';
import { RectangleSelectionHelperService } from './rectangle-selection-helper.service';

describe('RectangleSelectionHandlerService', () => {
    let service: RectangleSelectionHandlerService;

    let rectangleSelectionHelperService: jasmine.SpyObj<RectangleSelectionHelperService>;


    let drawImageSpy: jasmine.Spy<any>;

    beforeEach(() => {

        rectangleSelectionHelperService = jasmine.createSpyObj('RectangleSelectionHelperService', ['drawPostSelectionRectangle', 'drawPerimeter', 'setIsSelectionBeingManipulated']);

        TestBed.configureTestingModule({
            providers:
            [   
                { provide: RectangleSelectionHelperService, useValue: rectangleSelectionHelperService },
            ],
        });
        service = TestBed.inject(RectangleSelectionHandlerService);

        drawImageSpy = spyOn<any>(service.selectionCtx, 'drawImage').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('extractSelectionFromSource should call drawImage from  CanvasRenderingContext2D', () => {
        const sourceCanvas: HTMLCanvasElement = document.createElement('canvas');
        sourceCanvas.width = 500;
        sourceCanvas.height =764;
        service.extractSelectionFromSource(sourceCanvas)
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('drawWhitePostSelectionEllipse should call drawPostSelectionRectangle from RectangleSelectionHelperService', () => {
        service.drawWhitePostSelection();
        expect(rectangleSelectionHelperService.drawPostSelectionRectangle).toHaveBeenCalled();
    });
});
