import { SimpleChange, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { ColourSelectorComponent } from '@app/tools/components/tool-configurations/colour-selector/colour-selector.component';
import { ColourSliderComponent } from '@app/tools/components/tool-configurations/colour-selector/colour-slider/colour-slider.component';
import { ColourToolService } from '@app/tools/services/tools/colour-tool.service';
import { ColourPaletteComponent } from './colour-palette.component';

describe('ColourPaletteComponent', () => {
    let component: ColourPaletteComponent;
    let fixture: ComponentFixture<ColourPaletteComponent>;
    let fixture2: ComponentFixture<ColourSliderComponent>;
    let fixture3: ComponentFixture<ColourSelectorComponent>;
    let getColourStub: jasmine.Spy<jasmine.Func>;
    let emitStub: jasmine.Spy<jasmine.Func>;
    let emitCStub: jasmine.Spy<jasmine.Func>;
    // let drawStub: jasmine.Spy<jasmine.Func>;
    let componentSlider: ColourSliderComponent;
    const MOUSE_EVENT = { offsetX: 0, offsetY: 0, button: 0 } as MouseEvent;
    const MOUSE_EVENT2 = { offsetX: 5, offsetY: 5, button: 0 } as MouseEvent;
    let TEST: string;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatSliderModule, MatIconModule],
            declarations: [ColourPaletteComponent, ColourSelectorComponent, ColourSliderComponent],
            providers: [ColourToolService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColourPaletteComponent);
        fixture2 = TestBed.createComponent(ColourSliderComponent);
        fixture3 = TestBed.createComponent(ColourSelectorComponent);
        component = fixture.componentInstance;
        componentSlider = fixture2.componentInstance;
        emitStub = spyOn(component, 'emitColour').and.stub();
        emitStub.and.callThrough();
        getColourStub = spyOn(component, 'getColourAtPosition').and.stub();
        getColourStub.and.callThrough();
        emitCStub = spyOn(component.colour, 'emit');
        // drawStub = spyOn(component, 'draw');
        component.hue = 'rgba(0, 0, 0, 1)';
        TEST = component.hue;
        fixture.detectChanges();
        fixture2.detectChanges();
        fixture3.detectChanges();
        // component.onMouseDown(mouseEvent);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('ngOnChanges calls emit', () => {
        component.onMouseDown(MOUSE_EVENT);
        componentSlider.onMouseMove(MOUSE_EVENT2);
        const CHANGES = { hue: new SimpleChange(TEST, 'rgba(10, 10, 10, 1)', false) } as SimpleChanges;
        component.ngOnChanges(CHANGES);
        expect(emitCStub).toHaveBeenCalled();
    });
    it('ngOnChanges does not call emit if pos is null', () => {
        componentSlider.onMouseMove(MOUSE_EVENT2);
        const CHANGES = { hue: new SimpleChange(TEST, 'rgba(10, 10, 10, 1)', false) } as SimpleChanges;
        component.mousedown = false;
        component.ngOnChanges(CHANGES);
        expect(emitCStub).not.toHaveBeenCalled();
    });
    it('onMouseUp does not allow onMouseDown to call emitColour', () => {
        component.onMouseUp(MOUSE_EVENT);
        component.onMouseMove(MOUSE_EVENT);
        expect(emitStub).not.toHaveBeenCalled();
    });
    it('onMouseMove calls getColour', () => {
        component.onMouseDown(MOUSE_EVENT);
        component.onMouseMove(MOUSE_EVENT);
        expect(getColourStub).toHaveBeenCalledWith(component.selectedPosition.x, component.selectedPosition.y);
    });
    it('getColourAtPosition defaults to 0 when an argument is above 255', () => {
        const VALUE_1 = 256;
        const VALU_2 = 256;
        expect(component.getColourAtPosition(VALUE_1, VALU_2)).toEqual('rgba(0,0,0,1)');
    });
    it('onMouseMove calls emitColour', () => {
        component.onMouseDown(MOUSE_EVENT);
        component.onMouseMove(MOUSE_EVENT);
        expect(emitStub).toHaveBeenCalledWith(component.selectedPosition.x, component.selectedPosition.y);
    });
    it('emitColour calls emit', () => {
        component.onMouseDown(MOUSE_EVENT);
        component.emitColour(component.selectedPosition.x, component.selectedPosition.y);
        const SENT_COL = component.getColourAtPosition(component.selectedPosition.x, component.selectedPosition.y);
        expect(emitCStub).toHaveBeenCalledWith(SENT_COL);
    });
});
