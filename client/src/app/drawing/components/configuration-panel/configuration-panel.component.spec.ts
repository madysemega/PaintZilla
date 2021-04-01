import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfigurationPanelComponent } from './configuration-panel.component';

describe('ConfigurationPanelComponent', () => {
    let component: ConfigurationPanelComponent;
    let fixture: ComponentFixture<ConfigurationPanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, MatTooltipModule],
            declarations: [ConfigurationPanelComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigurationPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
