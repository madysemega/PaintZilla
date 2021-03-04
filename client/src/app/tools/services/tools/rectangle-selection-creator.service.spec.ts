import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { BehaviorSubject } from 'rxjs';
import { RectangleSelectionHelperService } from '../selection/rectangle/rectangle-selection-helper.service';

import { RectangleSelectionCreatorService } from './rectangle-selection-creator.service';

describe('RectangleSelectionCreatorService', () => {
    let service: RectangleSelectionCreatorService;

    //let selectionServiceMock: jasmine.SpyObj<SelectionService>;
    let rectangleSelectionHelperService: jasmine.SpyObj<RectangleSelectionHelperService>;

    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let createSelectionSpy: jasmine.Spy<any>;

    let canvasTestHelper: CanvasTestHelper;
    let canvas: HTMLCanvasElement;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;


    beforeEach(() => {

        /*selectionServiceMock = jasmine.createSpyObj('SelectionService', ['isClickOutsideSelection', 'convertToMovement', 'add', 
        'setIsSelectionBeingManipulated', 'setIsSelectionBeingManipulated', 'drawPerimeter', 'getSquareAdjustedPerimeter']);*/
        rectangleSelectionHelperService = jasmine.createSpyObj('RectangleSelectionHelperService', ['getSquareAdjustedPerimeter', 'drawPerimeter', 'setIsSelectionBeingManipulated']);
        rectangleSelectionHelperService.isSelectionBeingManipulated = new BehaviorSubject(true);
        
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setCursorType']);
        drawServiceSpy.canvasSize = {x: 1000, y: 500};

        TestBed.configureTestingModule({
            providers: 
            [   
                //{ provide: SelectionService, useValue: selectionServiceMock },
                { provide: DrawingService, useValue: drawServiceSpy }, 
                { provide: RectangleSelectionHelperService, useValue: rectangleSelectionHelperService },
            ],
        });

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        canvas = canvasTestHelper.canvas;
        service = TestBed.inject(RectangleSelectionCreatorService);

        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvas;

        createSelectionSpy = spyOn<any>(service, 'createSelection').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('drawing an outline should use getSquareAdjustedPerimeter from SelectionHelperService if isShift is true ', () => {
        const endPoint: Vec2 = {x:9, y:563};
        service.isShiftDown = true;
        service.drawSelectionOutline(endPoint)
        expect(rectangleSelectionHelperService.getSquareAdjustedPerimeter).toHaveBeenCalled();
    });

    it('drawing an outline should not use getSquareAdjustedPerimeter from SelectionHelperService if isShift is false ', () => {
        const endPoint: Vec2 = {x:9, y:563};
        service.isShiftDown = false;
        service.drawSelectionOutline(endPoint)
        expect(rectangleSelectionHelperService.getSquareAdjustedPerimeter).not.toHaveBeenCalled();
    });

   it('pressing ctrl + a should create selection the same size as the canvas ', () => {
        const keyboardEvent = {
            key: 'a',
            ctrlKey: true,
        } as KeyboardEvent;
        service.isShiftDown = false;
        service.onKeyDown(keyboardEvent);
        expect(createSelectionSpy).toHaveBeenCalledWith({x:0, y:0},{x: drawServiceSpy.canvasSize.x, y: drawServiceSpy.canvasSize.y});
    });

    it('if ctrl + a is not pressed it should not create selection', () => {
        const keyboardEvent = {
            key: 'z',
            ctrlKey: true,
        } as KeyboardEvent;
        service.isShiftDown = false;
        service.onKeyDown(keyboardEvent);
        expect(createSelectionSpy).not.toHaveBeenCalled();
    });

});
