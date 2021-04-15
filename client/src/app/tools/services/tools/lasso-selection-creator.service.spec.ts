import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HotkeyModule } from 'angular2-hotkeys';
import { ClipboardService } from '../selection/clipboard/clipboard.service';
import { LassoSelectionHelperService } from '../selection/lasso/lasso-selection-helper.service';
import { LassoSelectionManipulatorService } from '../selection/lasso/lasso-selection-manipulator.service';
import { LassoSelectionCreatorService } from './lasso-selection-creator.service';


describe('LassoSelectionCreatorService', () => {
  let service: LassoSelectionCreatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HotkeyModule.forRoot()],
      providers: [
        DrawingService,
        LassoSelectionManipulatorService,
        LassoSelectionHelperService,
        ClipboardService
      ],
    });
    service = TestBed.inject(LassoSelectionCreatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
