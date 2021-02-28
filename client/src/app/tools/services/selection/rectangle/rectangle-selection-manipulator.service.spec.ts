import { TestBed } from '@angular/core/testing';

import { RectangleSelectionManipulatorService } from './rectangle-selection-manipulator.service';

describe('RectangleSelectionManipulatorService', () => {
  let service: RectangleSelectionManipulatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RectangleSelectionManipulatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
