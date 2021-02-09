import { TestBed } from '@angular/core/testing';

import { DrawingCreatorService } from './drawing-creator.service';

describe('DrawingCreatorService', () => {
  let service: DrawingCreatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawingCreatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
