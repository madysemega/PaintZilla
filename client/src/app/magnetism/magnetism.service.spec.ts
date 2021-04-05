import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { MagnetismService } from './magnetism.service';

describe('MagnetismService', () => {
  let service: MagnetismService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MagnetismService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('toggling magnetism twice should not change initial value', () => {
    service.isActivated = new BehaviorSubject(false);
    service.toggleMagnetism();
    service.toggleMagnetism();
    expect(service.isActivated.value).toEqual(false);
});
});
