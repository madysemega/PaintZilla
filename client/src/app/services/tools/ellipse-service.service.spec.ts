import { TestBed } from '@angular/core/testing';
import { EllipseService } from './ellipse-service.service';


describe('EllipseServiceService', () => {
  let service: EllipseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EllipseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
