import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing/drawing.service';
import { LineShape } from '@app/shapes/line-shape';
import { LineService } from './line.service';
import { MouseButton } from './pencil-service';

// tslint:disable:no-any
describe('LineService', () => {
    let service: LineService;
    let lineShapeStub: LineShape;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        lineShapeStub = new LineShape([], []);
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(LineService);

        // tslint:disable:no-string-literal
        service['lineShape'] = lineShapeStub;
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('left click should add vertex to line shape at mouse position', () => {
        service.onMouseClick({ button: MouseButton.Left, offsetX: 3, offsetY: 5 } as MouseEvent);
        expect(lineShapeStub.vertices.length).toEqual(1);
        expect(lineShapeStub.vertices[0]).toEqual({ x: 3, y: 5 } as Vec2);
    });

    it('right click should not add vertex to line shape at mouse position', () => {
        service.onMouseClick({ button: MouseButton.Right, offsetX: 3, offsetY: 5 } as MouseEvent);
        expect(lineShapeStub.vertices.length).toEqual(0);
    });
});
