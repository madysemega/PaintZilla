import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';

import { RectangleSelectionComponent } from './rectangle-selection.component';

describe('RectangleSelectionComponent', () => {
    let component: RectangleSelectionComponent;
    let fixture: ComponentFixture<RectangleSelectionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatTooltipModule],
            declarations: [RectangleSelectionComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RectangleSelectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
