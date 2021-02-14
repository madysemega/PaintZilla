import { SimpleChange, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColourSelectorComponent } from '@app/tools/components/tool-configurations/colour-selector/colour-selector.component';
import { ColourSliderComponent } from '@app/tools/components/tool-configurations/colour-selector/colour-slider/colour-slider.component';
import { ColourPaletteComponent } from './colour-palette.component';

describe('ColourPaletteComponent', () => {
    let component: ColourPaletteComponent;
    let fixture: ComponentFixture<ColourPaletteComponent>;
    let fixture2: ComponentFixture<ColourSelectorComponent>;
    let selectorComp: ColourSelectorComponent;
    const mouseEvent = { offsetX: 0, offsetY: 30, button: 0 } as MouseEvent;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColourPaletteComponent, ColourSelectorComponent, ColourSliderComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColourPaletteComponent);
        fixture2 = TestBed.createComponent(ColourSelectorComponent);
        component = fixture.componentInstance;
        selectorComp = fixture2.componentInstance;
        selectorComp.hue = 'rgba(0, 0, 0, 1)';
        fixture.detectChanges();
        fixture2.detectChanges();
        component.onMouseDown(mouseEvent);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('ngOnChanges changes the hue value', () => {
        component.selectedPosition = { x: 20, y: 20 };
        const PREVHUE = component.hue;
        const CHANGES = { hue: new SimpleChange(PREVHUE, 'rgba(10, 10, 10, 1)', false) } as SimpleChanges;
        component.ngOnChanges(CHANGES);
        const CURHUE = component.hue;
        console.log(CURHUE);
        expect(PREVHUE).not.toEqual(CURHUE);
    });
});
