import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColourPickerComponent } from '@app/colour-picker/components/colour-picker/colour-picker.component';
import * as Constants from '@app/colour-picker/constants/colour-testing.constants';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
// tslint:disable: no-string-literal
describe('ColourPicker', () => {
    let component: ColourPickerComponent;
    let fixture: ComponentFixture<ColourPickerComponent>;
    let colourPickerServiceSpy: jasmine.SpyObj<ColourPickerService>;
    let colourServiceSpy: jasmine.SpyObj<ColourService>;

    beforeEach(() => {
        colourPickerServiceSpy = jasmine.createSpyObj('ColourPickerService', ['getCurrentColor']);
        colourPickerServiceSpy.getCurrentColor.and.returnValue(Constants.DEFAULT_COLOUR);
        colourServiceSpy = jasmine.createSpyObj('ColourService', [], {
            colourPickerService: colourPickerServiceSpy,
        });
        TestBed.configureTestingModule({
            imports: [MatTooltipModule, CommonModule, MatTooltipModule],
            declarations: [ColourPickerComponent],
            providers: [
                { provide: ColourService, useValue: colourServiceSpy },
                { provide: ColourPickerService, useValue: colourPickerServiceSpy },
            ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(async(() => {
        fixture = TestBed.createComponent(ColourPickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component['colourPickerService'] = colourPickerServiceSpy;
        component['colourService'] = colourServiceSpy;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('confirmColor(): colorPreview should emit', () => {
        const colorPreviewSpy = spyOn(component['colorPreview'], 'emit').and.callThrough();
        component.confirmColor();
        expect(colorPreviewSpy).toHaveBeenCalled();
    });

    it('onMouseEnter(): should set colourService.onColourPicker to true', () => {
        colourServiceSpy.onColourPicker = false;
        component.onMouseEnter();
        expect(colourServiceSpy.onColourPicker).toBeTrue();
    });

    it('onMouseLeave(): should set colourService.onColourPicker to false', () => {
        colourServiceSpy.onColourPicker = true;
        component.onMouseLeave();
        expect(colourServiceSpy.onColourPicker).toBeFalse();
    });

    it('get color(): should return DEFAULT_COLOUR', () => {
        expect(component.color).toEqual(Constants.DEFAULT_COLOUR);
    });
});
