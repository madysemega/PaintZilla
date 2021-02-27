import { TestBed } from '@angular/core/testing';

import { EllipseSelectionManipulatorService } from './ellipse-selection-manipulator.service';

describe('EllipseSelectionManipulatorService', () => {
  let service: EllipseSelectionManipulatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EllipseSelectionManipulatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
