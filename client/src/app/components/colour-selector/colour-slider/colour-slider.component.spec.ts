import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColourSliderComponent } from './colour-slider.component';

describe('ColourSliderComponent', () => {
    let component: ColourSliderComponent;
    let fixture: ComponentFixture<ColourSliderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColourSliderComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColourSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
