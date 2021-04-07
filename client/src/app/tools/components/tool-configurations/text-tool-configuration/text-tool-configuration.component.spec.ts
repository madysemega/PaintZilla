import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';
import { TextService } from '@app/tools/services/tools/text/text.service';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { TextToolConfigurationComponent } from './text-tool-configuration.component';

describe('TextToolConfigurationComponent', () => {
    let component: TextToolConfigurationComponent;
    let fixture: ComponentFixture<TextToolConfigurationComponent>;

    let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;

    beforeEach(async(() => {
        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);

        TestBed.configureTestingModule({
            imports: [HotkeyModule.forRoot(), MaterialModule, BrowserAnimationsModule, MatTooltipModule],
            declarations: [TextToolConfigurationComponent],
            providers: [{ provide: HotkeysService, useValue: hotkeysServiceStub }],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TextToolConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('When font size is updated, event should be propagated to service', () => {
        const SERVICE_METHOD_SPY = spyOn(TestBed.inject(TextService), 'updateFontSize').and.stub();
        const NEW_FONT_SIZE = 68;

        component.updateFontSize(NEW_FONT_SIZE);
        expect(SERVICE_METHOD_SPY).toHaveBeenCalledWith(NEW_FONT_SIZE);
    });
});
