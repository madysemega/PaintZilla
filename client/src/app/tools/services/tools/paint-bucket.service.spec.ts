import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { PixelShape } from '@app/shapes/pixel-shape';
import { FillStyleProperty } from '@app/shapes/properties/fill-style-property';
import { PaintBucketService } from '@app/tools/services/tools/paint-bucket.service';
export const BLACK = new Colour();
describe('PaintBucketService', () => {
    let service: PaintBucketService;
    let drawingServiceStub: DrawingService;
    let colourServiceStub: ColourService;
    let historyServiceStub: HistoryService;
    let keyboardServiceStub: jasmine.SpyObj<KeyboardService>;
    let canvasTestHelper: CanvasTestHelper;
    beforeEach(() => {
        keyboardServiceStub = jasmine.createSpyObj('KeyboardService', ['registerAction', 'saveContext', 'restoreContext']);
        keyboardServiceStub.registerAction.and.stub();
        keyboardServiceStub.saveContext.and.stub();
        keyboardServiceStub.restoreContext.and.stub();
        historyServiceStub = new HistoryService(keyboardServiceStub);
        colourServiceStub = new ColourService({} as ColourPickerService);
        drawingServiceStub = new DrawingService(historyServiceStub);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceStub },
                { provide: ColourService, useValue: colourServiceStub },
                { provide: HistoryService, useValue: historyServiceStub },
            ],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        drawingServiceStub.canvas = canvasTestHelper.canvas;
        drawingServiceStub.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service = TestBed.inject(PaintBucketService);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseDown(): should not call renderFill if isFilling', () => {
        const renderStub = spyOn(service, 'renderFill').and.stub();
        service.isFilling = true;
        service.onMouseDown({} as MouseEvent);
        expect(renderStub).not.toHaveBeenCalled();
    });

    it('onMouseDown(): should call renderFill if !isFilling', () => {
        const renderStub = spyOn(service, 'renderFill').and.stub();
        spyOn(service, 'getPositionFromMouse').and.returnValue({ x: 0, y: 0 } as Vec2);
        spyOn(colourServiceStub, 'getPrimaryColour').and.returnValue(BLACK);
        spyOn(service.contiguousPixelFill, 'fill').and.returnValue([]);
        service.onMouseDown({ button: 0 } as MouseEvent);
        expect(renderStub).toHaveBeenCalled();
        expect(service.contiguousPixelFill.fill).toHaveBeenCalled();
    });

    it('renderFill(): should call historyService.do', () => {
        const historyStub = spyOn(historyServiceStub, 'do').and.stub();
        service.pixelShape = new PixelShape([]);
        service.colourProperty = new FillStyleProperty(BLACK);
        service.renderFill([]);
        expect(historyStub).toHaveBeenCalled();
    });

    it('onToolSelect(): should call drawingService.setCursorType', () => {
        const setCursorStub = spyOn(drawingServiceStub, 'setCursorType').and.stub();
        service.onToolSelect();
        expect(setCursorStub).toHaveBeenCalled();
    });

    it('onToolDeselect(): should set historyService.isLocked to false', () => {
        historyServiceStub.isLocked = true;
        service.onToolDeselect();
        expect(historyServiceStub.isLocked).toBeFalse();
    });
});
