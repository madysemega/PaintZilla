import { async, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { RgbaFormService } from '@app/colour-picker/services/rgb-form/rgb-form.service';
import { Subject } from 'rxjs';
export const DEFAULT_COLOUR = new Colour();
// tslint:disable:no-any
describe('RgbaFormService', () => {
    let service: RgbaFormService;
    let colourPickerServiceSpy: jasmine.SpyObj<ColourPickerService>;
    let rgbaFormGroupSpy: jasmine.SpyObj<FormGroup>;
    let redFormSpy: jasmine.SpyObj<FormControl>;
    let greenFormSpy: jasmine.SpyObj<FormControl>;
    let blueFormSpy: jasmine.SpyObj<FormControl>;
    let alphaFormSpy: jasmine.SpyObj<FormControl>;
    let redFormChanged: Subject<any>;
    let greenFormChanged: Subject<any>;
    let blueFormChanged: Subject<any>;
    let alphaFormChanged: Subject<any>;

    beforeEach(async(() => {
        redFormChanged = new Subject<any>();
        greenFormChanged = new Subject<any>();
        blueFormChanged = new Subject<any>();
        alphaFormChanged = new Subject<any>();
        redFormSpy = jasmine.createSpyObj('FormControl', ['setValue', 'markAsTouched'], {
            valid: true,
            valueChanges: redFormChanged,
            value: '00',
        });
        greenFormSpy = jasmine.createSpyObj('FormControl', ['setValue', 'markAsTouched'], {
            valid: true,
            valueChanges: greenFormChanged,
            value: '00',
        });
        blueFormSpy = jasmine.createSpyObj('FormControl', ['setValue', 'markAsTouched'], {
            valid: true,
            valueChanges: blueFormChanged,
            value: '00',
        });
        alphaFormSpy = jasmine.createSpyObj('FormControl', ['setValue', 'markAsTouched'], {
            valid: true,
            valueChanges: alphaFormChanged,
            value: '100',
        });
        rgbaFormGroupSpy = jasmine.createSpyObj('FormGroup', [], {
            controls: {
                redForm: redFormSpy,
                greenForm: greenFormSpy,
                blueForm: blueFormSpy,
                alphaForm: alphaFormSpy,
            },
            valid: true,
        });
        colourPickerServiceSpy = jasmine.createSpyObj('ColourPickerService', ['setCurrentColour']);
        spyOn(Colour, 'hexToRgb').and.returnValue(DEFAULT_COLOUR);
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule ],
            providers: [{ provide: RgbaFormService }, { provide: ColourPickerService, useValue: colourPickerServiceSpy }],
        });
        service = TestBed.inject(RgbaFormService);
        service.rgbaFormGroup = rgbaFormGroupSpy;
    }));

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('updateRgbForm(): should call rgbaFormGroup.controls forms setValue and markAsTouched if isTyping is false', () => {
        service.isTyping = false;
        service.updateRgbForm(DEFAULT_COLOUR);
        expect(service.rgbaFormGroup.controls.redForm.setValue).toHaveBeenCalled();
        expect(service.rgbaFormGroup.controls.redForm.markAsTouched).toHaveBeenCalled();
        expect(service.rgbaFormGroup.controls.greenForm.setValue).toHaveBeenCalled();
        expect(service.rgbaFormGroup.controls.greenForm.markAsTouched).toHaveBeenCalled();
        expect(service.rgbaFormGroup.controls.blueForm.setValue).toHaveBeenCalled();
        expect(service.rgbaFormGroup.controls.blueForm.markAsTouched).toHaveBeenCalled();
        expect(service.rgbaFormGroup.controls.alphaForm.setValue).toHaveBeenCalled();
        expect(service.rgbaFormGroup.controls.alphaForm.markAsTouched).toHaveBeenCalled();
    });

    it('updateRgbForm(): should not call rgbaFormGroup.controls forms setValue and markAsTouched if isTyping is true', () => {
        service.isTyping = true;
        service.updateRgbForm(DEFAULT_COLOUR);
        expect(service.rgbaFormGroup.controls.redForm.setValue).not.toHaveBeenCalled();
        expect(service.rgbaFormGroup.controls.redForm.markAsTouched).not.toHaveBeenCalled();
        expect(service.rgbaFormGroup.controls.greenForm.setValue).not.toHaveBeenCalled();
        expect(service.rgbaFormGroup.controls.greenForm.markAsTouched).not.toHaveBeenCalled();
        expect(service.rgbaFormGroup.controls.blueForm.setValue).not.toHaveBeenCalled();
        expect(service.rgbaFormGroup.controls.blueForm.markAsTouched).not.toHaveBeenCalled();
        expect(service.rgbaFormGroup.controls.alphaForm.setValue).not.toHaveBeenCalled();
        expect(service.rgbaFormGroup.controls.alphaForm.markAsTouched).not.toHaveBeenCalled();
    });

    it('updateColourComponents(): should call this.colourPickerService.setCurrentColour if rgbaFormGroup.valid', () => {
        service.updateColourComponents();
        expect(colourPickerServiceSpy.setCurrentColour).toHaveBeenCalled();
    });

    it('updateColourComponents(): should call this.colourPickerService.setCurrentColour if not rgbaFormGroup.valid', () => {
        rgbaFormGroupSpy = jasmine.createSpyObj('FormGroup', [], {
            controls: {
                redForm: redFormSpy,
                greenForm: greenFormSpy,
                blueForm: blueFormSpy,
                alphaForm: alphaFormSpy,
            },
            valid: false,
        });
        service.rgbaFormGroup = rgbaFormGroupSpy;
        service.updateColourComponents();
        expect(colourPickerServiceSpy.setCurrentColour).not.toHaveBeenCalled();
    });
});
