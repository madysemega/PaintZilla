import { SimpleChange, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColourSelectorComponent } from '@app/tools/components/tool-configurations/colour-selector/colour-selector.component';
import { ColourSliderComponent } from '@app/tools/components/tool-configurations/colour-selector/colour-slider/colour-slider.component';
import { ColourPaletteComponent } from './colour-palette.component';

describe('ColourPaletteComponent', () => {
    let component: ColourPaletteComponent;
    let fixture: ComponentFixture<ColourPaletteComponent>;
    let fixture2: ComponentFixture<ColourSliderComponent>;
    let fixture3: ComponentFixture<ColourSelectorComponent>;
    let getColourStub: jasmine.Spy<jasmine.Func>;
    let emitStub: jasmine.Spy<jasmine.Func>;
    let emitCStub: jasmine.Spy<jasmine.Func>;
    let componentSlider: ColourSliderComponent;
    const mouseEvent = { offsetX: 0, offsetY: 0, button: 0 } as MouseEvent;
    const mouseEvent2 = { offsetX: 5, offsetY: 5, button: 0 } as MouseEvent;
    let TEST: string;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColourPaletteComponent, ColourSelectorComponent, ColourSliderComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColourPaletteComponent);
        fixture2 = TestBed.createComponent(ColourSliderComponent);
        fixture3 = TestBed.createComponent(ColourSelectorComponent);
        component = fixture.componentInstance;
        componentSlider = fixture2.componentInstance;
        emitStub = spyOn(component, 'emitColour').and.stub();
        getColourStub = spyOn(component, 'getColourAtPosition').and.stub();
        getColourStub.and.callThrough();
        emitCStub = spyOn(component.colour, 'emit');
        component.hue = 'rgba(0, 0, 0, 1)';
        TEST = component.hue;
        fixture.detectChanges();
        fixture2.detectChanges();
        fixture3.detectChanges();
        component.onMouseDown(mouseEvent);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('ngOnChanges calls emit', () => {
        componentSlider.onMouseMove(mouseEvent2);
        const CHANGES = { hue: new SimpleChange(TEST, 'rgba(10, 10, 10, 1)', false) } as SimpleChanges;
        component.ngOnChanges(CHANGES);
        expect(emitCStub).toHaveBeenCalled();
    });
    it('onMouseUp does not allow onMouseDown to call emitColour', () => {
        component.onMouseUp(mouseEvent);
        component.onMouseMove(mouseEvent);
        expect(emitStub).not.toHaveBeenCalled();
    });
    it('onMouseMove calls getColour', () => {
        component.onMouseMove(mouseEvent);
        expect(getColourStub).toHaveBeenCalledWith(component.selectedPosition.x, component.selectedPosition.y);
    });
    it('getColourAtPosition defaults to 0 when an argument is above 255', () => {
        const VALUE1 = 256;
        const VALUE2 = 256;
        expect(component.getColourAtPosition(VALUE1, VALUE2)).toEqual('rgba(0,0,0,1)');
    });
    it('onMouseMove calls emitColour', () => {
        component.onMouseMove(mouseEvent);
        expect(emitStub).toHaveBeenCalledWith(component.selectedPosition.x, component.selectedPosition.y);
    });
    it('emitColour calls getColour', () => {
        component.emitColour(component.selectedPosition.x, component.selectedPosition.y);
        const SENTCOL = component.getColourAtPosition(component.selectedPosition.x, component.selectedPosition.y);
        expect(emitCStub).toHaveBeenCalledWith(SENTCOL);
    });
});
