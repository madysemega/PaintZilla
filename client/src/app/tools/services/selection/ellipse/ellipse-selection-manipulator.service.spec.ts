import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { ManipulatorMemento } from '@app/app/classes/manipulator-memento';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ResizingMode } from '@app/tools/services/selection/selection-base/resizing-mode';
import { interval } from 'rxjs';
import { SelectionHandlerService } from '../selection-base/selection-handler.service';
import { SelectionService } from '../selection-base/selection.service';
import { EllipseSelectionHandlerService } from './ellipse-selection-handler-service';
import { EllipseSelectionHelperService } from './ellipse-selection-helper.service';

import { EllipseSelectionManipulatorService } from './ellipse-selection-manipulator.service';

describe('EllipseSelectionManipulatorService', () => {
    let service: EllipseSelectionManipulatorService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let canvasPosition: Vec2;
    let canvas: HTMLCanvasElement;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let selectionHandlerMock: jasmine.SpyObj<SelectionHandlerService>;
    let selectionServiceMock: jasmine.SpyObj<SelectionService>;
    let ellipseSelectionHelpereMock: jasmine.SpyObj<EllipseSelectionHelperService>;

    let stopManipulationSpy : jasmine.Spy<any>;
    let resizeSelectionSpy : jasmine.Spy<any>;
    //let registerMousePosSpy : jasmine.Spy<any>;
    let computeDiagonalEquation : jasmine.Spy<any>;
    let moveSelectionSpy : jasmine.Spy<any>;
    let moveIfPressLongEnoughSpy : jasmine.Spy<any>;
    let singleMoveSpy : jasmine.Spy<any>;
    let getMousePosOnDiagonalSpy: jasmine.Spy<any>;
    //let drawSelectionSpy: jasmine.Spy<any>;

    //let isClickOutsideSelectionSpy: jasmine.Spy<any>;

    beforeEach(() => {

        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        drawServiceSpy.canvasSize = {x: 0, y: 0};

        selectionHandlerMock = jasmine.createSpyObj('SelectionHandlerService', ['createMemento', 'drawSelection', 'resizeSelection']);
        ellipseSelectionHelpereMock = jasmine.createSpyObj('EllipseSelectionHelperService', ['getEllipseParam', 'drawSelectionEllipse', 'add', 'isClickOutsideSelection', 'convertToMovement', 'add', 
        'setIsSelectionBeingManipulated', 'setIsSelectionBeingManipulated', 'drawPerimeter', 'getSquareAjustedPerimeter' ]);
        selectionServiceMock = jasmine.createSpyObj('SelectionService', ['isClickOutsideSelection', 'convertToMovement', 'add', 
        'setIsSelectionBeingManipulated', 'setIsSelectionBeingManipulated', 'drawPerimeter', 'getSquareAjustedPerimeter']);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy }, 
                { provide: EllipseSelectionHandlerService, useValue: selectionHandlerMock},
                { provide: EllipseSelectionHelperService, useValue: ellipseSelectionHelpereMock },
                { provide: SelectionService, useValue: selectionServiceMock },
            ],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        canvas = canvasTestHelper.canvas;
        canvasPosition = { x: 50, y: 40 };

        service = TestBed.inject(EllipseSelectionManipulatorService);

        let dummyTime: number = 1;
        const source = interval(dummyTime);
        // tslint:disable:no-magic-numbers
        service.subscriptions[0] = source.subscribe(()=>{});
        service.subscriptions[1] = source.subscribe(()=>{});
        service.subscriptions[2] = source.subscribe(()=>{});
        service.subscriptions[3] = source.subscribe(()=>{});
        
        spyOn(canvas, 'getBoundingClientRect').and.callFake(
            jasmine
                .createSpy('getBoundingClientRect')
                .and.returnValue({ top: 1, height: 100, left: 2, width: 200, right: 202, x: canvasPosition.x, y: canvasPosition.y }),
        );

        
        stopManipulationSpy = spyOn<any>(service, 'stopManipulation').and.callThrough();
        resizeSelectionSpy = spyOn<any>(service, 'resizeSelection').and.callThrough();
        //registerMousePosSpy = spyOn<any>(service, 'registerMousePos').and.callThrough();
        computeDiagonalEquation = spyOn<any>(service, 'computeDiagonalEquation').and.callThrough();
        moveSelectionSpy = spyOn<any>(service, 'moveSelection').and.callThrough();
        moveIfPressLongEnoughSpy = spyOn<any>(service, 'moveIfPressLongEnough').and.callThrough();
        singleMoveSpy = spyOn<any>(service, 'singleMove').and.callThrough();
        getMousePosOnDiagonalSpy = spyOn<any>(service, 'getMousePosOnDiagonal').and.callThrough();
        //drawSelectionSpy = spyOn<any>(selectionHandlerMock, 'drawSelection').and.callThrough();

        
        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvas;

        mouseEvent = {
            clientX: 100,
            clientY: 100,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseDown should not call stopManipulation if mouse is click not with left button', () => {
        const dummyMouseEvent = {
            clientX: 100,
            clientY: 100,
            button: 1,
        } as MouseEvent;
        service.onMouseDown(dummyMouseEvent);
        expect(stopManipulationSpy).not.toHaveBeenCalled();
    });

    it('onMouseDown should call stopManipulation if click is outside selection', () => {
        spyOn<any>(service, 'isClickOutsideSelection').and.returnValue(true);
        service.onMouseDown(mouseEvent);
        expect(stopManipulationSpy).toHaveBeenCalled();
    });

    it('onMouseDown should call registerMousePos if click is not outside selection', () => {
        spyOn<any>(service, 'isClickOutsideSelection').and.returnValue(false);
        service.onMouseDown(mouseEvent);
        expect(computeDiagonalEquation).toHaveBeenCalled();
    });

    it('onMouseUp should set resizingMode to off', () => {
        service.onMouseUp(mouseEvent);
        expect(service.resizingMode).toEqual(ResizingMode.off);
    });

    it('onMouseMove should not call resizeSelection if mouse is click not with left button', () => {
        service.mouseDown = false;
        service.resizingMode = ResizingMode.towardsBottom;
        service.onMouseMove(mouseEvent);
        expect(resizeSelectionSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should call resizeSelection if resizingMode != off', () => {
        service.mouseDown = true;
        service.resizingMode = ResizingMode.towardsBottom;
        service.onMouseMove(mouseEvent);
        expect(resizeSelectionSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call moveSelection if resizingMode == off', () => {
        service.mouseDown = true;
        service.resizingMode = ResizingMode.off;
        service.onMouseMove(mouseEvent);
        expect(moveSelectionSpy).toHaveBeenCalled();
    });    

    it('isShiftDown should be true if event.key === Shift', () => {
        const keyboardEvent: KeyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;

        service.onKeyDown(keyboardEvent);
        expect(service.isShiftDown).toEqual(true);
    });

    it('resizeSelection should be called if isShiftDown and isSelectionBeingResizedDiagonally are true', ()=> {
        const keyboardEvent: KeyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;

        service.isShiftDown = true;
        spyOn<any>(service, 'isSelectionBeingResizedDiagonally').and.returnValue('true');
        service.onKeyDown(keyboardEvent);
        expect(resizeSelectionSpy).toHaveBeenCalled;
    });

    it('onKeyDown should call moveIfPressLongEnough if event.key === ArrowDown !arrowKeyDown[Arrow.Down]', () => {
        const keyboardEvent: KeyboardEvent = {
            key: 'ArrowDown',
        } as KeyboardEvent;

        service.onKeyDown(keyboardEvent);
        expect(moveIfPressLongEnoughSpy).toHaveBeenCalled();
    });

    it('onKeyDown should call moveIfPressLongEnough if event.key === ArrowUp !arrowKeyDown[Arrow.Up]', () => {
        const keyboardEvent: KeyboardEvent = {
            key: 'ArrowUp',
        } as KeyboardEvent;

        service.onKeyDown(keyboardEvent);
        expect(moveIfPressLongEnoughSpy).toHaveBeenCalled();
    });
    
    it('onKeyDown should call moveIfPressLongEnough if event.key === ArrowLeft !arrowKeyDown[Arrow.Left]', () => {
        const keyboardEvent: KeyboardEvent = {
            key: 'ArrowLeft',
        } as KeyboardEvent;

        service.onKeyDown(keyboardEvent);
        expect(moveIfPressLongEnoughSpy).toHaveBeenCalled();
    });

    it('onKeyDown should call moveIfPressLongEnough if event.key === ArrowRight !arrowKeyDown[Arrow.Right]', () => {
        const keyboardEvent: KeyboardEvent = {
            key: 'ArrowRight',
        } as KeyboardEvent;

        service.onKeyDown(keyboardEvent);
        expect(moveIfPressLongEnoughSpy).toHaveBeenCalled();
    });

    it('isShiftDown should be false if event.key === Shift', () => {
        const keyboardEvent: KeyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;

        service.onKeyUp(keyboardEvent);
        expect(service.isShiftDown).toEqual(false);
    });

    it('resizeSelection should be called if isShiftDown and isSelectionBeingResizedDiagonally are true', ()=> {
        const keyboardEvent: KeyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;

        service.isShiftDown = true;
        spyOn<any>(service, 'isSelectionBeingResizedDiagonally').and.returnValue('true');
        service.onKeyUp(keyboardEvent);
        expect(resizeSelectionSpy).toHaveBeenCalled;
    });

    it('onKeyDown should call singleMove if event.key === ArrowDown, ()', ()=> {
        const keyboardEvent: KeyboardEvent = {
            key: 'ArrowDown',
        } as KeyboardEvent;
    
        service.onKeyUp(keyboardEvent);
        expect(singleMoveSpy).toHaveBeenCalled();
    });
    
    it('onKeyDown should call singleMove if event.key === ArrowUp', () => {
        const keyboardEvent: KeyboardEvent = {
            key: 'ArrowUp',
        } as KeyboardEvent;

        service.onKeyUp(keyboardEvent);
        expect(singleMoveSpy).toHaveBeenCalled();
    });

    it('onKeyDown should call singleMove if event.key === ArrowLeft, () =>',()=> {
        const keyboardEvent: KeyboardEvent = {
            key: 'ArrowLeft',
        } as KeyboardEvent;

        service.onKeyUp(keyboardEvent);
        expect(singleMoveSpy).toHaveBeenCalled();
    });
    
    it('onKeyDown should call singleMove if event.key === ArrowRight', () => {
        const keyboardEvent: KeyboardEvent = {
            key: 'ArrowRight',
        } as KeyboardEvent;

        service.onKeyUp(keyboardEvent);
        expect(singleMoveSpy).toHaveBeenCalled();
    });

    it('initialize should set values correctly', () => {
        let topLeft = {x:5, y:7};
        let bottomRight = {x:10, y:9};
        service.initialize(topLeft, bottomRight);
        expect(service.topLeft.x).toEqual(topLeft.x);
        expect(service.topLeft.y).toEqual(topLeft.y);
        expect(service.bottomRight.x).toEqual(bottomRight.x);
        expect(service.bottomRight.y).toEqual(bottomRight.y);
    });

    it('resizeSelction should call getMousePosOnDiagonal if shiftIsDown and isSelectionBeingResizedDiagonally are true', () => {
        let newPos = {x:5, y:7};
        let resizingMode = ResizingMode.towardsBottom;
        service.isShiftDown = true;
        spyOn<any>(service, 'isSelectionBeingResizedDiagonally').and.returnValue('true');
        service.resizeSelection(newPos, resizingMode);
        expect(getMousePosOnDiagonalSpy).toHaveBeenCalled();
    });

    it('resizeSelction should update bottomRight and isReversed correctly if direction === ResizingMode.towardsBottom', () => {
        let newPos = {x:5, y:7};
        let resizingMode = ResizingMode.towardsBottom;
        let bottomRight = {x: 10, y:15};
        service.bottomRight = bottomRight;
        service.resizeSelection(newPos, resizingMode);
        expect(service.bottomRight.y).toEqual(newPos.y);
        expect(service.isReversedY).toEqual( newPos.y < service.topLeft.y);
    });

    it('resizeSelction should update topLeft and isReversed correctly if direction === ResizingMode.towardsTop', () => {
        let newPos = {x:5, y:7};
        let resizingMode = ResizingMode.towardsTop;
        let topLeft = {x: 10, y:15};
        service.topLeft = topLeft;
        service.resizeSelection(newPos, resizingMode);
        expect(service.topLeft.y).toEqual(newPos.y);
        expect(service.isReversedY).toEqual( newPos.y > service.bottomRight.y);
    });

    it('resizeSelction should update bottomRight and isReversed correctly if direction === ResizingMode.towardsRight', () => {
        let newPos = {x:5, y:7};
        let resizingMode = ResizingMode.towardsRight;
        let bottomRight = {x: 10, y:15};
        service.bottomRight = bottomRight;
        service.resizeSelection(newPos, resizingMode);
        expect(service.bottomRight.x).toEqual(newPos.x);
        expect(service.isReversedX).toEqual( newPos.x < service.topLeft.x);
    });

    it('resizeSelction should update topLeft and isReversed correctly if direction === ResizingMode.towardsLeft', () => {
        let newPos = {x:5, y:7};
        let resizingMode = ResizingMode.towardsLeft;
        let topLeft = {x: 10, y:15};
        service.topLeft = topLeft;
        service.resizeSelection(newPos, resizingMode);
        expect(service.topLeft.x).toEqual(newPos.x);
        expect(service.isReversedX).toEqual( newPos.x > service.bottomRight.x);
    });

    it('stopManipulation should call createMemento if needDrawSelection is true', () => {
        service.stopManipulation(true);
        expect(selectionHandlerMock.createMemento).toHaveBeenCalled();
    });

    it('stopManipulation should call drawSelection if needDrawSelection is true', () => {
        service.stopManipulation(true);
        expect(selectionHandlerMock.drawSelection).toHaveBeenCalled();
    });

    it('stopManipulation should not call drawSelection if needDrawSelection is false', () => {
        service.stopManipulation(false);
        expect(selectionHandlerMock.drawSelection).not.toHaveBeenCalled();
    });

    it('startMovingSelection should set isContinousMovementByKeyboardOn of the correct arrowIndex to true', () => {
        const movement: Vec2 = {x:5, y:7};
        const arrowIndex: number =1;
        service.startMovingSelectionContinous(movement, arrowIndex);
        expect(service.isContinousMovementByKeyboardOn[arrowIndex]).toEqual(true);
    });

    it('moveIfPressedLongEnough should set arrowKeyDown of the correct arrowIndex to true', () => {
        const movement: Vec2 = {x:5, y:7};
        const arrowIndex: number =1;
        service.moveIfPressLongEnough(movement, arrowIndex);
        expect(service.arrowKeyDown[arrowIndex]).toEqual(true);
    });

    it('stopMovingContinuous should set isContinousMovementByKeyboardOn of the correct arrowIndex to false', () => {
        const arrowIndex: number =1;
        service.isContinousMovementByKeyboardOn[arrowIndex] = true;
        service.stopContinuousMovement(arrowIndex);
        expect(service.isContinousMovementByKeyboardOn[arrowIndex]).toEqual(false);
    });

    it('singleMove should call stopContinuousMovement with correct arrowIndex', () => {
        const movement: Vec2 = {x:5, y:7};
        const arrowIndex: number =1;
        service.isContinousMovementByKeyboardOn[arrowIndex] = true;
        let stopContinuousMovementSpy : jasmine.Spy<any> = spyOn<any>(service, 'stopContinuousMovement').and.callThrough();
        service.singleMove(arrowIndex, movement);
        expect(stopContinuousMovementSpy).toHaveBeenCalledWith(arrowIndex);
    });

    it('addMovementToPosition should call add 3 times if isMouseMovement is true ', () => {
        let mouseMovement = {x:10, y:11};
        service.addMovementToPositions(mouseMovement, true);
        expect(ellipseSelectionHelpereMock.add).toHaveBeenCalledTimes(3);
    });

    it('registerMousePos should update mouseDownLastPos correctly if isMouseDown is true ', () => {
        let mouseDownLastPos: Vec2 = {x:1, y:2};
        let mouseMovement: Vec2 = {x:10, y:11};
        service.mouseDownLastPos = mouseDownLastPos;
        service.registerMousePos(mouseMovement, true);
        expect(service.mouseDownLastPos).toEqual(mouseMovement);
    });

    it('computeDiagonalEquation should update diagonal slope correctly if ResizingMode is towardsBottomRight ', () => {
        let topLeft = {x: 3, y:4};
        let bottomRight = {x: 7, y:6};
        service.topLeft = topLeft;
        service.bottomRight = bottomRight;
        service.resizingMode = ResizingMode.towardsBottomRight;
        const deltaY = topLeft.y - bottomRight.y;
        const deltaX = bottomRight.x - topLeft.x;
        const diagonalSlope = deltaY / deltaX;
        service.computeDiagonalEquation();
        expect(service.diagonalSlope = -diagonalSlope);
    });

    it('getMousePosOnDiagonal should output a position that belongs to the diagonal', () => {
        let mousePos: Vec2 = {x: 3, y:4};
        let diagonalSlope: number =1.2;
        let yIntercept: number =2;        
        service.diagonalSlope = diagonalSlope;
        service.diagonalYIntercept = yIntercept;
       
        const output: Vec2 = service.getMousePosOnDiagonal(mousePos);
        expect(output).toEqual({x: mousePos.x, y: mousePos.x * diagonalSlope + yIntercept});
    });

    it('resetProperties should also reset isReversedX and isReversedY', () => {
        service.isReversedY = service.isReversedX = true;
        service.resetProperties();
        expect(service.isReversedY).toEqual(false);
        expect(service.isReversedY).toEqual(false);
    });

    it('creating a memento then restoring to that memento should not change any property', () => {
        service.diagonalSlope = 10;
        service.diagonalYIntercept = 10;
        service.topLeft = { x: 10, y: 10 };
        service.bottomRight = { x: 10, y: 10 };
        service.mouseLastPos = { x: 10, y: 10 };
        service.mouseDownLastPos = { x: 10, y: 10 };
        service.resizingMode = ResizingMode.towardsBottom;
        service.mouseDown = true;
        service.isShiftDown = true;
        service.isReversedY = true;
        service.isReversedX = true;

        const memento :ManipulatorMemento = service.createMemento();

        service.resetProperties();
        
        service.restoreFromMemento(memento);

        expect(service.diagonalSlope).toEqual(10);
        expect(service.diagonalYIntercept).toEqual(10);
        expect(service.topLeft).toEqual({ x: 10, y: 10 });
        expect(service.bottomRight).toEqual({ x: 10, y: 10 });
        expect(service.isReversedY).toEqual(true);
        expect(service.isReversedY).toEqual(true);
    });

    it('isClickOutsideSelection should isClickOutsideSelection from SelectionService', () => {
        service.isClickOutsideSelection(mouseEvent);
        expect(ellipseSelectionHelpereMock.isClickOutsideSelection).toHaveBeenCalled();
    });

    it('isAnArrowKeyPressed should return true if an arrow key is pressed', () => {
        const keyboardEvent: KeyboardEvent = {
            key: 'ArrowLeft',
        } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        let isPressed: boolean = service.isAnArrowKeyPressed();
        expect(isPressed).toEqual(true);
    });
});
