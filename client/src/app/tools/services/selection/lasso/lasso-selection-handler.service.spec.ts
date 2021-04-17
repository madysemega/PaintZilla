import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/app/classes/vec2';
import { HotkeyModule } from 'angular2-hotkeys';
import { LassoSelectionHandlerService } from './lasso-selection-handler.service';

// tslint:disable: no-string-literal
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

  it('When initializing properties, vertices should be split in bounds and bulk', () => {
    const BULK: Vec2[] = [
      { x: 3, y: 4 },
      { x: -3, y: 6 },
      { x: 7, y: 2 },
    ];
    const BOUNDS: Vec2[] = [
      { x: -3, y: 2 },
      { x:  7, y: 6 },
    ];
    const VERTICES = BOUNDS.concat(BULK);
    
    service.initAllProperties(VERTICES);
    
    expect(service.initialVertices).toEqual(BULK);
  });

  it('Extracting bounds should return the first two vertices', () => {
    const VERTICES = [
      { x: 0, y: 7 },
      { x: 1, y: 6 },
      { x: 2, y: 5 },
      { x: 3, y: 4 },
    ];
    const EXPECTED_BOUNDS = [
      { x: 0, y: 7 },
      { x: 1, y: 6 },
    ];

    expect(service['extractBounds'](VERTICES)).toEqual(EXPECTED_BOUNDS);
  });

  it('Extracting bulk should return vertices from the third to the last', () => {
    const VERTICES = [
      { x: 0, y: 7 },
      { x: 1, y: 6 },
      { x: 2, y: 5 },
      { x: 3, y: 4 },
    ];
    const EXPECTED_BOUNDS = [
      { x: 2, y: 5 },
      { x: 3, y: 4 },
    ];

    expect(service['extractBulk'](VERTICES)).toEqual(EXPECTED_BOUNDS);
  });

  it('When extracting image, selection context should be clipped with the lasso polygon', () => {
    const CANVAS_WIDTH: number = 1000;
    const CANVAS_HEIGHT: number = 1000;

    const VERTICES = [
      { x: 0, y: 7 },
      { x: 1, y: 6 },
      { x: 2, y: 5 },
      { x: 3, y: 4 },
    ];

    const SOURCE_CANVAS = document.createElement('canvas');
    SOURCE_CANVAS.width = CANVAS_WIDTH;
    SOURCE_CANVAS.height = CANVAS_HEIGHT;

    const lineToSpy = spyOn(service.selectionCtx, 'lineTo').and.callThrough();
    const clipSpy = spyOn(service.selectionCtx, 'clip').and.callThrough();

    service.initAllProperties(VERTICES);
    service.extractSelectionFromSource(SOURCE_CANVAS);
    
    service.translatedVertices.forEach((vertex) => {
      expect(lineToSpy).toHaveBeenCalledWith(vertex.x, vertex.y);
    });
    expect(clipSpy).toHaveBeenCalled();
  });

  it('Should fill white with original vertices', () => {
    const VERTICES = [
      { x: 0, y: 7 },
      { x: 1, y: 6 },
      { x: 2, y: 5 },
      { x: 3, y: 4 },
    ];
    
    const ctx = service['drawingService'].baseCtx = service.selectionCtx;

    const lineToSpy = spyOn(ctx, 'lineTo').and.callThrough();
    const fillSpy = spyOn(ctx, 'fill').and.callThrough();

    service.initAllProperties(VERTICES);
    service.whiteFillAtOriginalLocation();

    service.initialVertices.forEach((vertex) => {
      expect(lineToSpy).toHaveBeenCalledWith(vertex.x, vertex.y);
    });
    
    expect(fillSpy).toHaveBeenCalled();
  });
});
