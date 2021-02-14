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
    // let componentSel: ColourSelectorComponent;
    const mouseEvent = { offsetX: 50, offsetY: 30, button: 0 } as MouseEvent;
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
        // componentSel = fixture3.componentInstance;
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
        component.selectedPosition = { x: 20, y: 20 };
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('ngOnChanges changes the hue value', () => {
        const CHANGES = { hue: new SimpleChange(TEST, 'rgba(10, 10, 10, 1)', false) } as SimpleChanges;
        component.ngOnChanges(CHANGES);
        fixture.detectChanges();
        const CURHUE = component.hue;
        console.log(CURHUE + 'lolol');
        expect(TEST).not.toEqual(CURHUE);
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
