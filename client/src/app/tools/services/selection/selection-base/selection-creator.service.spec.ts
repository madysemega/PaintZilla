import { TestBed } from '@angular/core/testing';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { SelectionCreatorService } from './selection-creator.service';


describe('SelectionCreatorService', () => {
    let service: SelectionCreatorService;

    let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;

    beforeEach(() => {
        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);

        TestBed.configureTestingModule({
            imports: [HotkeyModule.forRoot()],
            providers: [{ provide: HotkeysService, useValue: hotkeysServiceStub }],
        });
        service = TestBed.inject(SelectionCreatorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
