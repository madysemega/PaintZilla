import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { HistoryControlsComponent } from './history-controls.component';

describe('HistoryControlsComponent', () => {
    let component: HistoryControlsComponent;
    let fixture: ComponentFixture<HistoryControlsComponent>;

    let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;

    beforeEach(async(() => {
        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);

        TestBed.configureTestingModule({
            imports: [MatTooltipModule, CommonModule, MatTooltipModule, HotkeyModule.forRoot()],
            declarations: [HistoryControlsComponent],
            providers: [{ provide: HotkeysService, useValue: hotkeysServiceStub }],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HistoryControlsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
