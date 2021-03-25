import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { HandlerMemento } from '@app/app/classes/handler-memento';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { SelectionHelperService } from '@app/tools/services/selection/selection-base/selection-helper.service';

import { EllipseSelectionHandlerService } from './ellipse-selection-handler-service';
import { EllipseSelectionHelperService } from './ellipse-selection-helper.service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-empty
describe('EllipseSelectionHandlerService', () => {
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
    let whiteFillAtOriginalLocationSpy: jasmine.Spy<any>;
    let updateHorizontalOffsetSpy: jasmine.Spy<any>;
    let updateVerticalOffsetSpy: jasmine.Spy<any>;
    let fillSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        drawServiceSpy.canvasSize = { x: 500, y: 500 };

        ellipseSelectionHelperMock = jasmine.createSpyObj('EllipseSelectionHelperService', [
            'getEllipseParam',
            'drawSelectionEllipse',
            'drawPostSelectionEllipse',
            'add',
            'isClickOutsideSelection',
            'convertToMovement',
            'add',
            'setIsSelectionBeingManipulated',
            'setIsSelectionBeingManipulated',
            'drawPerimeter',
            'getSquareAjustedPerimeter',
            'whiteFill',
            'whiteEllipseFill',
        ]);
        selectionServiceMock = jasmine.createSpyObj('SelectionService', [
            'isClickOutsideSelection',
            'convertToMovement',
            'add',
            'setIsSelectionBeingManipulated',
            'setIsSelectionBeingManipulated',
            'drawPerimeter',
            'getSquareAjustedPerimeter',
        ]);

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
        whiteFillAtOriginalLocationSpy = spyOn<any>(service, 'whiteFillAtOriginalLocation').and.callThrough();
        updateHorizontalOffsetSpy = spyOn<any>(service, 'updateHorizontalOffset').and.callThrough();
        updateVerticalOffsetSpy = spyOn<any>(service, 'updateVerticalOffset').and.callThrough();
        fillSpy = spyOn<any>(service.selectionCtx, 'fill').and.callThrough();
        // drawImageSpy = spyOn<any>(service, 'drawImage').and.callThrough();

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
        const vertices: Vec2[] = [
            { x: 1, y: 2 },
            { x: 3, y: 4 },
        ];
        service.initAllProperties(vertices);
        expect(service.originalCenter).toEqual({ x: (vertices[0].x + vertices[1].x) / 2, y: (vertices[0].y + vertices[1].y) / 2 });
    });

    it('select should clear and reset canvas', () => {
        const vertices: Vec2[] = [
            { x: 1, y: 2 },
            { x: 3, y: 4 },
        ];
        const sourceCanvas: HTMLCanvasElement = document.createElement('canvas');
        service.select(sourceCanvas, vertices);
        expect(clearAndResetAllCanvasSpy).toHaveBeenCalled();
    });

    it('drawSelection should return false if hasSelectionBeenManipulated is false', () => {
        const topLeftOnTarget: Vec2 = { x: 1, y: 2 };
        const sourceCanvas: HTMLCanvasElement = document.createElement('canvas');
        const ctx: CanvasRenderingContext2D = sourceCanvas.getContext('2d') as CanvasRenderingContext2D;
        hasSelectionBeenManipulatedSpy.and.returnValue(false);
        const output: boolean = service.drawSelection(ctx, topLeftOnTarget);
        expect(output).toEqual(false);
    });

    it('drawSelection should return true if hasSelectionBeenManipulated is true', () => {
        const topLeftOnTarget: Vec2 = { x: 1, y: 2 };
        const sourceCanvas: HTMLCanvasElement = document.createElement('canvas');
        const ctx: CanvasRenderingContext2D = sourceCanvas.getContext('2d') as CanvasRenderingContext2D;
        hasSelectionBeenManipulatedSpy.and.returnValue(true);
        const output: boolean = service.drawSelection(ctx, topLeftOnTarget);
        expect(output).toEqual(true);
    });

    it('drawSelection should call whiteFillAtOriginalLocation if needWhiteEllipsePostDrawing is true', () => {
        const topLeftOnTarget: Vec2 = { x: 1, y: 2 };
        const sourceCanvas: HTMLCanvasElement = document.createElement('canvas');
        const ctx: CanvasRenderingContext2D = sourceCanvas.getContext('2d') as CanvasRenderingContext2D;
        service.needWhitePostDrawing = true;
        hasSelectionBeenManipulatedSpy.and.returnValue(true);
        service.drawSelection(ctx, topLeftOnTarget);
        expect(whiteFillAtOriginalLocationSpy).toHaveBeenCalled();
    });

    it('resizeSelection should calculate the new length based on \
    bottomRightOnSource and topLeftOnSource x component rather than y if isHorizontal is true', () => {
        const topLeftOnSource: Vec2 = { x: 1, y: 3 };
        const bottomRightOnSource: Vec2 = { x: 8, y: 9 };
        const isHorizontal = true;
        const newlength: number = bottomRightOnSource.x - topLeftOnSource.x;

        service.resizeSelection(topLeftOnSource, bottomRightOnSource, isHorizontal);

        expect(updateHorizontalOffsetSpy).toHaveBeenCalledWith(newlength);
    });

    it('resizeSelection should calculate the new length based on \
    bottomRightOnSource and topLeftOnSource y component rather than x if isHorizontal is false', () => {
        const topLeftOnSource: Vec2 = { x: 1, y: 3 };
        const bottomRightOnSource: Vec2 = { x: 8, y: 9 };
        const isHorizontal = false;
        const newlength: number = bottomRightOnSource.y - topLeftOnSource.y;

        service.resizeSelection(topLeftOnSource, bottomRightOnSource, isHorizontal);

        expect(updateVerticalOffsetSpy).toHaveBeenCalledWith(newlength);
    });

    it('drawACanvasOnAnother should call drawImage with the origin as position param if topLeft is not provided in param', () => {
        const origin: Vec2 = { x: 0, y: 0 };
        const sourceCanvas: HTMLCanvasElement = document.createElement('canvas');
        const ctx: CanvasRenderingContext2D = sourceCanvas.getContext('2d') as CanvasRenderingContext2D;
        const drawImageSpy: jasmine.Spy<any> = spyOn(ctx, 'drawImage');
        service.drawACanvasOnAnother(sourceCanvas, ctx);
        expect(drawImageSpy).toHaveBeenCalledWith(sourceCanvas, origin.x, origin.y);
    });

    it('drawACanvasOnAnother should call drawImage with the position param if passed ', () => {
        const positionOnTarget: Vec2 = { x: 5, y: 7 };
        const sourceCanvas: HTMLCanvasElement = document.createElement('canvas');
        const ctx: CanvasRenderingContext2D = sourceCanvas.getContext('2d') as CanvasRenderingContext2D;
        const drawImageSpy: jasmine.Spy<any> = spyOn(ctx, 'drawImage');
        service.drawACanvasOnAnother(sourceCanvas, ctx, positionOnTarget);
        expect(drawImageSpy).toHaveBeenCalledWith(sourceCanvas, positionOnTarget.x, positionOnTarget.y);
    });

    it('hasSelectionBeenManipulated should return true if hasBeenManipulated is true even topLeftOnTarget == originalTopLeftOnBaseCanvas', () => {
        const positionOnTarget: Vec2 = { x: 5, y: 7 };
        service.originalTopLeftOnBaseCanvas = positionOnTarget;
        service.hasBeenManipulated = true;
        const output: boolean = service.hasSelectionBeenManipulated(positionOnTarget);
        expect(output).toEqual(true);
    });

    it('hasSelectionBeenManipulated should return false if hasBeenManipulated is false and topLeftOnTarget == originalTopLeftOnBaseCanvas', () => {
        const positionOnTarget: Vec2 = { x: 5, y: 7 };
        service.originalTopLeftOnBaseCanvas = positionOnTarget;
        service.hasBeenManipulated = false;
        const output: boolean = service.hasSelectionBeenManipulated(positionOnTarget);
        expect(output).toEqual(false);
    });

    it('hasSelectionBeenManipulated should return true if hasBeenManipulated is false and topLeftOnTarget != originalTopLeftOnBaseCanvas', () => {
        const positionOnTarget: Vec2 = { x: 5, y: 7 };
        service.originalTopLeftOnBaseCanvas = { x: positionOnTarget.x + 1, y: positionOnTarget.y };
        service.hasBeenManipulated = false;
        const output: boolean = service.hasSelectionBeenManipulated(positionOnTarget);
        expect(output).toEqual(true);
    });

    it('extracting should use fill if fillItWhite is true', () => {
        const sourceCanvas: HTMLCanvasElement = document.createElement('canvas');
        sourceCanvas.width = 500;
        sourceCanvas.height = 764;
        service.extract(sourceCanvas, service.selectionCtx, true);
        expect(fillSpy).toHaveBeenCalled();
    });

    it('creating a memento then restoring to that memento should not change any property', () => {
        // tslint:disable-next-line: no-magic-numbers
        service.originalWidth = 10;
        // tslint:disable-next-line: no-magic-numbers
        service.originalHeight = 10;
        service.topLeftRelativeToMiddle = { x: 10, y: 10 };
        service.offset = { x: 10, y: 10 };
        service.originalTopLeftOnBaseCanvas = { x: 10, y: 10 };
        service.originalCenter = { x: 10, y: 10 };
        service.originalVertices = [
            { x: 2, y: 3 },
            { x: 5, y: 7 },
        ];
        service.hasBeenManipulated = true;
        service.needWhitePostDrawing = true;

        service.selection.width = drawServiceSpy.canvas.width;
        service.selection.height = drawServiceSpy.canvas.height;
        service.originalSelection.width = drawServiceSpy.canvas.width;
        service.originalSelection.height = drawServiceSpy.canvas.height;

        const memento: HandlerMemento = service.createMemento();

        const dummyVertices: Vec2[] = [
            { x: 50, y: 30 },
            { x: 280, y: 357 },
        ];

        service.initAllProperties(dummyVertices);
        service.restoreFromMemento(memento);

        expect(service.originalWidth).toEqual(10);
        expect(service.originalHeight).toEqual(10);
        expect(service.topLeftRelativeToMiddle).toEqual({ x: 10, y: 10 });
        expect(service.offset).toEqual({ x: 10, y: 10 });
        expect(service.originalTopLeftOnBaseCanvas).toEqual({ x: 10, y: 10 });
        expect(service.originalCenter).toEqual({ x: 10, y: 10 });
        expect(service.originalVertices).toEqual([
            { x: 2, y: 3 },
            { x: 5, y: 7 },
        ]);
        expect(service.hasBeenManipulated).toEqual(true);
        expect(service.needWhitePostDrawing).toEqual(true);
    });

    it('makeWhiteBehindSelection should call whiteFillAtOriginalLocation if needWhitePostDrawing is true', () => {
        service.needWhitePostDrawing = true;
        service.makeWhiteBehindSelection();
        expect(whiteFillAtOriginalLocationSpy).toHaveBeenCalled();
    });

    it('makeWhiteBehindSelection should call whiteFillAtOriginalLocation if needWhitePostDrawing is true', () => {
        service.needWhitePostDrawing = false;
        service.makeWhiteBehindSelection();
        expect(whiteFillAtOriginalLocationSpy).not.toHaveBeenCalled();
    });
});
