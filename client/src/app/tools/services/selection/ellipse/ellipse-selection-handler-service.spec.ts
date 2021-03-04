import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { HandlerMemento } from '@app/app/classes/handler-memento';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { SelectionHelperService } from '../selection-base/selection-helper.service';

import { EllipseSelectionHandlerService } from './ellipse-selection-handler-service';
import { EllipseSelectionHelperService } from './ellipse-selection-helper.service';

describe('SelectionRendererService', () => {
    let service: EllipseSelectionHandlerService;
    let canvasTestHelper: CanvasTestHelper;
    let canvasPosition: Vec2;
    let canvas: HTMLCanvasElement;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let selectionServiceMock: jasmine.SpyObj<SelectionHelperService>;
    let ellipseSelectionHelperMock: jasmine.SpyObj<EllipseSelectionHandlerService>;

    let clearAndResetAllCanvasSpy: jasmine.Spy<any>;
    let hasSelectionBeenManipulatedSpy: jasmine.Spy<any>;
    let drawWhitePostSelectionSpy: jasmine.Spy<any>;
    let updateHorizontalOffsetSpy: jasmine.Spy<any>;
    let updateVerticalOffsetSpy: jasmine.Spy<any>;
    //let drawImageSpy: jasmine.Spy<any>;

    beforeEach(() => {

        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        drawServiceSpy.canvasSize = {x: 0, y: 0};

        ellipseSelectionHelperMock = jasmine.createSpyObj('EllipseSelectionHelperService', ['getEllipseParam', 'drawSelectionEllipse', 'drawPostSelectionEllipse', 'add', 'isClickOutsideSelection', 'convertToMovement', 'add', 
        'setIsSelectionBeingManipulated', 'setIsSelectionBeingManipulated', 'drawPerimeter', 'getSquareAjustedPerimeter' ]);
        selectionServiceMock = jasmine.createSpyObj('SelectionService', ['isClickOutsideSelection', 'convertToMovement', 'add', 
        'setIsSelectionBeingManipulated', 'setIsSelectionBeingManipulated', 'drawPerimeter', 'getSquareAjustedPerimeter']);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy }, 
                { provide: EllipseSelectionHelperService, useValue: ellipseSelectionHelperMock },
                { provide: SelectionHelperService, useValue: selectionServiceMock },
            ],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        canvas = canvasTestHelper.canvas;
        canvasPosition = { x: 50, y: 40 };

        service = TestBed.inject(EllipseSelectionHandlerService);

        spyOn(canvas, 'getBoundingClientRect').and.callFake(
            jasmine
                .createSpy('getBoundingClientRect')
                .and.returnValue({ top: 1, height: 100, left: 2, width: 200, right: 202, x: canvasPosition.x, y: canvasPosition.y }),
        );
        
        clearAndResetAllCanvasSpy = spyOn<any>(service, 'clearAndResetAllCanvas').and.callThrough();
        hasSelectionBeenManipulatedSpy = spyOn<any>(service, 'hasSelectionBeenManipulated').and.callThrough();
        drawWhitePostSelectionSpy = spyOn<any>(service, 'drawWhitePostSelection').and.callThrough();
        updateHorizontalOffsetSpy = spyOn<any>(service, 'updateHorizontalOffset').and.callThrough();
        updateVerticalOffsetSpy = spyOn<any>(service, 'updateVerticalOffset').and.callThrough();
        //drawImageSpy = spyOn<any>(service, 'drawImage').and.callThrough();





        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvas;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('initAllProperties should update center correctly', () => {
        let vertices: Vec2[] = [{x: 1, y: 2}, {x:3, y: 4}];
        service.initAllProperties(vertices);
        expect(service.originalCenter).toEqual({ x: (vertices[0].x + vertices[1].x) / 2, y: (vertices[0].y + vertices[1].y) / 2 });
    });

    it('select should clear and reset canvas', () => {
        let vertices: Vec2[] = [{x: 1, y: 2}, {x:3, y: 4}];
        let sourceCanvas: HTMLCanvasElement = document.createElement('canvas');
        service.select(sourceCanvas, vertices);
        expect(clearAndResetAllCanvasSpy).toHaveBeenCalled();
    });

    it('drawSelection should return false if hasSelectionBeenManipulated is false', () => {
        let topLeftOnTarget: Vec2 = {x: 1, y: 2};
        let sourceCanvas: HTMLCanvasElement = document.createElement('canvas');
        let ctx: CanvasRenderingContext2D = sourceCanvas.getContext('2d') as CanvasRenderingContext2D;
        hasSelectionBeenManipulatedSpy.and.returnValue(false);
        let output:boolean = service.drawSelection(ctx, topLeftOnTarget);
        expect(output).toEqual(false);
    });

    it('drawSelection should return true if hasSelectionBeenManipulated is true', () => {
        let topLeftOnTarget: Vec2 = {x: 1, y: 2};
        let sourceCanvas: HTMLCanvasElement = document.createElement('canvas');
        let ctx: CanvasRenderingContext2D = sourceCanvas.getContext('2d') as CanvasRenderingContext2D;
        hasSelectionBeenManipulatedSpy.and.returnValue(true);
        let output:boolean = service.drawSelection(ctx, topLeftOnTarget);
        expect(output).toEqual(true);
    });

    it('drawSelection should call drawWhitePostSelection if needWhiteEllipsePostDrawing is true', () => {
        let topLeftOnTarget: Vec2 = {x: 1, y: 2};
        let sourceCanvas: HTMLCanvasElement = document.createElement('canvas');
        let ctx: CanvasRenderingContext2D = sourceCanvas.getContext('2d') as CanvasRenderingContext2D;
        service.needWhiteEllipsePostDrawing = true;
        hasSelectionBeenManipulatedSpy.and.returnValue(true);
        service.drawSelection(ctx, topLeftOnTarget);
        expect(drawWhitePostSelectionSpy).toHaveBeenCalled();
    });

    it('resizeSelection should calculate the new length based on \
    bottomRightOnSource and topLeftOnSource x component rather than y if isHorizontal is true', () => {
        let topLeftOnSource: Vec2 = {x: 1, y: 3};
        let bottomRightOnSource: Vec2 = {x: 8, y: 9};
        let isHorizontal: boolean = true;
        let newlength: number = bottomRightOnSource.x - topLeftOnSource.x;

        service.resizeSelection(topLeftOnSource, bottomRightOnSource, isHorizontal);
        
        expect(updateHorizontalOffsetSpy).toHaveBeenCalledWith(newlength);
    });

    it('resizeSelection should calculate the new length based on \
    bottomRightOnSource and topLeftOnSource y component rather than x if isHorizontal is false', () => {
        let topLeftOnSource: Vec2 = {x: 1, y: 3};
        let bottomRightOnSource: Vec2 = {x: 8, y: 9};
        let isHorizontal: boolean = false;
        let newlength: number = bottomRightOnSource.y - topLeftOnSource.y;

        service.resizeSelection(topLeftOnSource, bottomRightOnSource, isHorizontal);
        
        expect(updateVerticalOffsetSpy).toHaveBeenCalledWith(newlength);
    });

    it('transform should have a vertical scaling of 1 is isHorizontal is true', () => {
        let isHorizontal: boolean = true;
        let sourceCanvas: HTMLCanvasElement = document.createElement('canvas');
        let ctx: CanvasRenderingContext2D = sourceCanvas.getContext('2d') as CanvasRenderingContext2D;
        let ctxTransformSpy: jasmine.Spy<any> = spyOn(ctx, 'transform');
        let scaling =1.3;
        service.transform(ctx, 1.3, isHorizontal);
        expect(ctxTransformSpy).toHaveBeenCalledWith(scaling, 0, 0, 1, 0, 0);
    });

    it('transform should have a horizontal scaling of 1 is isHorizontal is true', () => {
        let isHorizontal: boolean = false;
        let sourceCanvas: HTMLCanvasElement = document.createElement('canvas');
        let ctx: CanvasRenderingContext2D = sourceCanvas.getContext('2d') as CanvasRenderingContext2D;
        let ctxTransformSpy: jasmine.Spy<any> = spyOn(ctx, 'transform');
        let scaling =1.3;
        service.transform(ctx, 1.3, isHorizontal);
        expect(ctxTransformSpy).toHaveBeenCalledWith(1, 0, 0, scaling, 0, 0);
    });

    it('drawACanvasOnAnother should call drawImage with the origin as position param if topLeft is not provided in param', () => {
        let origin: Vec2 = {x:0, y:0};
        let sourceCanvas: HTMLCanvasElement = document.createElement('canvas');
        let ctx: CanvasRenderingContext2D = sourceCanvas.getContext('2d') as CanvasRenderingContext2D;
        let drawImageSpy: jasmine.Spy<any> = spyOn(ctx, 'drawImage');
        service.drawACanvasOnAnother(sourceCanvas, ctx);
        expect(drawImageSpy).toHaveBeenCalledWith(sourceCanvas, origin.x, origin.y );
        
    });

    it('drawACanvasOnAnother should call drawImage with the position param if passed ', () => {
        let positionOnTarget: Vec2 = {x:5, y:7};
        let sourceCanvas: HTMLCanvasElement = document.createElement('canvas');
        let ctx: CanvasRenderingContext2D = sourceCanvas.getContext('2d') as CanvasRenderingContext2D;
        let drawImageSpy: jasmine.Spy<any> = spyOn(ctx, 'drawImage');
        service.drawACanvasOnAnother(sourceCanvas, ctx, positionOnTarget);
        expect(drawImageSpy).toHaveBeenCalledWith(sourceCanvas, positionOnTarget.x, positionOnTarget.y );
    });

    it('hasSelectionBeenManipulated should return true if hasBeenManipulated is true even topLeftOnTarget == originalTopLeftOnBaseCanvas', () => {
        let positionOnTarget: Vec2 = {x:5, y:7};
        service.originalTopLeftOnBaseCanvas = positionOnTarget;
        service.hasBeenManipulated = true;
        const output: boolean = service.hasSelectionBeenManipulated(positionOnTarget);
        expect(output).toEqual(true);
    });

    it('hasSelectionBeenManipulated should return false if hasBeenManipulated is false and topLeftOnTarget == originalTopLeftOnBaseCanvas', () => {
        let positionOnTarget: Vec2 = {x:5, y:7};
        service.originalTopLeftOnBaseCanvas = positionOnTarget;
        service.hasBeenManipulated = false;
        const output: boolean = service.hasSelectionBeenManipulated(positionOnTarget);
        expect(output).toEqual(false);
    });

    it('hasSelectionBeenManipulated should return true if hasBeenManipulated is false and topLeftOnTarget != originalTopLeftOnBaseCanvas', () => {
        let positionOnTarget: Vec2 = {x:5, y:7};
        service.originalTopLeftOnBaseCanvas = {x: positionOnTarget.x+1, y: positionOnTarget.y};
        service.hasBeenManipulated = false;
        const output: boolean = service.hasSelectionBeenManipulated(positionOnTarget);
        expect(output).toEqual(true);
    });

    it('creating a memento then restoring to that memento should not change any property', () => {
        service.originalWidth = 10;
        service.originalHeight = 10;
        service.fixedTopLeft = { x: 10, y: 10 };
        service.offset = { x: 10, y: 10 };
        service.originalTopLeftOnBaseCanvas = { x: 10, y: 10 };
        service.originalCenter = { x: 10, y: 10 };
        service.originalVertices = [{x:2,y:3}, {x:5, y:7}];
        service.hasBeenManipulated = true;
        service.needWhiteEllipsePostDrawing = true;

        service.selectionCanvas.width = drawServiceSpy.canvas.width;
        service.selectionCanvas.height = drawServiceSpy.canvas.height;
        service.originalCanvasCopy.width = drawServiceSpy.canvas.width;
        service.originalCanvasCopy.height = drawServiceSpy.canvas.height;
        service.horizontalModificationCanvas.width = drawServiceSpy.canvas.width;
        service.horizontalModificationCanvas.height = drawServiceSpy.canvas.height;
        service.verticalModificationCanvas.width = drawServiceSpy.canvas.width;
        service.verticalModificationCanvas.height = drawServiceSpy.canvas.height;

        const memento :HandlerMemento = service.createMemento();

        memento.selectionCanvas.width = drawServiceSpy.canvas.width;
        memento.selectionCanvas.height = drawServiceSpy.canvas.height;
        memento.originalCanvasCopy.width = drawServiceSpy.canvas.width;
        memento.originalCanvasCopy.height = drawServiceSpy.canvas.height;
        memento.horizontalModificationCanvas.width = drawServiceSpy.canvas.width;
        memento.horizontalModificationCanvas.height = drawServiceSpy.canvas.height;
        memento.verticalModificationCanvas.width = drawServiceSpy.canvas.width;
        memento.verticalModificationCanvas.height = drawServiceSpy.canvas.height;

        let dummyVertices: Vec2[] = [{x:50,y:30}, {x:280, y:357}];
        
        service.initAllProperties(dummyVertices);
        service.restoreFromMemento(memento);

        expect(service.originalWidth).toEqual(10);
        expect(service.originalHeight).toEqual(10);
        expect(service.fixedTopLeft).toEqual({ x: 10, y: 10 });
        expect(service.offset).toEqual({ x: 10, y: 10 });
        expect(service.originalTopLeftOnBaseCanvas).toEqual({ x: 10, y: 10 });
        expect(service.originalCenter).toEqual({ x: 10, y: 10 });
        expect(service.originalVertices).toEqual([{x:2,y:3}, {x:5, y:7}]);
        expect(service.hasBeenManipulated).toEqual(true);
        expect(service.needWhiteEllipsePostDrawing).toEqual(true);
    });

    
});
