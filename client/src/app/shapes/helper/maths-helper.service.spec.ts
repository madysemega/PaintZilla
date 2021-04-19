import { TestBed } from '@angular/core/testing';

import { MathsHelper } from './maths-helper.service';

describe('MathsHelper', () => {
  let service: MathsHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MathsHelper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
