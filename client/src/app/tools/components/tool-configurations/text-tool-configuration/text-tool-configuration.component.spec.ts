import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
            imports: [HotkeyModule.forRoot()],
            declarations: [TextToolConfigurationComponent],
            providers: [{ provide: HotkeysService, useValue: hotkeysServiceStub }],
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

    it('When font name is updated, event should be propagated to service', () => {
        const SERVICE_METHOD_SPY = spyOn(TestBed.inject(TextService), 'updateFontName').and.stub();
        const NEW_FONT_NAME = 'Times New Roman';

        component.updateFontName(NEW_FONT_NAME);
        expect(SERVICE_METHOD_SPY).toHaveBeenCalledWith(NEW_FONT_NAME);
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
