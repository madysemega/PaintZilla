import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EllipseToolConfigurationComponent } from './ellipse-tool-configuration.component';

describe('EllipseToolConfigurationComponent', () => {
    let component: EllipseToolConfigurationComponent;
    let fixture: ComponentFixture<EllipseToolConfigurationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatTooltipModule, CommonModule],
            declarations: [EllipseToolConfigurationComponent],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EllipseToolConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
