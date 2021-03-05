import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { RectangleSelectionHelperService } from './rectangle-selection-helper.service';

import { RectangleSelectionManipulatorService } from './rectangle-selection-manipulator.service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-empty
describe('RectangleSelectionManipulatorService', () => {
    let service: RectangleSelectionManipulatorService;

    let rectangleSelectionHelperService: jasmine.SpyObj<RectangleSelectionHelperService>;

    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        rectangleSelectionHelperService = jasmine.createSpyObj('RectangleSelectionHelperService', [
            'getSquareAdjustedPerimeter',
            'drawPerimeter',
            'setIsSelectionBeingManipulated',
        ]);
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setCursorType', 'drawPerimeter']);
        drawServiceSpy.canvasSize = { x: 1000, y: 500 };

        TestBed.configureTestingModule({
            providers: [
                // { provide: SelectionService, useValue: selectionServiceMock },
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: RectangleSelectionHelperService, useValue: rectangleSelectionHelperService },
            ],
        });
        service = TestBed.inject(RectangleSelectionManipulatorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('drawSelectionOutline should use drawPerimeter from CanvasRenderingContext2D', () => {
        service.drawSelectionOutline();
        expect(rectangleSelectionHelperService.drawPerimeter).toHaveBeenCalled();
    });
});
