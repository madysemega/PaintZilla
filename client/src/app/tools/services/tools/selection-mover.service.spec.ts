import { TestBed } from '@angular/core/testing';

import { SelectionMoverService } from './selection-mover.service';

describe('SelectionMoverService', () => {
  let service: SelectionMoverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectionMoverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
