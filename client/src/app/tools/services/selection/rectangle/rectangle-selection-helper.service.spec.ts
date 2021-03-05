import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';

import { RectangleSelectionHelperService } from './rectangle-selection-helper.service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-empty
describe('RectangleSelectionHelperService', () => {
    let service: RectangleSelectionHelperService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let canvasTestHelper: CanvasTestHelper;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    let rectSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        drawServiceSpy.canvasSize = { x: 0, y: 0 };

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        drawServiceSpy.baseCtx = baseCtxStub;
        drawServiceSpy.previewCtx = previewCtxStub;

        rectSpy = spyOn<any>(drawServiceSpy.baseCtx, 'rect').and.callThrough();
        service = TestBed.inject(RectangleSelectionHelperService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('drawPostSelectionRectangle should use rect from CanvasRenderingContext2D', () => {
        const topLeft: Vec2 = { x: 434, y: 564 };
        const originalWidth = 50;
        const originalHeight = 432;
        service.drawPostSelectionRectangle(topLeft, originalWidth, originalHeight);
        expect(rectSpy).toHaveBeenCalled();
    });
});
