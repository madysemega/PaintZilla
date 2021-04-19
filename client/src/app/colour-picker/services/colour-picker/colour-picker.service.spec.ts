import { TestBed } from '@angular/core/testing';
import { Colour } from '@app/colour-picker/classes/colours.class';
import * as Constants from '@app/colour-picker/constants/colour-testing.constants';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
// tslint:disable: no-string-literal
describe('ColourPickerService', () => {
    let service: ColourPickerService;
    beforeEach(() => {
        spyOn(Colour, 'hsvToRgb').and.returnValue(Constants.DEFAULT_COLOUR);
        TestBed.configureTestingModule({
            providers: [{ provide: ColourPickerService }],
        });
        service = TestBed.inject(ColourPickerService);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('getHue(): should return hueSubject.value', () => {
        const expected = 10;
        service['hueSubject'].next(expected);
        expect(service.getHue()).toEqual(expected);
    });

    it('getSaturation(): should return hueSubject.value', () => {
        const expected = 10;
        service['saturationSubject'].next(expected);
        expect(service.getSaturation()).toEqual(expected);
    });

    it('getValue(): should return hueSubject.value', () => {
        const expected = 10;
        service['valueSubject'].next(expected);
        expect(service.getValue()).toEqual(expected);
    });

    it('getAlpha(): should return hueSubject.value', () => {
        const expected = 10;
        service['alphaSubject'].next(expected);
        expect(service.getAlpha()).toEqual(expected);
    });

    it('set hue: should set hue', () => {
        const expected = 10;
        service.hue = expected;
        expect(service.getHue()).toEqual(expected);
    });

    it('set saturation: should set saturation', () => {
        const expected = 10;
        service.saturation = expected;
        expect(service.getSaturation()).toEqual(expected);
    });

    it('set value: should set value', () => {
        const expected = 10;
        service.value = expected;
        expect(service.getValue()).toEqual(expected);
    });

    it('set alpha: should set alpha', () => {
        const expected = 10;
        service.alpha = expected;
        expect(service.getAlpha()).toEqual(expected);
    });

    it('getCurrentColor(): should return currentColour', () => {
        service['currentColour'] = Constants.DEFAULT_COLOUR;
        expect(service.getCurrentColor()).toEqual(Constants.DEFAULT_COLOUR);
    });

    it('setCurrentColour(): should set currentColour to specified value if they are not equal', () => {
        service['currentColour'] = Constants.WHITE;
        service.setCurrentColour(Constants.DEFAULT_COLOUR);
        expect(service.getCurrentColor()).toEqual(Constants.DEFAULT_COLOUR);
    });

    it('setCurrentColour(): should not set currentColour to specified value if they are equal', () => {
        service['currentColour'] = Constants.DEFAULT_COLOUR;
        service.setCurrentColour(Constants.DEFAULT_COLOUR);
        expect(service.getCurrentColor()).toEqual(Constants.DEFAULT_COLOUR);
    });
});
