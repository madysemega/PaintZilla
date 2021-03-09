import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';

import { EllipseSelectionHelperService } from './ellipse-selection-helper.service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-empty
describe('EllipseSelectionHelperService', () => {
    let service: EllipseSelectionHelperService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let canvasTestHelper: CanvasTestHelper;
    let canvas: HTMLCanvasElement;
    // let canvasPosition: Vec2;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    const CIRCLE_MAX_ANGLE = 360;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setCursorType']);
        drawServiceSpy.canvasSize = { x: 1000, y: 500 };

        TestBed.configureTestingModule({ providers: [{ provide: DrawingService, useValue: drawServiceSpy }] });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        canvas = canvasTestHelper.canvas;
        // canvasPosition = { x: 50, y: 40 };

        service = TestBed.inject(EllipseSelectionHelperService);

        service.drawingService.baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service.drawingService.previewCtx = previewCtxStub;
        service.drawingService.canvas = canvas;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getEllipseParam should not change startPoint and endPoint', () => {
        const startPoint: Vec2 = { x: 5, y: 8 };
        const startPointCopy: Vec2 = { x: 5, y: 8 };
        const endPoint: Vec2 = { x: 4, y: 9 };
        const endPointCopy: Vec2 = { x: 4, y: 9 };
        const center: Vec2 = { x: 0, y: 0 };
        const radii: Vec2 = { x: 0, y: 0 };
        service.getEllipseParam(startPoint, endPoint, center, radii);

        expect(startPoint).toEqual(startPointCopy);
        expect(endPoint).toEqual(endPointCopy);
    });

    it('drawing a selection ellipse should use ellipse() and stroke() from CanvasRenderingContext2D', () => {
        const center: Vec2 = { x: 0, y: 0 };
        const radii: Vec2 = { x: 0, y: 0 };

        const ctx: CanvasRenderingContext2D = drawServiceSpy.previewCtx;
        const ctxEllipseSpy: jasmine.Spy<any> = spyOn(ctx, 'ellipse');
        const ctxStrokeSpy: jasmine.Spy<any> = spyOn(ctx, 'stroke');

        service.drawSelectionEllipse(center, radii);

        expect(ctxEllipseSpy).toHaveBeenCalled();
        expect(ctxStrokeSpy).toHaveBeenCalled();
    });

    it('drawing a post selection ellipse should work even if radii components both =0', () => {
        const center: Vec2 = { x: 0, y: 0 };
        const radii: Vec2 = { x: 0, y: 0 };

        const ctx: CanvasRenderingContext2D = drawServiceSpy.previewCtx;
        const ctxEllipseSpy: jasmine.Spy<any> = spyOn(ctx, 'ellipse');

        service.drawSelectionEllipse(center, radii);

        expect(ctxEllipseSpy).toHaveBeenCalled();
    });

    it('drawing a post selection ellipse should use ellipse() from CanvasRenderingContext2D', () => {
        const center: Vec2 = { x: 7, y: 9 };
        const radii: Vec2 = { x: 7, y: 8 };

        const ctx: CanvasRenderingContext2D = drawServiceSpy.previewCtx;
        const ctxEllipseSpy: jasmine.Spy<any> = spyOn(ctx, 'ellipse');

        service.drawSelectionEllipse(center, radii);

        expect(ctxEllipseSpy).toHaveBeenCalled();
    });

    it('whiteFill should call whiteEllipseFill', () => {
        const center: Vec2 = { x: 7, y: 9 };
        const radii: Vec2 = { x: 7, y: 8 };
        const vertices: Vec2[] = [radii, center];
        const whiteEllipseSpy: jasmine.Spy<any> = spyOn(service, 'whiteEllipseFill');

        service.whiteFill(vertices);

        expect(whiteEllipseSpy).toHaveBeenCalled();
    });

    it('whiteEllipseFill shoul call ellipse from CanvasRenderingContext2D from the baseCtx of the drawing service', () => {
        const center: Vec2 = { x: 7, y: 9 };
        const radii: Vec2 = { x: 7, y: 8 };
        const ctx: CanvasRenderingContext2D = drawServiceSpy.baseCtx;
        const ctxEllipseSpy: jasmine.Spy<any> = spyOn(ctx, 'ellipse');

        service.whiteEllipseFill(center, radii);

        expect(ctxEllipseSpy).toHaveBeenCalled();
    });

    it('whiteEllipseFill should substract 1 from the x component it is >= 1', () => {
        const center: Vec2 = { x: 7, y: 9 };
        const radii: Vec2 = { x: 0, y: 8 };
        const ctx: CanvasRenderingContext2D = drawServiceSpy.baseCtx;
        const ctxEllipseSpy: jasmine.Spy<any> = spyOn(ctx, 'ellipse');

        service.whiteEllipseFill(center, radii);

        expect(ctxEllipseSpy).toHaveBeenCalledWith(center.x, center.y, 0, radii.y - 1, 0, 0, CIRCLE_MAX_ANGLE);
    });

    it('whiteEllipseFill should substract 1 from the y component it is >= 1', () => {
        const center: Vec2 = { x: 7, y: 9 };
        const radii: Vec2 = { x: 7, y: 0 };
        const ctx: CanvasRenderingContext2D = drawServiceSpy.baseCtx;
        const ctxEllipseSpy: jasmine.Spy<any> = spyOn(ctx, 'ellipse');

        service.whiteEllipseFill(center, radii);

        expect(ctxEllipseSpy).toHaveBeenCalledWith(center.x, center.y, radii.x - 1, 0, 0, 0, CIRCLE_MAX_ANGLE);
    });
});
