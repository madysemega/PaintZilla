import { TestBed } from '@angular/core/testing';
import { HotkeyModule } from 'angular2-hotkeys';
import { LassoSelectionHelperService } from './lasso-selection-helper.service';


describe('LassoSelectionHelperService', () => {
  let service: LassoSelectionHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HotkeyModule.forRoot()],
    });
    service = TestBed.inject(LassoSelectionHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
