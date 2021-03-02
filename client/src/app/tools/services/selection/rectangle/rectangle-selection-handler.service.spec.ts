import { TestBed } from '@angular/core/testing';

import { RectangleSelectionHandlerService } from './rectangle-selection-handler.service';

describe('RectangleSelectionHandlerService', () => {
    let service: RectangleSelectionHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(RectangleSelectionHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
