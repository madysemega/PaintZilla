import { TestBed } from '@angular/core/testing';

import { RectangleSelectionCreatorService } from './rectangle-selection-creator.service';

describe('RectangleSelectionCreatorService', () => {
  let service: RectangleSelectionCreatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RectangleSelectionCreatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
