import { TestBed } from '@angular/core/testing';

import { PaletteToolService } from './palette-tool.service';

describe('PaletteToolService', () => {
    let service: PaletteToolService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PaletteToolService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
