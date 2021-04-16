import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { HotkeyModule } from 'angular2-hotkeys';
import { BehaviorSubject } from 'rxjs';
import { ClipboardService } from '../selection/clipboard/clipboard.service';
import { LassoSelectionHelperService } from '../selection/lasso/lasso-selection-helper.service';
import { LassoSelectionManipulatorService } from '../selection/lasso/lasso-selection-manipulator.service';
import { LassoSelectionCreatorService } from './lasso-selection-creator.service';

// tslint:disable:no-string-literal
describe('LassoSelectionCreatorService', () => {
  let service: LassoSelectionCreatorService;

  let drawingStub: jasmine.SpyObj<DrawingService>;

  let manipulatorStub: jasmine.SpyObj<LassoSelectionManipulatorService>;
  let helperStub: jasmine.SpyObj<LassoSelectionHelperService>;
  let clipboardStub: jasmine.SpyObj<ClipboardService>;

  beforeEach(() => {
    drawingStub = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

    manipulatorStub = jasmine.createSpyObj('LassoSelectionManipulatorService', [
      'onMouseDown',
      'onMouseUp',
      'onMouseMove',
      'onKeyDown',
      'onKeyUp',
      'initialize',
      'stopManipulation',
      'delete',
      'createMemento',
    ]);

    helperStub = jasmine.createSpyObj('LassoSelectionHelperService', ['setIsSelectionBeingManipulated']);
    clipboardStub = jasmine.createSpyObj('ClipboardService', ['copy', 'cut']);

    TestBed.configureTestingModule({
      imports: [HotkeyModule.forRoot()],
      providers: [
        { provide: DrawingService, useValue: drawingStub },
        { provide: LassoSelectionManipulatorService, useValue: manipulatorStub },
        { provide: LassoSelectionHelperService, useValue: helperStub },
        { provide: ClipboardService, useValue: clipboardStub },
      ],
    });
    service = TestBed.inject(LassoSelectionCreatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('On left mouse down, if selection is being manipulated, event should be propagated to manipulator', () => {
    const event = { button: MouseButton.Left } as MouseEvent;

    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(true);

    service.onMouseDown(event);
    expect(manipulatorStub.onMouseDown).toHaveBeenCalled();
  });

  it('On left mouse down, if selection is not being manipulated, event should not be propagated to manipulator', () => {
    const event = { button: MouseButton.Left } as MouseEvent;

    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(false);

    service.onMouseDown(event);
    expect(manipulatorStub.onMouseDown).not.toHaveBeenCalled();
  });

  it('On right mouse down, if selection is being manipulated, event should be propagated to manipulator', () => {
    const event = { button: MouseButton.Right } as MouseEvent;

    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(true);

    service.onMouseDown(event);
    expect(manipulatorStub.onMouseDown).toHaveBeenCalled();
  });

  it('On right mouse down, if selection is not being manipulated, event should not be propagated to manipulator', () => {
    const event = { button: MouseButton.Right } as MouseEvent;

    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(false);

    service.onMouseDown(event);
    expect(manipulatorStub.onMouseDown).not.toHaveBeenCalled();
  });

  it('On left mouse up, if selection is being manipulated, event should be propagated to manipulator', () => {
    const event = { button: MouseButton.Left } as MouseEvent;

    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(true);

    service.onMouseUp(event);
    expect(manipulatorStub.onMouseUp).toHaveBeenCalled();
  });

  it('On left mouse up, if selection is not being manipulated, event should not be propagated to manipulator', () => {
    const event = { button: MouseButton.Left } as MouseEvent;

    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(false);

    service.onMouseUp(event);
    expect(manipulatorStub.onMouseUp).not.toHaveBeenCalled();
  });

  it('On right mouse up, if selection is being manipulated, event should be propagated to manipulator', () => {
    const event = { button: MouseButton.Right } as MouseEvent;

    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(true);

    service.onMouseUp(event);
    expect(manipulatorStub.onMouseUp).toHaveBeenCalled();
  });

  it('On right mouse up, if selection is not being manipulated, event should not be propagated to manipulator', () => {
    const event = { button: MouseButton.Right } as MouseEvent;

    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(false);

    service.onMouseUp(event);
    expect(manipulatorStub.onMouseUp).not.toHaveBeenCalled();
  });

  it('On mouse left click, if not manipulating and closeable, should create selection', () => {
    const event = { button: MouseButton.Left } as MouseEvent;
    const createSelectionSpy = spyOn(service, 'createSelection').and.stub();
    
    spyOn(service, 'getPositionFromMouse').and.returnValue({ x: 0, y: 0 });
    spyOn(service['shape'], 'isCloseableWith').and.returnValue(true);
    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(false);

    service.onMouseClick(event);
    expect(createSelectionSpy).toHaveBeenCalled();
  });

  it('On mouse left click, if not manipulating and not closeable, should draw selection outline', () => {
    const event = { button: MouseButton.Left } as MouseEvent;
    const drawSelectionOutlineSpy = spyOn(service, 'drawSelectionOutline').and.stub();
    
    spyOn(service, 'getPositionFromMouse').and.returnValue({ x: 0, y: 0 });
    spyOn(service['shape'], 'isCloseableWith').and.returnValue(false);
    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(false);

    service.onMouseClick(event);
    expect(drawSelectionOutlineSpy).toHaveBeenCalled();
  });

  it('On mouse click, if was being manipulated, should lower flag', () => {
    const event = { button: MouseButton.Left } as MouseEvent;

    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(false);
    service.wasBeingManipulated = true;

    service.onMouseClick(event);
    expect(service.wasBeingManipulated).toBeFalse();
  });

  it('On mouse click, if selection in being manipulated, should do nothing', () => {
    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(true);
    expect(service.onMouseClick({} as MouseEvent)).toBe(void 0);
  });

  it('On right mouse click, should do nothing', () => {
    const event = { button: MouseButton.Right } as MouseEvent;
    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(false);
    expect(service.onMouseClick(event)).toBe(void 0);
  });

  it('When mouse moves, if manipulating, event should be propagated to manipulator', () => {
    spyOn(service, 'getPositionFromMouse').and.returnValue({ x: 0, y: 0 });
    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(true);
    
    service.onMouseMove({} as MouseEvent);
    expect(manipulatorStub.onMouseMove).toHaveBeenCalled();
  });

  it('When mouse moves, if not manipulating, last mouse position should be updated', () => {
    const LAST_MOUSE_POSITION_INITIAL_VALUE = { x: 3, y: 4 } as Vec2;
    const NEW_MOUSE_POSITION = { x: 5, y: 6 } as Vec2;
    
    spyOn(service, 'drawSelectionOutline').and.stub();
    spyOn(service, 'getPositionFromMouse').and.returnValue(NEW_MOUSE_POSITION);
    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(false);
    service.lastMousePosition = LAST_MOUSE_POSITION_INITIAL_VALUE;
    service.onMouseMove({} as MouseEvent);

    expect(service.lastMousePosition).toEqual(NEW_MOUSE_POSITION);
  });

  it('When mouse moves, if not manipulating, selection outline should be drawn', () => {    
    const drawOutlineSpy = spyOn(service, 'drawSelectionOutline').and.stub();
    
    spyOn(service, 'getPositionFromMouse').and.returnValue({ x: 0, y: 0 });
    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(false);
    service.onMouseMove({} as MouseEvent);

    expect(drawOutlineSpy).toHaveBeenCalled();
  });

  it('On key down, if manipulating, event should be propagated to manipulator', () => {
    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(true);
    service.onKeyDown({} as KeyboardEvent);
    expect(manipulatorStub.onKeyDown).toHaveBeenCalled();
  });

  it('On key down, if not manipulating and key is shift, isShiftDown flag should be set to true', () => {
    const event = { key: 'Shift' } as KeyboardEvent;

    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(false);
    spyOn(service, 'drawSelectionOutline').and.stub();
    
    service.isShiftDown = false;
    service.onKeyDown(event);
    expect(service.isShiftDown).toBeTrue();

    service.isShiftDown = true;
    service.onKeyDown(event);
    expect(service.isShiftDown).toBeTrue();
  });

  it('On key down, if not manipulating and key is shift, selection outline should be drawn', () => {
    const event = { key: 'Shift' } as KeyboardEvent;
    const drawOutlineSpy = spyOn(service, 'drawSelectionOutline').and.stub();

    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(false);
    
    service.onKeyDown(event);
    expect(drawOutlineSpy).toHaveBeenCalled();
  });

  it('On key down, if not manipulating and key is not shift, do nothing', () => {
    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(false);
    expect(service.onKeyDown({} as KeyboardEvent)).toBe(void 0);
  });

  it('On key up, if manipulating, event should be propagated to manipulator', () => {
    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(true);
    service.onKeyUp({} as KeyboardEvent);
    expect(manipulatorStub.onKeyUp).toHaveBeenCalled();
  });

  it('On shift up, if not manipulating, isShiftDown flag should be set to false', () => {
    const event = { key: 'Shift' } as KeyboardEvent;

    spyOn(service, 'drawSelectionOutline').and.stub();
    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(false);

    service.isShiftDown = true;
    service.onKeyUp(event);
    expect(service.isShiftDown).toEqual(false);

    service.isShiftDown = false;
    service.onKeyUp(event);
    expect(service.isShiftDown).toEqual(false);
  });

  it('On shift up, if not manipulating, selection outline should be drawn', () => {
    const event = { key: 'Shift' } as KeyboardEvent;
    const drawOutlineSpy = spyOn(service, 'drawSelectionOutline').and.stub();

    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(false);
    service.onKeyUp(event);

    expect(drawOutlineSpy).toHaveBeenCalled();
  });

  it('On escape up, if not manipulating, shape and should be cleared', () => {
    const event = { key: 'Escape' } as KeyboardEvent;
    const shapeClearSpy = spyOn(service['shape'], 'clear').and.stub();

    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(false);
    service.onKeyUp(event);

    expect(shapeClearSpy).toHaveBeenCalled();
    expect(drawingStub.clearCanvas).toHaveBeenCalled();
  });

  it('On backspace up, if not manipulating, if there are vertices the last should be removed and outline should be drawn', () => {
    const INITIAL_VERTICES_COUNT = 3;
    const EXPECTED_VERTICES_COUNT = 2;

    const event = { key: 'Backspace' } as KeyboardEvent;
    const drawOutlineSpy = spyOn(service, 'drawSelectionOutline').and.stub();

    service['shape'].vertices.length = INITIAL_VERTICES_COUNT;

    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(false);
    service.onKeyUp(event);

    expect(service['shape'].vertices.length).toEqual(EXPECTED_VERTICES_COUNT);
    expect(drawOutlineSpy).toHaveBeenCalled();
  });

  it('On backspace up, if not manipulating, if there is only one vertex it should not be removed', () => {
    const INITIAL_VERTICES_COUNT = 1;
    const EXPECTED_VERTICES_COUNT = 1;

    const event = { key: 'Backspace' } as KeyboardEvent;
    spyOn(service, 'drawSelectionOutline').and.stub();

    service['shape'].vertices.length = INITIAL_VERTICES_COUNT;

    spyOn(service, 'isSelectionBeingManipulated').and.returnValue(false);
    service.onKeyUp(event);

    expect(service['shape'].vertices.length).toEqual(EXPECTED_VERTICES_COUNT);
  });

  it('When drawing selection outline, canvas should be cleared', () => {
    spyOn(service['renderer'], 'render').and.stub();
    
    service.drawSelectionOutline();
    expect(drawingStub.clearCanvas).toHaveBeenCalled();
  });

  it('When drawing selection outline, outline shape should be rendered', () => {
    const renderSpy = spyOn(service['renderer'], 'render').and.stub();
    
    service.drawSelectionOutline();
    expect(renderSpy).toHaveBeenCalled();
  });

  it('When creating selection, if there are vertices, manipulator should be initialized', () => {
    const VERTICES = [
      { x: 0, y: 3 },
      { x: 2, y: 8 },
      { x: 4, y: 7 },
      { x: 1, y: 4 },
    ];

    VERTICES.forEach((vertex) => {
      service['shape'].vertices.push(vertex);
    });

    service.createSelection();
    expect(manipulatorStub.initialize).toHaveBeenCalled();
  });

  it('If shape has no vertices, no selection should be created', () => {
    service['shape'].clear();
    expect(service.createSelection()).toBe(void 0);
  });

  it('If selection is being manipulated, it should be reflected in the property', () => {
    helperStub.isSelectionBeingManipulated = new BehaviorSubject(true);
    expect(service.isSelectionBeingManipulated()).toBeTrue();
  });

  it('Resetting properties should clear shape', () => {
    const clearShapeSpy = spyOn(service['shape'], 'clear').and.stub();
    service.resetProperties();
    expect(clearShapeSpy).toHaveBeenCalled();
  });

  it('Resetting properties should reset the last mouse position to the origin', () => {
    const INITIAL_POSITION = { x: 3, y: 4 };
    const EXPECTED_POSITION = { x: 0, y: 0 };

    service.lastMousePosition = INITIAL_POSITION;
    service.resetProperties();
    expect(service.lastMousePosition).toEqual(EXPECTED_POSITION);
  });

  it('Resetting properties should lower the mouseDown flag', () => {
    const INITIAL_VALUE = true;
    const EXPECTED_VALUE = false;

    service.mouseDown = INITIAL_VALUE;
    service.resetProperties();
    expect(service.mouseDown).toEqual(EXPECTED_VALUE);
  });

  it('Resetting properties should lower the isShiftDown flag', () => {
    const INITIAL_VALUE = true;
    const EXPECTED_VALUE = false;

    service.isShiftDown = INITIAL_VALUE;
    service.resetProperties();
    expect(service.isShiftDown).toEqual(EXPECTED_VALUE);
  });

  it('Resetting properties should lower the wasBeingManipulated flag', () => {
    const INITIAL_VALUE = true;
    const EXPECTED_VALUE = false;

    service.wasBeingManipulated = INITIAL_VALUE;
    service.resetProperties();
    expect(service.wasBeingManipulated).toEqual(EXPECTED_VALUE);
  });
  
  it('Top left of shape should be undefined if shape has no vertices', () => {
    const VERTICES: Vec2[] = [];
    expect(service['findTopLeft'](VERTICES)).toEqual(undefined);
  });

  it('Top left of shape should be left most x and top most y', () => {
    const EXPECTED_TOP_LEFT = { x: -6, y: 2 };
    const VERTICES: Vec2[] = [
      { x: 0, y: 8 },
      { x: 3, y: 6 },
      { x: 8, y: 2 },
      { x: -6, y: 23 },
    ];

    expect(service['findTopLeft'](VERTICES)).toEqual(EXPECTED_TOP_LEFT);
  });

  it('Bottom right of shape should be undefined if shape has no vertices', () => {
    const VERTICES: Vec2[] = [];
    expect(service['findBottomRight'](VERTICES)).toEqual(undefined);
  });

  it('Bottom right of shape should be right most x and bottom most y', () => {
    const EXPECTED_BOTTOM_RIGHT = { x: 8, y: 23 };
    const VERTICES: Vec2[] = [
      { x: 0, y: 8 },
      { x: 3, y: 6 },
      { x: 8, y: 2 },
      { x: -6, y: 23 },
    ];

    expect(service['findBottomRight'](VERTICES)).toEqual(EXPECTED_BOTTOM_RIGHT);
  });
});
