import { TestBed } from '@angular/core/testing';
import { HotkeyModule } from 'angular2-hotkeys';
import { LassoSelectionHandlerService } from './lasso-selection-handler.service';


describe('LassoSelectionHandlerService', () => {
  let service: LassoSelectionHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HotkeyModule.forRoot()],
    });
    service = TestBed.inject(LassoSelectionHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
