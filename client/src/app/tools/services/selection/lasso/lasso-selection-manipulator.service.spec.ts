import { TestBed } from '@angular/core/testing';
import { HotkeyModule } from 'angular2-hotkeys';
import { LassoSelectionManipulatorService } from './lasso-selection-manipulator.service';


describe('LassoSelectionManipulatorService', () => {
  let service: LassoSelectionManipulatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HotkeyModule.forRoot()],
    });
    service = TestBed.inject(LassoSelectionManipulatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
