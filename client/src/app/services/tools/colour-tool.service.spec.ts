import { TestBed } from '@angular/core/testing';

import { ColourToolService } from './colour-tool.service';

describe('ColourToolService', () => {
  let service: ColourToolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColourToolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
