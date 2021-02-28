import { TestBed } from '@angular/core/testing';

import { EllipseSelectionRendererService } from './ellipse-selection-handler-service';

describe('SelectionRendererService', () => {
  let service: EllipseSelectionRendererService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EllipseSelectionRendererService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
