import { TestBed } from '@angular/core/testing';

import { SelectionCreatorService } from './selection-creator.service';

describe('SelectionCreatorService', () => {
    let service: SelectionCreatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectionCreatorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
