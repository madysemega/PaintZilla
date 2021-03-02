import { TestBed } from '@angular/core/testing';

import { EllipseSelectionHandlerService } from './ellipse-selection-handler-service';

describe('SelectionRendererService', () => {
    let service: EllipseSelectionHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EllipseSelectionHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
