import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { TestBed } from '@angular/core/testing';
export const DEFAULT_COLOUR = new Colour();
// tslint:disable: no-string-literal
fdescribe('ColourPickerService', () => {
    let service: ColourPickerService;
    beforeEach(() => {
        spyOn(Colour, 'hsvToRgb').and.returnValue(DEFAULT_COLOUR);
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
    });
});
