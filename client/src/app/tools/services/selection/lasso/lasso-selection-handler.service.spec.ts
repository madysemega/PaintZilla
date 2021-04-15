import { TestBed } from '@angular/core/testing';

import { LassoSelectionHandlerService } from './lasso-selection-handler.service';

describe('LassoSelectionHandlerService', () => {
  let service: LassoSelectionHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LassoSelectionHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
