import { TestBed } from '@angular/core/testing';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { SelectionManipulatorService } from './selection-manipulator.service';


describe('SelectionManipulatorService', () => {
    let service: SelectionManipulatorService;

    let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;

    beforeEach(() => {
        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);

        TestBed.configureTestingModule({
            imports: [HotkeyModule.forRoot()],
            providers: [{ provide: HotkeysService, useValue: hotkeysServiceStub }],
        });
        service = TestBed.inject(SelectionManipulatorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
