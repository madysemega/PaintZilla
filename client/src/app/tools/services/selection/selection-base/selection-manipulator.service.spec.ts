import { TestBed } from '@angular/core/testing';

import { SelectionManipulatorService } from './selection-manipulator.service';

describe('SelectionManipulatorService', () => {
    let service: SelectionManipulatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectionManipulatorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
