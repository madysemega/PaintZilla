import { TestBed } from '@angular/core/testing';

import { EllipseSelectionHelperService } from './ellipse-selection-helper.service';

describe('EllipseSelectionHelperService', () => {
    let service: EllipseSelectionHelperService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EllipseSelectionHelperService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
