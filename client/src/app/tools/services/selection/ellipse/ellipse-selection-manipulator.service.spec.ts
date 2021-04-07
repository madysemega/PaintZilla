import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { ManipulatorMemento } from '@app/app/classes/manipulator-memento';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ResizingMode } from '@app/tools/services/selection/selection-base/resizing-mode';
import { SelectionHandlerService } from '@app/tools/services/selection/selection-base/selection-handler.service';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { interval } from 'rxjs';
import { EllipseSelectionHandlerService } from './ellipse-selection-handler-service';
import { EllipseSelectionHelperService } from './ellipse-selection-helper.service';
import { EllipseSelectionManipulatorService } from './ellipse-selection-manipulator.service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-empty
// tslint:disable:max-file-line-count
// tslint:disable:no-unused-expression

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
    let ellipseSelectionHelperMock: jasmine.SpyObj<EllipseSelectionHelperService>;
    let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;

    let stopManipulationSpy: jasmine.Spy<any>;
    let resizeSelectionSpy: jasmine.Spy<any>;
    let computeDiagonalEquation: jasmine.Spy<any>;
    let moveSelectionSpy: jasmine.Spy<any>;
    let moveIfPressLongEnoughSpy: jasmine.Spy<any>;
    let singleMoveSpy: jasmine.Spy<any>;
    let getMousePosOnDiagonalSpy: jasmine.Spy<any>;
    let registerActionSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        drawServiceSpy.canvasSize = { x: 0, y: 0 };

        selectionHandlerMock = jasmine.createSpyObj('SelectionHandlerService', [
            'createMemento',
            'drawSelection',
            'resizeSelection',
            'select',
            'makeWhiteBehindSelection',
        ]);
        ellipseSelectionHelperMock = jasmine.createSpyObj('EllipseSelectionHelperService', [
            'getEllipseParam',
            'drawSelectionEllipse',
            'add',
            'isClickOutsideSelection',
            'convertToMovement',
            'add',
            'setIsSelectionBeingManipulated',
            'setIsSelectionBeingManipulated',
            'drawPerimeter',
            'getSquareAjustedPerimeter',
            'resetManipulatorProperties',
            'moveAlongTheGrid',
            'addInPlace',
            'sub',
        ]);

        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);

        TestBed.configureTestingModule({
            imports: [HotkeyModule.forRoot()],
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: EllipseSelectionHandlerService, useValue: selectionHandlerMock },
                { provide: EllipseSelectionHelperService, useValue: ellipseSelectionHelperMock },
                { provide: HotkeysService, useValue: hotkeysServiceStub },
            ],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        canvas = canvasTestHelper.canvas;
        canvasPosition = { x: 50, y: 40 };

        service = TestBed.inject(EllipseSelectionManipulatorService);

        const dummyTime = 1;
        const source = interval(dummyTime);
        // tslint:disable:no-magic-numbers
        service.subscriptions[0] = source.subscribe(() => {});
        service.subscriptions[1] = source.subscribe(() => {});
        service.subscriptions[2] = source.subscribe(() => {});
        service.subscriptions[3] = source.subscribe(() => {});

        spyOn(canvas, 'getBoundingClientRect').and.callFake(
            jasmine
                .createSpy('getBoundingClientRect')
                .and.returnValue({ top: 1, height: 100, left: 2, width: 200, right: 202, x: canvasPosition.x, y: canvasPosition.y }),
        );

        stopManipulationSpy = spyOn<any>(service, 'stopManipulation').and.callThrough();
        resizeSelectionSpy = spyOn<any>(service, 'resizeSelection').and.callThrough();
        computeDiagonalEquation = spyOn<any>(service, 'computeDiagonalEquation').and.callThrough();
        moveSelectionSpy = spyOn<any>(service, 'moveSelection').and.callThrough();
        moveIfPressLongEnoughSpy = spyOn<any>(service, 'moveIfPressLongEnough').and.callThrough();
        singleMoveSpy = spyOn<any>(service, 'singleMove').and.callThrough();
        getMousePosOnDiagonalSpy = spyOn<any>(service, 'getMousePosOnDiagonal').and.callThrough();
        registerActionSpy = spyOn<any>(service, 'registerAction').and.callThrough();

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

    it('resizeSelection should be called if isShiftDown and isSelectionBeingResizedDiagonally are true', () => {
        const keyboardEvent: KeyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;

        service.isShiftDown = true;
        spyOn<any>(service, 'isSelectionBeingResizedDiagonally').and.returnValue('true');
        service.onKeyDown(keyboardEvent);
        expect(resizeSelectionSpy).toHaveBeenCalled();
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

    it('resizeSelection should be called if isShiftDown and isSelectionBeingResizedDiagonally are true', () => {
        const keyboardEvent: KeyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;

        service.isShiftDown = true;
        spyOn<any>(service, 'isSelectionBeingResizedDiagonally').and.returnValue('true');
        service.onKeyUp(keyboardEvent);
        expect(resizeSelectionSpy).toHaveBeenCalled();
    });

    it('onKeyDown should call singleMove if event.key === ArrowDown, ()', () => {
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

    it('onKeyDown should call singleMove if event.key === ArrowLeft, () =>', () => {
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
        const topLeft = { x: 5, y: 7 };
        const bottomRight = { x: 10, y: 9 };
        const vertices: Vec2[] = [];
        vertices.push(topLeft, bottomRight);
        service.initialize(vertices);
        expect(service.topLeft.x).toEqual(topLeft.x);
        expect(service.topLeft.y).toEqual(topLeft.y);
        expect(service.bottomRight.x).toEqual(bottomRight.x);
        expect(service.bottomRight.y).toEqual(bottomRight.y);
    });

    it('resizeSelction should call getMousePosOnDiagonal if shiftIsDown and isSelectionBeingResizedDiagonally are true', () => {
        const newPos = { x: 5, y: 7 };
        const resizingMode = ResizingMode.towardsBottom;
        service.isShiftDown = true;
        spyOn<any>(service, 'isSelectionBeingResizedDiagonally').and.returnValue('true');
        service.resizeSelection(newPos, resizingMode);
        expect(getMousePosOnDiagonalSpy).toHaveBeenCalled();
    });

    it('resizeSelction should update bottomRight and isReversed correctly if direction === ResizingMode.towardsBottom', () => {
        const newPos = { x: 5, y: 7 };
        const resizingMode = ResizingMode.towardsBottom;
        const bottomRight = { x: 10, y: 15 };
        service.bottomRight = bottomRight;
        service.resizeSelection(newPos, resizingMode);
        expect(service.bottomRight.y).toEqual(newPos.y);
        expect(service.isReversedY).toEqual(newPos.y < service.topLeft.y);
    });

    it('resizeSelction should update topLeft and isReversed correctly if direction === ResizingMode.towardsTop', () => {
        const newPos = { x: 5, y: 7 };
        const resizingMode = ResizingMode.towardsTop;
        const topLeft = { x: 10, y: 15 };
        service.topLeft = topLeft;
        service.resizeSelection(newPos, resizingMode);
        expect(service.topLeft.y).toEqual(newPos.y);
        expect(service.isReversedY).toEqual(newPos.y > service.bottomRight.y);
    });

    it('resizeSelction should update bottomRight and isReversed correctly if direction === ResizingMode.towardsRight', () => {
        const newPos = { x: 5, y: 7 };
        const resizingMode = ResizingMode.towardsRight;
        const bottomRight = { x: 10, y: 15 };
        service.bottomRight = bottomRight;
        service.resizeSelection(newPos, resizingMode);
        expect(service.bottomRight.x).toEqual(newPos.x);
        expect(service.isReversedX).toEqual(newPos.x < service.topLeft.x);
    });

    it('resizeSelction should update topLeft and isReversed correctly if direction === ResizingMode.towardsLeft', () => {
        const newPos = { x: 5, y: 7 };
        const resizingMode = ResizingMode.towardsLeft;
        const topLeft = { x: 10, y: 15 };
        service.topLeft = topLeft;
        service.resizeSelection(newPos, resizingMode);
        expect(service.topLeft.x).toEqual(newPos.x);
        expect(service.isReversedX).toEqual(newPos.x > service.bottomRight.x);
    });

    it('stopManipulation should call createMemento if needDrawSelection and drawSelection from SelectionHandler are true', () => {
        selectionHandlerMock.drawSelection.and.returnValue(true);
        service.stopManipulation(true);
        expect(selectionHandlerMock.createMemento).toHaveBeenCalled();
    });

    it('stopManipulation should not call createMemento if needDrawSelection and drawSelection from SelectionHandler are true', () => {
        selectionHandlerMock.drawSelection.and.returnValue(false);
        service.stopManipulation(true);
        expect(selectionHandlerMock.createMemento).not.toHaveBeenCalled();
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
        const movement: Vec2 = { x: 5, y: 7 };
        const arrowIndex = 1;
        service.startMovingSelectionContinous(movement, arrowIndex);
        expect(service.isContinousMovementByKeyboardOn[arrowIndex]).toEqual(true);
    });

    it('moveIfPressedLongEnough should set arrowKeyDown of the correct arrowIndex to true', () => {
        const movement: Vec2 = { x: 5, y: 7 };
        const arrowIndex = 1;
        service.moveIfPressLongEnough(movement, arrowIndex);
        expect(service.arrowKeyDown[arrowIndex]).toEqual(true);
    });

    it('stopMovingContinuous should set isContinousMovementByKeyboardOn of the correct arrowIndex to false', () => {
        const arrowIndex = 1;
        service.isContinousMovementByKeyboardOn[arrowIndex] = true;
        service.stopContinuousMovement(arrowIndex);
        expect(service.isContinousMovementByKeyboardOn[arrowIndex]).toEqual(false);
    });

    it('singleMove should call stopContinuousMovement with correct arrowIndex', () => {
        const movement: Vec2 = { x: 5, y: 7 };
        const arrowIndex = 1;
        service.isContinousMovementByKeyboardOn[arrowIndex] = true;
        const stopContinuousMovementSpy: jasmine.Spy<any> = spyOn<any>(service, 'stopContinuousMovement').and.callThrough();
        service.singleMove(arrowIndex, movement);
        expect(stopContinuousMovementSpy).toHaveBeenCalledWith(arrowIndex);
    });

    it('addMovementToPosition should call add 3 times if isMouseMovement is true ', () => {
        const mouseMovement = { x: 10, y: 11 };
        service.addMovementToPositions(mouseMovement, true);
        expect(ellipseSelectionHelperMock.addInPlace).toHaveBeenCalledTimes(3);
    });

    it('addMovementToPosition should call add 3 times if isMouseMovement is true even if magnetism is activated ', () => {
        const mouseMovement = { x: 10, y: 11 };
        service.isMagnetismActivated = true;
        service.addMovementToPositions(mouseMovement, true);
        expect(ellipseSelectionHelperMock.addInPlace).toHaveBeenCalledTimes(3);
    });

    it('registerMousePos should update mouseDownLastPos correctly if isMouseDown is true ', () => {
        const mouseDownLastPos: Vec2 = { x: 1, y: 2 };
        const mouseMovement: Vec2 = { x: 10, y: 11 };
        service.mouseDownLastPos = mouseDownLastPos;
        service.registerMousePos(mouseMovement, true);
        expect(service.mouseDownLastPos).toEqual(mouseMovement);
    });

    it('computeDiagonalEquation should update diagonal slope correctly if ResizingMode is towardsBottomRight ', () => {
        const topLeft = { x: 3, y: 4 };
        const bottomRight = { x: 7, y: 6 };
        service.topLeft = topLeft;
        service.bottomRight = bottomRight;
        service.resizingMode = ResizingMode.towardsBottomRight;
        const deltaY = topLeft.y - bottomRight.y;
        const deltaX = bottomRight.x - topLeft.x;
        const diagonalSlope = deltaY / deltaX;
        service.computeDiagonalEquation();
        expect(service.diagonalSlope).toEqual(-diagonalSlope);
    });

    it('getMousePosOnDiagonal should output a position that belongs to the diagonal', () => {
        const mousePos: Vec2 = { x: 3, y: 4 };
        const diagonalSlope = 1.2;
        const yIntercept = 2;
        service.diagonalSlope = diagonalSlope;
        service.diagonalYIntercept = yIntercept;

        const output: Vec2 = service.getMousePosOnDiagonal(mousePos);
        expect(output).toEqual({ x: mousePos.x, y: mousePos.x * diagonalSlope + yIntercept });
    });

    it('resetProperties should also reset isReversedX and isReversedY', () => {
        service.resetProperties();
        expect(ellipseSelectionHelperMock.resetManipulatorProperties).toHaveBeenCalledWith(service);
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

        const memento: ManipulatorMemento = service.createMemento();

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
        expect(ellipseSelectionHelperMock.isClickOutsideSelection).toHaveBeenCalled();
    });

    it('isAnArrowKeyPressed should return true if an arrow key is pressed', () => {
        const keyboardEvent: KeyboardEvent = {
            key: 'ArrowLeft',
        } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        const isPressed: boolean = service.isAnArrowKeyPressed();
        expect(isPressed).toEqual(true);
    });

    it('delete should register an action in case white fill is applied', () => {
        (selectionHandlerMock.makeWhiteBehindSelection as jasmine.Spy<any>).and.returnValue(true);
        service.delete();
        expect(registerActionSpy).toHaveBeenCalled();
    });

    it('delete should not register an action in case white fill is not applied', () => {
        (selectionHandlerMock.makeWhiteBehindSelection as jasmine.Spy<any>).and.returnValue(false);
        service.delete();
        expect(registerActionSpy).not.toHaveBeenCalled();
    });
});
