import { TestBed } from '@angular/core/testing';

import { RectangleSelectionHelperService } from './rectangle-selection-helper.service';

describe('RectangleSelectionHelperService', () => {
  let service: RectangleSelectionHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RectangleSelectionHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
