import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { ColoursComponent } from '@app/drawing/components/colours/colours.component';
import { MouseButton } from '@app/tools/classes/mouse-button';
// tslint:disable: no-string-literal
export const DEFAULT_COLOUR = new Colour();
describe('ColoursComponent', () => {
    let component: ColoursComponent;
    let fixture: ComponentFixture<ColoursComponent>;
    let colourServiceSpy: jasmine.SpyObj<ColourService>;
    let primaryColourSelectedStub: boolean;
    beforeEach(async(() => {
        primaryColourSelectedStub = true;
        colourServiceSpy = jasmine.createSpyObj(
            'ColourService',
            [
                'selectPrimaryColour',
                'selectSecondaryColour',
                'swapComponentColours',
                'updateColour',
                'getPrimaryColour',
                'getSecondaryColour',
                'getPreviousColours',
                'setPrimaryColour',
                'setSecondaryColour',
            ],
            {
                primaryColourSelected: primaryColourSelectedStub,
            },
        );
        colourServiceSpy.getPrimaryColour.and.returnValue(DEFAULT_COLOUR);
        colourServiceSpy.getSecondaryColour.and.returnValue(DEFAULT_COLOUR);
        colourServiceSpy.getPreviousColours.and.returnValue([DEFAULT_COLOUR]);
        TestBed.configureTestingModule({
            imports: [MatTooltipModule, CommonModule],
            declarations: [ColoursComponent],
            providers: [{ provide: ColourService, useValue: colourServiceSpy }],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));
    beforeEach(async(() => {
        fixture = TestBed.createComponent(ColoursComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('selectPrimaryColour(): should call colourService.selectPrimaryColour()', () => {
        component.selectPrimaryColour();
        expect(colourServiceSpy.selectPrimaryColour).toHaveBeenCalled();
    });

    it('selectSecondaryColour(): should call colourService.selectSecondaryColour()', () => {
        component.selectSecondaryColour();
        expect(colourServiceSpy.selectSecondaryColour).toHaveBeenCalled();
    });

    it('swapColours(): should call colourService.swapComponentColours()', () => {
        component.swapColours();
        expect(colourServiceSpy.swapComponentColours).toHaveBeenCalled();
    });

    it('onPreviousColourClick(): should not call setPrimaryColour or setSecondaryColour if event.button is different from right and left', () => {
        const event = { button: MouseButton.Forward } as MouseEvent;
        component.showColourPicker = true;
        component.onPreviousColourClick(event, DEFAULT_COLOUR);
        expect(colourServiceSpy.setPrimaryColour).not.toHaveBeenCalled();
        expect(colourServiceSpy.setSecondaryColour).not.toHaveBeenCalled();
        expect(component.showColourPicker).toBeFalse();
    });

    it('onPreviousColourClick(): should call setPrimaryColour if event.button is left', () => {
        const event = { button: MouseButton.Left } as MouseEvent;
        component.showColourPicker = true;
        component.onPreviousColourClick(event, DEFAULT_COLOUR);
        expect(colourServiceSpy.setPrimaryColour).toHaveBeenCalled();
        expect(colourServiceSpy.setSecondaryColour).not.toHaveBeenCalled();
        expect(component.showColourPicker).toBeFalse();
    });

    it('onPreviousColourClick(): should call setSecondaryColour if event.button is right', () => {
        const event = { button: MouseButton.Right } as MouseEvent;
        component.showColourPicker = true;
        component.onPreviousColourClick(event, DEFAULT_COLOUR);
        expect(colourServiceSpy.setPrimaryColour).not.toHaveBeenCalled();
        expect(colourServiceSpy.setSecondaryColour).toHaveBeenCalled();
        expect(component.showColourPicker).toBeFalse();
    });

    it('onMouseEnter(): should set isHovering to true', () => {
        component.isHovering = false;
        component.onMouseEnter();
        expect(component.isHovering).toBeTrue();
    });

    it('onMouseLeave(): should set isHovering to false', () => {
        component.isHovering = true;
        component.onMouseLeave();
        expect(component.isHovering).toBeFalse();
    });

    it('onMouseDown(): should call updateColour if !isHovering && showColourPicker', () => {
        component.isHovering = false;
        component.showColourPicker = true;
        spyOn(component, 'updateColour').and.callThrough();
        component.onMouseDown();
        expect(component.updateColour).toHaveBeenCalled();
    });

    it('onMouseDown(): should not call updateColour if isHovering', () => {
        component.isHovering = true;
        component.showColourPicker = true;
        spyOn(component, 'updateColour').and.callThrough();
        component.onMouseDown();
        expect(component.updateColour).not.toHaveBeenCalled();
    });

    it('onMouseDown(): should not call updateColour if !showColourPicker', () => {
        component.isHovering = false;
        component.showColourPicker = false;
        spyOn(component, 'updateColour').and.callThrough();
        component.onMouseDown();
        expect(component.updateColour).not.toHaveBeenCalled();
    });

    it('updateColour(): should call colourService.updateColour', () => {
        component.updateColour();
        expect(colourServiceSpy.updateColour).toHaveBeenCalled();
    });

    it('primaryColour: should call colourService.getPrimaryColour', () => {
        const value = component.primaryColour;
        expect(value).toEqual(DEFAULT_COLOUR);
        expect(colourServiceSpy.getPrimaryColour).toHaveBeenCalled();
    });

    it('secondaryColour: should call colourService.getSecondaryColour', () => {
        const value = component.secondaryColour;
        expect(value).toEqual(DEFAULT_COLOUR);
        expect(colourServiceSpy.getSecondaryColour).toHaveBeenCalled();
    });

    it('previousColours: should call colourService.getPreviousColours', () => {
        const values = component.previousColours;
        expect(values).toEqual([DEFAULT_COLOUR]);
        expect(colourServiceSpy.getPreviousColours).toHaveBeenCalled();
    });
});
