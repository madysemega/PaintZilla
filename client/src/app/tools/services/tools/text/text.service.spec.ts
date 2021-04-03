import { TestBed } from '@angular/core/testing';
import { HotkeyModule, HotkeyOptions, HotkeysService } from 'angular2-hotkeys';
import { TextService } from './text.service';

describe('TextService', () => {
    let service: TextService;
    let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;

    beforeEach(() => {
        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);

        TestBed.configureTestingModule({
            imports: [HotkeyModule.forRoot()],
            providers: [
                { provide: HotkeyOptions, useValue: hotkeysServiceStub },
            ]
        });
        service = TestBed.inject(TextService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
