import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { EllipseSelectionHelperService } from '@app/tools/services/selection/ellipse/ellipse-selection-helper.service';
import { EllipseSelectionManipulatorService } from '@app/tools/services/selection/ellipse/ellipse-selection-manipulator.service';
import { SelectionHelperService } from '@app/tools/services/selection/selection-base/selection-helper.service';
import { BehaviorSubject } from 'rxjs';

import { EllipseSelectionCreatorService } from './ellipse-selection-creator.service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-empty
// tslint:disable:max-file-line-count
describe('EllipseSelectionToolService', () => {
    let service: EllipseSelectionCreatorService;

    let mouseEvent: MouseEvent;
    let keyboardEvent: KeyboardEvent;
    let canvasTestHelper: CanvasTestHelper;
    let canvasPosition: Vec2;
    let canvas: HTMLCanvasElement;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let selectionServiceMock: jasmine.SpyObj<SelectionHelperService>;
    let ellipseSelectionHelperMock: jasmine.SpyObj<EllipseSelectionHelperService>;
    let ellipseSelectionManipulatorMock: EllipseSelectionManipulatorService;

    let isSelectionBeingManipulatedSpy: jasmine.Spy<any>;
    let registerMousePositionSpy: jasmine.Spy<any>;
    let startPointIsFarEnoughFromSpy: jasmine.Spy<any>;
    let createSelectionSpy: jasmine.Spy<any>;
    let resetPropertiesSpy: jasmine.Spy<any>;
    let drawSelectionOutlineSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setCursorType']);
        drawServiceSpy.canvasSize = { x: 1000, y: 500 };

        ellipseSelectionManipulatorMock = jasmine.createSpyObj('EllipseSelectionManipulatorService', [
            'onKeyDown',
            'onKeyUp',
            'onMouseDown',
            'onMouseMove',
            'onMouseUp',
            'initialize',
            'stopManipulation',
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
            'getSquareAdjustedPerimeter',
        ]);
        selectionServiceMock = jasmine.createSpyObj('SelectionService', [
            'isClickOutsideSelection',
            'convertToMovement',
            'add',
            'setIsSelectionBeingManipulated',
            'setIsSelectionBeingManipulated',
            'drawPerimeter',
            'getSquareAdjustedPerimeter',
        ]);

        ellipseSelectionHelperMock.isSelectionBeingManipulated = new BehaviorSubject(true);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: EllipseSelectionHelperService, useValue: ellipseSelectionHelperMock },
                { provide: SelectionHelperService, useValue: selectionServiceMock },
                { provide: EllipseSelectionManipulatorService, useValue: ellipseSelectionManipulatorMock },
            ],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        canvas = canvasTestHelper.canvas;
        canvasPosition = { x: 50, y: 40 };

        service = TestBed.inject(EllipseSelectionCreatorService);

        spyOn(canvas, 'getBoundingClientRect').and.callFake(
            jasmine.createSpy('getBoundingClientRect').and.returnValue({
                top: 1,
                height: drawServiceSpy.canvasSize.y,
                left: 2,
                width: drawServiceSpy.canvasSize.x,
                right: 202,
                x: canvasPosition.x,
                y: canvasPosition.y,
            }),
        );

        isSelectionBeingManipulatedSpy = spyOn<any>(service, 'isSelectionBeingManipulated').and.callThrough();
        registerMousePositionSpy = spyOn<any>(service, 'registerMousePosition').and.callThrough();
        startPointIsFarEnoughFromSpy = spyOn<any>(service, 'startPointIsFarEnoughFrom').and.callThrough();
        createSelectionSpy = spyOn<any>(service, 'createSelection').and.callThrough();
        resetPropertiesSpy = spyOn<any>(service, 'resetProperties').and.callThrough();
        drawSelectionOutlineSpy = spyOn<any>(service, 'drawSelectionOutline').and.callThrough();

        /* resizeSelectionSpy = spyOn<any>(service, 'resizeSelection').and.callThrough();
        moveSelectionSpy = spyOn<any>(service, 'moveSelection').and.callThrough();
        moveIfPressLongEnoughSpy = spyOn<any>(service, 'moveIfPressLongEnough').and.callThrough();
        singleMoveSpy = spyOn<any>(service, 'singleMove').and.callThrough();
        getMousePosOnDiagonalSpy = spyOn<any>(service, 'getMousePosOnDiagonal').and.callThrough();
*/

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

    it('onMouseDown should delegate to SelectionManipulator if isSelectionBeingManipulated returns true', () => {
        isSelectionBeingManipulatedSpy.and.returnValue(true);
        service.onMouseDown(mouseEvent);
        expect(ellipseSelectionManipulatorMock.onMouseDown).toHaveBeenCalled();
    });

    it('onMouseDown should not delegate to SelectionManipulator if isSelectionBeingManipulated returns false', () => {
        isSelectionBeingManipulatedSpy.and.returnValue(false);
        service.onMouseDown(mouseEvent);
        expect(ellipseSelectionManipulatorMock.onMouseDown).not.toHaveBeenCalled();
    });

    it('onMouseMove should delegate to SelectionManipulator if isSelectionBeingManipulated returns true', () => {
        isSelectionBeingManipulatedSpy.and.returnValue(true);
        service.onMouseMove(mouseEvent);
        expect(ellipseSelectionManipulatorMock.onMouseMove).toHaveBeenCalled();
    });

    it('onMouseMove should not delegate to SelectionManipulator if isSelectionBeingManipulated returns false', () => {
        isSelectionBeingManipulatedSpy.and.returnValue(false);
        service.onMouseMove(mouseEvent);
        expect(ellipseSelectionManipulatorMock.onMouseMove).not.toHaveBeenCalled();
    });

    it('onMouseMove should register the mouse position if mouse left button is clicked and isSelectionBeingManipulated returns false', () => {
        isSelectionBeingManipulatedSpy.and.returnValue(false);
        service.mouseDown = true;
        service.onMouseMove(mouseEvent);
        expect(registerMousePositionSpy).toHaveBeenCalled();
    });

    it('onMouseUp should delegate to SelectionManipulator if isSelectionBeingManipulated returns true', () => {
        isSelectionBeingManipulatedSpy.and.returnValue(true);
        service.onMouseUp(mouseEvent);
        expect(ellipseSelectionManipulatorMock.onMouseUp).toHaveBeenCalled();
    });

    it('onMouseUp should not delegate to SelectionManipulator if isSelectionBeingManipulated returns false', () => {
        isSelectionBeingManipulatedSpy.and.returnValue(false);
        service.onMouseUp(mouseEvent);
        expect(ellipseSelectionManipulatorMock.onMouseUp).not.toHaveBeenCalled();
    });

    it('onMouseMove should create a selection if mouse left button is clicked and start point \
    is far enough from the mouse position and isSelectionBeingManipulated returns false', () => {
        isSelectionBeingManipulatedSpy.and.returnValue(false);
        startPointIsFarEnoughFromSpy.and.returnValue(true);
        service.mouseDown = true;
        service.onMouseUp(mouseEvent);
        expect(createSelectionSpy).toHaveBeenCalled();
    });

    it('pressing Escape should reset properties ', () => {
        keyboardEvent = {
            key: 'Escape',
        } as KeyboardEvent;
        service.onKeyDown(keyboardEvent);
        expect(resetPropertiesSpy).toHaveBeenCalled();
    });

    it('onKeyDown should delegate to SelectionManipulator if isSelectionBeingManipulated returns true', () => {
        keyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;
        isSelectionBeingManipulatedSpy.and.returnValue(true);
        service.onKeyDown(keyboardEvent);
        expect(ellipseSelectionManipulatorMock.onKeyDown).toHaveBeenCalled();
    });

    it('pressing shift should set isShiftDown to true if isSelectionBeingManipulated returns false', () => {
        keyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;
        isSelectionBeingManipulatedSpy.and.returnValue(false);
        service.onKeyDown(keyboardEvent);
        expect(service.isShiftDown).toEqual(true);
    });

    it('if shift and mouse left button are down the selection outline should be redrawn \
    if isSelectionBeingManipulated returns false', () => {
        keyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;
        service.isShiftDown = true;
        service.mouseDown = true;
        isSelectionBeingManipulatedSpy.and.returnValue(false);
        service.onKeyDown(keyboardEvent);
        expect(drawSelectionOutlineSpy).toHaveBeenCalled();
    });

    it('if shift is not down and mouse left button is down \
     the selection outline should not be redrawn if isSelectionBeingManipulated returns false', () => {
        keyboardEvent = {
            key: 'm',
        } as KeyboardEvent;
        service.isShiftDown = false;
        service.mouseDown = true;
        isSelectionBeingManipulatedSpy.and.returnValue(false);
        service.onKeyDown(keyboardEvent);
        expect(drawSelectionOutlineSpy).not.toHaveBeenCalled();
    });

    it('if shift is not down and mouse left button is down the selection outline \
     should not be redrawn if isSelectionBeingManipulated returns false', () => {
        keyboardEvent = {
            key: 'm',
        } as KeyboardEvent;
        service.isShiftDown = false;
        service.mouseDown = true;
        isSelectionBeingManipulatedSpy.and.returnValue(true);
        service.onKeyDown(keyboardEvent);
        expect(drawSelectionOutlineSpy).not.toHaveBeenCalled();
    });

    it('onKeyUp should delegate to SelectionManipulator if isSelectionBeingManipulated returns true', () => {
        keyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;
        isSelectionBeingManipulatedSpy.and.returnValue(true);
        service.onKeyUp(keyboardEvent);
        expect(ellipseSelectionManipulatorMock.onKeyUp).toHaveBeenCalled();
    });

    it('releasing shift should set isShiftDown to true if isSelectionBeingManipulated returns false', () => {
        keyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;
        isSelectionBeingManipulatedSpy.and.returnValue(false);
        service.onKeyUp(keyboardEvent);
        expect(service.isShiftDown).toEqual(false);
    });

    it('if shift is released while mouse left button is down the selection outline should be redrawn \
    if isSelectionBeingManipulated returns false', () => {
        keyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;
        service.mouseDown = true;
        isSelectionBeingManipulatedSpy.and.returnValue(false);
        service.onKeyUp(keyboardEvent);
        expect(drawSelectionOutlineSpy).toHaveBeenCalled();
    });

    it('if shift is not released while mouse left button is down the selection outline should not be redrawn \
    if isSelectionBeingManipulated returns false', () => {
        keyboardEvent = {
            key: 'm',
        } as KeyboardEvent;
        service.mouseDown = true;
        isSelectionBeingManipulatedSpy.and.returnValue(false);
        service.onKeyUp(keyboardEvent);
        expect(drawSelectionOutlineSpy).not.toHaveBeenCalled();
    });

    it('if shift is not released while mouse left button is down the selection outline should not be redrawn \
    if isSelectionBeingManipulated returns false', () => {
        keyboardEvent = {
            key: 'm',
        } as KeyboardEvent;
        service.mouseDown = true;
        isSelectionBeingManipulatedSpy.and.returnValue(true);
        service.onKeyUp(keyboardEvent);
        expect(drawSelectionOutlineSpy).not.toHaveBeenCalled();
    });

    it('when selecting tool the cursor type should be set to crosshair', () => {
        service.onToolSelect();
        expect(drawServiceSpy.setCursorType).toHaveBeenCalledWith(CursorType.CROSSHAIR);
    });

    it('onToolDeselect should reset properties', () => {
        service.onToolDeselect();
        expect(resetPropertiesSpy).toHaveBeenCalled();
    });

    it('if shift is down when creating a selection the endpoint should be adjusted with getSquareAjustedPerimeter', () => {
        const startPoint: Vec2 = { x: 5, y: 7 };
        const endPoint: Vec2 = { x: 10, y: 9 };
        service.isShiftDown = true;
        ellipseSelectionHelperMock.getSquareAdjustedPerimeter.and.returnValue({ x: 0, y: 0 });
        service.createSelection(startPoint, endPoint);
        expect(ellipseSelectionHelperMock.getSquareAdjustedPerimeter).toHaveBeenCalled();
    });

    it('if shift is not down when creating a selection the endpoint should not be adjusted with getSquareAjustedPerimeter', () => {
        const startPoint: Vec2 = { x: 5, y: 7 };
        const endPoint: Vec2 = { x: 10, y: 9 };
        service.isShiftDown = false;
        ellipseSelectionHelperMock.getSquareAdjustedPerimeter.and.returnValue({ x: 0, y: 0 });
        service.createSelection(startPoint, endPoint);
        expect(ellipseSelectionHelperMock.getSquareAdjustedPerimeter).not.toHaveBeenCalled();
    });

    it('stop manipulating selection should delegate to EllipseSelectionManipulator and tell it to draw the selection \
     if isSelectionBeingManipulatedSpy returns true;', () => {
        isSelectionBeingManipulatedSpy.and.returnValue(true);
        service.stopManipulatingSelection();
        expect(ellipseSelectionManipulatorMock.stopManipulation).toHaveBeenCalledWith(true);
    });

    it('stop manipulating selection should delegate to EllipseSelectionManipulator and tell it not to draw \
    if isSelectionBeingManipulatedSpy returns false;', () => {
        isSelectionBeingManipulatedSpy.and.returnValue(false);
        service.stopManipulatingSelection();
        expect(ellipseSelectionManipulatorMock.stopManipulation).toHaveBeenCalledWith(false);
    });

    it('when converting to top left and bottom right x components should be exchanged if startPoint.x > endPoint.x', () => {
        const startPoint: Vec2 = { x: 11, y: 7 };
        const endPoint: Vec2 = { x: 10, y: 9 };
        const oldStartPointX = startPoint.x;
        const oldEndPointX = endPoint.x;

        service.convertToTopLeftAndBottomRight(startPoint, endPoint);

        expect(endPoint.x).toEqual(oldStartPointX);

        expect(startPoint.x).toEqual(oldEndPointX);
    });

    it('when converting to top left and bottom right x components should not be exchanged if startPoint.x <= endPoint.x', () => {
        const startPoint: Vec2 = { x: 9, y: 7 };
        const endPoint: Vec2 = { x: 10, y: 9 };

        const oldStartPointX = startPoint.x;
        const oldEndPointX = endPoint.x;

        service.convertToTopLeftAndBottomRight(startPoint, endPoint);

        expect(endPoint.x).toEqual(oldEndPointX);
        expect(startPoint.x).toEqual(oldStartPointX);
    });

    it('when converting to top left and bottom right y components should be exchanged if startPoint.y > endPoint.y', () => {
        const startPoint: Vec2 = { x: 11, y: 14 };
        const endPoint: Vec2 = { x: 10, y: 9 };
        const oldStartPointY = startPoint.y;
        const oldEndPointY = endPoint.y;

        service.convertToTopLeftAndBottomRight(startPoint, endPoint);

        expect(endPoint.y).toEqual(oldStartPointY);

        expect(startPoint.y).toEqual(oldEndPointY);
    });

    it('when converting to top left and bottom right y components should not be exchanged if startPoint.y <= endPoint.y', () => {
        const startPoint: Vec2 = { x: 9, y: 7 };
        const endPoint: Vec2 = { x: 10, y: 9 };

        const oldStartPointY = startPoint.y;
        const oldEndPointY = endPoint.y;

        service.convertToTopLeftAndBottomRight(startPoint, endPoint);

        expect(endPoint.y).toEqual(oldEndPointY);
        expect(startPoint.y).toEqual(oldStartPointY);
    });

    it('registerMousePosition should update mouseDownCoord and startPoint if isStartPoint is true', () => {
        const mousePos: Vec2 = { x: 11, y: 7 };
        const oldValue: Vec2 = { x: 5, y: 5 };

        service.startPoint = oldValue;
        service.mouseDownCoord = oldValue;

        service.registerMousePosition(mousePos, true);

        expect(service.startPoint).toEqual(mousePos);
        expect(service.mouseDownCoord).toEqual(mousePos);
    });

    it('registerMousePosition should not update mouseDownCoord and startPoint if isStartPoint is false', () => {
        const mousePos: Vec2 = { x: 11, y: 7 };
        const oldValue: Vec2 = { x: 5, y: 5 };

        service.startPoint = oldValue;
        service.mouseDownCoord = oldValue;

        service.registerMousePosition(mousePos, false);

        expect(service.startPoint).toEqual(oldValue);
        expect(service.mouseDownCoord).toEqual(oldValue);
    });

    it('adjustPositionToStayInCanvas should make mousePos.x to equal 0 if mousePos.x <= 0', () => {
        const mousePos: Vec2 = { x: -5, y: 7 };

        service.adjustPositionToStayInCanvas(mousePos);
        expect(mousePos.x).toEqual(0);
    });

    it('adjustPositionToStayInCanvas should not change mousePos.x if mousePos.x >= 0 && mousePos.x < canvas width', () => {
        const mousePos: Vec2 = { x: 5, y: 7 };
        const oldValue: number = mousePos.x;
        service.adjustPositionToStayInCanvas(mousePos);
        expect(mousePos.x).toEqual(oldValue);
    });

    it('adjustPositionToStayInCanvas should make mousePos.x to equal canvas width if mousePose.x >= canvas width', () => {
        const width: number = drawServiceSpy.canvasSize.x;
        const mousePos: Vec2 = { x: width + 1, y: 7 };

        service.adjustPositionToStayInCanvas(mousePos);
        expect(mousePos.x).toEqual(width);
    });

    it('adjustPositionToStayInCanvas should make mousePos.y to equal 0 if mousePos.y <= 0', () => {
        const mousePos: Vec2 = { x: 5, y: -7 };

        service.adjustPositionToStayInCanvas(mousePos);
        expect(mousePos.y).toEqual(0);
    });

    it('adjustPositionToStayInCanvas should not change mousePos.y if mousePos.y >= 0  && mousePos.y < canvas height', () => {
        const mousePos: Vec2 = { x: 5, y: 7 };
        const oldValue: number = mousePos.y;

        service.adjustPositionToStayInCanvas(mousePos);
        expect(mousePos.y).toEqual(oldValue);
    });

    it('adjustPositionToStayInCanvas should make mousePos.y to equal canvas height if mousePose.y >= canvas height', () => {
        const height: number = drawServiceSpy.canvasSize.y;
        const mousePos: Vec2 = { x: 1, y: height + 1 };

        service.adjustPositionToStayInCanvas(mousePos);
        expect(mousePos.y).toEqual(height);
    });

    it('startPointIsFarEnoughFrom should return true if distance mouse pos <-> start point > minimum ', () => {
        const minimuDistance = service.MINIMUM_SELECTION_WIDTH;
        const mousePos: Vec2 = { x: 5, y: 7 };
        service.startPoint = { x: mousePos.x + minimuDistance, y: mousePos.y + minimuDistance };
        const output: boolean = service.startPointIsFarEnoughFrom(mousePos);
        expect(output).toEqual(true);
    });

    it('startPointIsFarEnoughFrom should return false if distance mouse pos <-> start point < minimum ', () => {
        const mousePos: Vec2 = { x: 5, y: 7 };
        service.startPoint = mousePos;
        const output: boolean = service.startPointIsFarEnoughFrom(mousePos);
        expect(output).toEqual(false);
    });
});
