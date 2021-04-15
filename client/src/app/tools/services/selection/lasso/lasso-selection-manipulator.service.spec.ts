import { TestBed } from '@angular/core/testing';

import { LassoSelectionManipulatorService } from './lasso-selection-manipulator.service';

describe('LassoSelectionManipulatorService', () => {
  let service: LassoSelectionManipulatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LassoSelectionManipulatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
