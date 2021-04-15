import { TestBed } from '@angular/core/testing';

import { LassoSelectionHelperService } from './lasso-selection-helper.service';

describe('LassoSelectionHelperService', () => {
  let service: LassoSelectionHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LassoSelectionHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
