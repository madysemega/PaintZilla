import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';
import { TextService } from '@app/tools/services/tools/text/text.service';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { TextToolConfigurationComponent } from './text-tool-configuration.component';

// tslint:disable:no-string-literal
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

        spyOn(TestBed.inject(TextService), 'updateAlignment').and.stub();
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

    it('Font size should be that of the service', () => {
        const EXPECTED_SIZE = 24;
        spyOn(component['service'], 'getFontSize').and.returnValue(EXPECTED_SIZE);
        expect(component.fontSize).toEqual(EXPECTED_SIZE);
    });

    it('When font name is updated, event should be propagated to service', () => {
        const SERVICE_METHOD_SPY = spyOn(TestBed.inject(TextService), 'updateFontName').and.stub();
        const NEW_FONT_NAME = 'Times New Roman';

        component.updateFontName(NEW_FONT_NAME);
        expect(SERVICE_METHOD_SPY).toHaveBeenCalledWith(NEW_FONT_NAME);
    });

    it('Font name should be that of the service', () => {
        const EXPECTED_NAME = 'Arial';
        spyOn(component['service'], 'getFontName').and.returnValue(EXPECTED_NAME);
        expect(component.fontName).toEqual(EXPECTED_NAME);
    });

    it('Name select should be blurable', () => {
        const blurSpy = spyOn(component.fontNameSelect._elementRef.nativeElement, 'blur').and.stub();
        component.blurFontNameSelect();
        expect(blurSpy).toHaveBeenCalled();
    });

    it('When font isBold is updated, event should be propagated to service', () => {
        const SERVICE_METHOD_SPY = spyOn(TestBed.inject(TextService), 'updateFontIsBold').and.stub();
        const NEW_FONT_IS_BOLD = true;

        component.updateFontIsBold(NEW_FONT_IS_BOLD);
        expect(SERVICE_METHOD_SPY).toHaveBeenCalledWith(NEW_FONT_IS_BOLD);
    });

    it('When font isItalic is updated, event should be propagated to service', () => {
        const SERVICE_METHOD_SPY = spyOn(TestBed.inject(TextService), 'updateFontIsItalic').and.stub();
        const NEW_FONT_IS_ITALIC = true;

        component.updateFontIsItalic(NEW_FONT_IS_ITALIC);
        expect(SERVICE_METHOD_SPY).toHaveBeenCalledWith(NEW_FONT_IS_ITALIC);
    });
});
