import { TestBed } from '@angular/core/testing';

import { EllipseSelectionCreatorService } from './ellipse-selection-creator.service';

describe('EllipseSelectionToolService', () => {
  let service: EllipseSelectionCreatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EllipseSelectionCreatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
