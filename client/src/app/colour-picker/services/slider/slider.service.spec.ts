import { SliderService } from '@app/colour-picker/services/slider/slider.service';
import { async, TestBed } from '@angular/core/testing';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
export const DEFAULT_COLOUR = new Colour();
// tslint:disable: no-string-literal
describe('SliderService', () => {
    let service: SliderService;
    let colourPickerServiceSpy: jasmine.SpyObj<ColourPickerService>;
    let canvasTestHelper: CanvasTestHelper;
    beforeEach(async(() => {
        colourPickerServiceSpy = jasmine.createSpyObj('ColourPickerService', ['getCurrentColor', 'getHue', 'getAlpha']);
        colourPickerServiceSpy.getCurrentColor.and.returnValue(DEFAULT_COLOUR);
        TestBed.configureTestingModule({
            providers: [{ provide: SliderService }],
        });
        service = TestBed.inject(SliderService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service.paletteCanvas = canvasTestHelper.canvas;
        service.colorCanvas = canvasTestHelper.canvas;
        service.opacityCanvas = canvasTestHelper.canvas;
        service.paletteCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.colorCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.opacityCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service['colourPickerService'] = colourPickerServiceSpy;
        spyOn(Colour, 'hsvToRgb').and.returnValue(DEFAULT_COLOUR);
    }));

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('drawOpacityContext(): should call drawOpacityCursor', () => {
        const drawCursorSpy = spyOn(service, 'drawOpacityCursor').and.callThrough();
        service.drawOpacityContext();
        expect(drawCursorSpy).toHaveBeenCalled();
    });

    it('drawOpacityCursor(): should call opacityCtx.stroke', () => {
        const strokeSpy = spyOn(service.opacityCtx, 'stroke').and.callThrough();
        service.drawOpacityCursor();
        expect(strokeSpy).toHaveBeenCalled();
    });

    it('updateOpacity(): should set colourPickerService.alpha', () => {
        const initialAlpha = 0;
        colourPickerServiceSpy.alpha = initialAlpha;
        service.updateOpacity({ clientX: 10 } as MouseEvent);
        expect(colourPickerServiceSpy.getAlpha()).not.toEqual(initialAlpha);
    });

    it('drawColorContext(): should call drawColorCursor', () => {
        const drawCursorSpy = spyOn(service, 'drawColorCursor').and.callThrough();
        service.drawColorContext();
        expect(drawCursorSpy).toHaveBeenCalled();
    });

    it('drawColorCursor(): should call colorCtx.stroke', () => {
        const strokeSpy = spyOn(service.colorCtx, 'stroke').and.callThrough();
        service.drawColorCursor();
        expect(strokeSpy).toHaveBeenCalled();
    });

    it('updateColor(): should set colourPickerService.hue', () => {
        const initialHue = 0;
        colourPickerServiceSpy.hue = initialHue;
        service.updateColor({ clientY: 10 } as MouseEvent);
        expect(colourPickerServiceSpy.getHue()).not.toEqual(initialHue);
    });

    it('drawPaletteContext(): should call drawPaletteCursor', () => {
        const drawCursorSpy = spyOn(service, 'drawPaletteCursor').and.callThrough();
        service.drawPaletteContext();
        expect(drawCursorSpy).toHaveBeenCalled();
    });

    it('drawColorCursor(): should call paletteCtx.stroke', () => {
        const strokeSpy = spyOn(service.paletteCtx, 'stroke').and.callThrough();
        service.drawPaletteCursor();
        expect(strokeSpy).toHaveBeenCalled();
    });

    it('updatePalette(): should set colourPickerService.saturation and colourPickerService.value', () => {
        const initial = 0;
        colourPickerServiceSpy.saturation = initial;
        colourPickerServiceSpy.value = initial;
        service.updatePalette({ clientX: 10, clientY: 10 } as MouseEvent);
        expect(colourPickerServiceSpy.getSaturation).not.toEqual(initial);
        expect(colourPickerServiceSpy.getValue).not.toEqual(initial);
    });
});
