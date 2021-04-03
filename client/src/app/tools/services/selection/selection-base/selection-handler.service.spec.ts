import { TestBed } from '@angular/core/testing';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { SelectionHandlerService } from './selection-handler.service';


describe('SelectionHandlerService', () => {
    let service: SelectionHandlerService;

    let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;

    beforeEach(() => {
        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);
        TestBed.configureTestingModule({
            imports: [HotkeyModule.forRoot()],
            providers: [
                { provide: HotkeysService, useValue: hotkeysServiceStub },
            ]
        });
        service = TestBed.inject(SelectionHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
