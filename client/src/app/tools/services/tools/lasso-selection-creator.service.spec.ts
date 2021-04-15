import { TestBed } from '@angular/core/testing';

import { LassoSelectionCreatorService } from './lasso-selection-creator.service';

describe('LassoSelectionCreatorService', () => {
  let service: LassoSelectionCreatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LassoSelectionCreatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
