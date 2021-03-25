import { TestBed } from '@angular/core/testing';
import { HandlerMemento } from '@app/app/classes/handler-memento';
import { ManipulatorMemento } from '@app/app/classes/manipulator-memento';
import { Vec2 } from '@app/app/classes/vec2';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { EllipseSelectionCreatorService } from '../../tools/ellipse-selection-creator.service';
import { EllipseService } from '../../tools/ellipse-service';
import { EllipseSelectionHandlerService } from '../ellipse/ellipse-selection-handler-service';
import { EllipseSelectionHelperService } from '../ellipse/ellipse-selection-helper.service';
import { EllipseSelectionManipulatorService } from '../ellipse/ellipse-selection-manipulator.service';

import { ClipboardService } from './clipboard.service';

describe('ClipboardService', () => {
  let service: ClipboardService;
  let ellipseSelectionHandlerService: EllipseSelectionHandlerService;
  let ellipseSelectionManipulatorService: EllipseSelectionManipulatorService;
  let ellipseSelectionHelperService: EllipseSelectionHelperService;
  let ellipseSelectionCreatorService: EllipseSelectionCreatorService;
  let drawingStub: DrawingService;
  let historyServiceStub: HistoryService;
  let colourServiceStub: ColourService;
  let ellipseToolStub: EllipseService;

  let registerWhiteFillSpy: jasmine.Spy<any>;
  let drawSelectionSpy: jasmine.Spy<any>;


  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClipboardService);
    colourServiceStub = new ColourService({} as ColourPickerService);

    historyServiceStub = new HistoryService();

    drawingStub = new DrawingService(historyServiceStub);
    drawingStub.canvasSize = { x: 500, y: 600 };

    ellipseToolStub = new EllipseService(drawingStub, colourServiceStub, historyServiceStub);

    ellipseSelectionHelperService = new EllipseSelectionHelperService(drawingStub, colourServiceStub, ellipseToolStub);
    ellipseSelectionHandlerService = new EllipseSelectionHandlerService(drawingStub, ellipseSelectionHelperService);
    ellipseSelectionManipulatorService = new EllipseSelectionManipulatorService(
      drawingStub,
      ellipseSelectionHelperService,
      ellipseSelectionHandlerService,
      historyServiceStub,
    );
    ellipseSelectionCreatorService = new EllipseSelectionCreatorService(
      drawingStub,
      ellipseSelectionManipulatorService,
      ellipseSelectionHelperService,
      service,

    );
    registerWhiteFillSpy = spyOn<any>(service, 'registerWhiteFillInHistory').and.callThrough();
    drawSelectionSpy = spyOn<any>(ellipseSelectionHandlerService, 'drawSelection').and.callThrough().and.returnValue(true);
    spyOn<any>(ellipseSelectionHandlerService, 'restoreFromMemento').and.callThrough().and.returnValue(true);
    spyOn<any>(ellipseSelectionManipulatorService, 'restoreFromMemento').and.callThrough().and.returnValue(true);
    spyOn<any>(ellipseSelectionManipulatorService, 'drawSelectionOutline').and.callThrough().and.returnValue(true);




    spyOn<any>(ellipseSelectionHandlerService, 'whiteFillAtOriginalLocation').and.returnValue(undefined);



  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('cut should register an action in history if white fill is applied', () => {
    const width: number = 500;
    const height: number = 700;
    const manipulatorMemento: ManipulatorMemento = new ManipulatorMemento();
    const handlerMemento: HandlerMemento = new HandlerMemento(width, height);
    service.applyWhiteFill = true;
    service.cut(manipulatorMemento, handlerMemento, ellipseSelectionCreatorService);
    expect(registerWhiteFillSpy).toHaveBeenCalled();
  });

  it('cut should not register an action in history if white fill is not applied', () => {
    const width: number = 500;
    const height: number = 700;

    const manipulatorMemento: ManipulatorMemento = new ManipulatorMemento();
    const handlerMemento: HandlerMemento = new HandlerMemento(width, height);

    service.applyWhiteFill = false;
    service.cut(manipulatorMemento, handlerMemento, ellipseSelectionCreatorService);

    expect(registerWhiteFillSpy).not.toHaveBeenCalled();
  });

  it('selection should not be drawn if clipboard is empty', () => {
    service.isEmpty =true;

    service.paste();
    expect(drawSelectionSpy).not.toHaveBeenCalled();
  });

  it('applyWhiteFill should be set to false every time a paste action is performed', () => {
    service.isEmpty =false;
    service.applyWhiteFill = true;
    service['manipulatorToRestore'] = ellipseSelectionManipulatorService;
    service['handlerToRestore'] = ellipseSelectionHandlerService;
    service.copyOwner = ellipseSelectionCreatorService;

    service.paste();

    expect(service.applyWhiteFill).toEqual(false);
    
  });

  it('the manipulator to restore should have its topLeft and bottomRight coordinates correctly set so the selection is at the origin even if isReversedX is true', () => {
    let topLeft: Vec2 = {x: 8, y: 4};
    let bottomRight: Vec2 = {x: 2, y: 12};
    let width: number = topLeft.x -  bottomRight.x;
    let height: number = bottomRight.y - topLeft.y;

    let expectedTopLeft: Vec2 = {x: width, y: 0};
    let expectedBottomRight: Vec2 = {x: 0 , y: height};

    service['manipulatorToRestore'] = ellipseSelectionManipulatorService;

    ellipseSelectionManipulatorService.topLeft = topLeft;
    ellipseSelectionManipulatorService.bottomRight = bottomRight;
    ellipseSelectionManipulatorService.isReversedX = true;
    ellipseSelectionManipulatorService.isReversedY = false;

    service.positionAtOrigin();

    expect(ellipseSelectionManipulatorService.topLeft).toEqual(expectedTopLeft);
    expect(ellipseSelectionManipulatorService.bottomRight).toEqual(expectedBottomRight);
  });

  it('the manipulator to restore should have its topLeft and bottomRight coordinates correctly set so the selection is at the origin even if isReversedX is false', () => {
    let bottomRight: Vec2 = {x: 8, y: 12};
    let topLeft: Vec2 = {x: 2, y: 4};
    let width: number = bottomRight.x -  topLeft.x;
    let height: number = bottomRight.y - topLeft.y;

    let expectedTopLeft: Vec2 = {x: 0, y: 0};
    let expectedBottomRight: Vec2 = {x: width , y: height};
    service['manipulatorToRestore'] = ellipseSelectionManipulatorService;
    ellipseSelectionManipulatorService.topLeft = topLeft;
    ellipseSelectionManipulatorService.bottomRight = bottomRight;
    ellipseSelectionManipulatorService.isReversedX = false;
    ellipseSelectionManipulatorService.isReversedY = false;

    service.positionAtOrigin();

    expect(ellipseSelectionManipulatorService.topLeft).toEqual(expectedTopLeft);
    expect(ellipseSelectionManipulatorService.bottomRight).toEqual(expectedBottomRight);
  });

  it('the manipulator to restore should have its topLeft and bottomRight coordinates correctly set so the selection is at the origin even if isReversedY is true', () => {
    let bottomRight: Vec2 = {x: 8, y: 4};
    let topLeft: Vec2 = {x: 2, y: 12};
    let width: number = bottomRight.x -  topLeft.x;
    let height: number = topLeft.y - bottomRight.y ;

    let expectedTopLeft: Vec2 = {x: 0, y: height};
    let expectedBottomRight: Vec2 = {x: width , y: 0};
    service['manipulatorToRestore'] = ellipseSelectionManipulatorService;
    ellipseSelectionManipulatorService.topLeft = topLeft;
    ellipseSelectionManipulatorService.bottomRight = bottomRight;
    ellipseSelectionManipulatorService.isReversedX = false;
    ellipseSelectionManipulatorService.isReversedY = true;

    service.positionAtOrigin();

    expect(ellipseSelectionManipulatorService.topLeft).toEqual(expectedTopLeft);
    expect(ellipseSelectionManipulatorService.bottomRight).toEqual(expectedBottomRight);
  });

  it('the manipulator to restore should have its topLeft and bottomRight coordinates correctly set so the selection is at the origin even if isReversedY is false', () => {
    let bottomRight: Vec2 = {x: 8, y: 12};
    let topLeft: Vec2 = {x: 2, y: 4};
    let width: number = bottomRight.x -  topLeft.x;
    let height: number = bottomRight.y - topLeft.y ;

    let expectedTopLeft: Vec2 = {x: 0, y: 0};
    let expectedBottomRight: Vec2 = {x: width , y: height};
    service['manipulatorToRestore'] = ellipseSelectionManipulatorService;
    ellipseSelectionManipulatorService.topLeft = topLeft;
    ellipseSelectionManipulatorService.bottomRight = bottomRight;
    ellipseSelectionManipulatorService.isReversedX = false;
    ellipseSelectionManipulatorService.isReversedY = false;

    service.positionAtOrigin();

    expect(ellipseSelectionManipulatorService.topLeft).toEqual(expectedTopLeft);
    expect(ellipseSelectionManipulatorService.bottomRight).toEqual(expectedBottomRight);
  });


});
