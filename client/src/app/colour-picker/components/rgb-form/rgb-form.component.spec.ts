import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { RgbFormComponent } from '@app/colour-picker/components/rgb-form/rgb-form.component';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { RgbaFormService } from '@app/colour-picker/services/rgb-form/rgb-form.service';
import { Subject } from 'rxjs';

export const DEFAULT_COLOUR = new Colour();
// tslint:disable:no-any
// tslint:disable: no-string-literal
describe('RgbFormComponent', () => {
    let component: RgbFormComponent;
    let fixture: ComponentFixture<RgbFormComponent>;
    let colourPickerServiceSpy: jasmine.SpyObj<ColourPickerService>;
    let rgbaFormServiceSpy: jasmine.SpyObj<RgbaFormService>;
    let rgbaFormGroupSpy: jasmine.SpyObj<FormGroup>;
    let redFormSpy: jasmine.SpyObj<FormControl>;
    let greenFormSpy: jasmine.SpyObj<FormControl>;
    let blueFormSpy: jasmine.SpyObj<FormControl>;
    let alphaFormSpy: jasmine.SpyObj<FormControl>;
    let redFormChanged: Subject<any>;
    let greenFormChanged: Subject<any>;
    let blueFormChanged: Subject<any>;
    let alphaFormChanged: Subject<any>;
    let hueChanged: Subject<number>;
    let saturationChanged: Subject<number>;
    let valueChanged: Subject<number>;
    let alphaChanged: Subject<number>;

    beforeEach(async(() => {
        redFormChanged = new Subject<any>();
        greenFormChanged = new Subject<any>();
        blueFormChanged = new Subject<any>();
        alphaFormChanged = new Subject<any>();
        redFormSpy = jasmine.createSpyObj('FormControl', [], {
            valid: true,
            valueChanges: redFormChanged,
            value: '00',
        });
        greenFormSpy = jasmine.createSpyObj('FormControl', [], {
            valid: true,
            valueChanges: greenFormChanged,
            value: '00',
        });
        blueFormSpy = jasmine.createSpyObj('FormControl', [], {
            valid: true,
            valueChanges: blueFormChanged,
            value: '00',
        });
        alphaFormSpy = jasmine.createSpyObj('FormControl', [], {
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
        });
        hueChanged = new Subject<number>();
        saturationChanged = new Subject<number>();
        valueChanged = new Subject<number>();
        alphaChanged = new Subject<number>();
        colourPickerServiceSpy = jasmine.createSpyObj('ColourPickerService', ['getCurrentColor'], {
            hueObservable: hueChanged,
            saturationObservable: saturationChanged,
            valueObservable: valueChanged,
            alphaObservable: alphaChanged,
        });
        colourPickerServiceSpy.getCurrentColor.and.returnValue(DEFAULT_COLOUR);
        rgbaFormServiceSpy = jasmine.createSpyObj('RgbaFormService', ['updateRgbForm', 'updateColourComponents'], {
            isTyping: false,
            colourPickerService: colourPickerServiceSpy,
            rgbaFormGroup: rgbaFormGroupSpy,
        });
        TestBed.configureTestingModule({
            imports: [CommonModule, MatTooltipModule],
            declarations: [RgbFormComponent],
            providers: [
                { providers: ColourPickerService, useValue: colourPickerServiceSpy },
                { providers: RgbaFormService, useValue: rgbaFormServiceSpy },
            ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(async(() => {
        fixture = TestBed.createComponent(RgbFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.rgbaFormGroup = rgbaFormGroupSpy;
        component['colourPickerService'] = colourPickerServiceSpy;
        component['rgbaFormService'] = rgbaFormServiceSpy;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(rgbaFormServiceSpy).toBeTruthy();
    });

    it('ngOnInit(): should subscribe to colourPickerService subjects', () => {
        const hueChangedSpy = spyOn(hueChanged, 'subscribe').and.callThrough();
        const saturationChangedSpy = spyOn(saturationChanged, 'subscribe').and.callThrough();
        const valueChangedSpy = spyOn(valueChanged, 'subscribe').and.callThrough();
        const alphaChangedSpy = spyOn(alphaChanged, 'subscribe').and.callThrough();
        component.ngOnInit();
        expect(hueChangedSpy).toHaveBeenCalled();
        expect(saturationChangedSpy).toHaveBeenCalled();
        expect(valueChangedSpy).toHaveBeenCalled();
        expect(alphaChangedSpy).toHaveBeenCalled();
    });

    it('ngOnInit(): should only call rgbaFormService.updateRgbForm once on colourPickerService subscriptions changes', () => {
        component.ngOnInit();
        hueChanged.next();
        saturationChanged.next();
        valueChanged.next();
        alphaChanged.next();
        expect(rgbaFormServiceSpy.updateRgbForm).toHaveBeenCalledTimes(1);
    });

    it('ngOnInit(): should subscribe to all the formControls valueChanges', () => {
        const redFormControlSpy = spyOn(redFormChanged, 'subscribe').and.callThrough();
        const greenFormControlSpy = spyOn(greenFormChanged, 'subscribe').and.callThrough();
        const blueFormControlSpy = spyOn(blueFormChanged, 'subscribe').and.callThrough();
        const alphaFromControlSpy = spyOn(alphaFormChanged, 'subscribe').and.callThrough();
        component.ngOnInit();
        expect(redFormControlSpy).toHaveBeenCalled();
        expect(greenFormControlSpy).toHaveBeenCalled();
        expect(blueFormControlSpy).toHaveBeenCalled();
        expect(alphaFromControlSpy).toHaveBeenCalled();
    });

    it('ngOnInit(): redform valueChanges should call rgbaFormServiceSpy.updateColourComponents', () => {
        component.ngOnInit();
        redFormChanged.next();
        expect(rgbaFormServiceSpy.updateColourComponents).toHaveBeenCalled();
    });

    it('ngOnInit(): greenForm valueChanges should call rgbaFormServiceSpy.updateColourComponents', () => {
        component.ngOnInit();
        greenFormChanged.next();
        expect(rgbaFormServiceSpy.updateColourComponents).toHaveBeenCalled();
    });

    it('ngOnInit(): blueForm valueChanges should call rgbaFormServiceSpy.updateColourComponents', () => {
        component.ngOnInit();
        blueFormChanged.next();
        expect(rgbaFormServiceSpy.updateColourComponents).toHaveBeenCalled();
    });

    it('ngOnInit(): alphaForm valueChanges should call rgbaFormServiceSpy.updateColourComponents', () => {
        component.ngOnInit();
        alphaFormChanged.next();
        expect(rgbaFormServiceSpy.updateColourComponents).toHaveBeenCalled();
    });

    it('ngOnDestroy(): should unsubscribe from colourSubscription and rgbaFormSubscription', () => {
        const colourSubscriptionSpy = spyOn(component['colourSubscription'], 'unsubscribe').and.callThrough();
        const rgbaFormSubscriptionSpy = spyOn(component['rgbaFormSubscription'], 'unsubscribe').and.callThrough();
        component.ngOnDestroy();
        expect(colourSubscriptionSpy).toHaveBeenCalled();
        expect(rgbaFormSubscriptionSpy).toHaveBeenCalled();
    });
});
