import { TestBed } from '@angular/core/testing';

import { MementoService } from './memento.service';

describe('MementoService', () => {
  let service: MementoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MementoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
