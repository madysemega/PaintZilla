import { TestBed } from '@angular/core/testing';
import { Hotkey, HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { KeyboardAction } from './keyboard-action';
import { KeyboardService } from './keyboard.service';

// tslint:disable: no-any
describe('KeyboardService', () => {
    let service: KeyboardService;

    let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;

    beforeEach(() => {
        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);

        TestBed.configureTestingModule({
            imports: [HotkeyModule.forRoot()],
            providers: [{ provide: HotkeysService, useValue: hotkeysServiceStub }],
        });
        service = TestBed.inject(KeyboardService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it("By default, context should be 'default'", () => {
        expect(service.context).toEqual('default');
    });

    it('should register actions properly', () => {
        hotkeysServiceStub.add.and.callFake((hotkey: Hotkey) => {
            hotkey.callback(new KeyboardEvent(''), '');
            return hotkey;
        });

        let hasActionBeenInvoked = false;

        const CURRENT_CONTEXT = 'test';

        const ACTION = {
            trigger: 'a',
            // tslint:disable-next-line: no-empty
            invoke: () => (hasActionBeenInvoked = true),
            uniqueName: 'test',
            contexts: [CURRENT_CONTEXT],
        } as KeyboardAction;

        service.context = CURRENT_CONTEXT;

        service.registerAction(ACTION);

        expect(hasActionBeenInvoked).toBeTrue();
    });

    it('Registered actions should not be called if current context element of their contexts', () => {
        hotkeysServiceStub.add.and.callFake((hotkey: Hotkey) => {
            hotkey.callback(new KeyboardEvent(''), '');
            return hotkey;
        });

        let hasActionBeenInvoked = false;

        const ACTION = {
            trigger: 'a',
            // tslint:disable-next-line: no-empty
            invoke: () => (hasActionBeenInvoked = true),
            uniqueName: 'test',
            contexts: ['test'],
        } as KeyboardAction;

        service.registerAction(ACTION);

        expect(hasActionBeenInvoked).toBeFalse();
    });

    it('saveContext(), then restoreContext() should set context to its original value', () => {
        const ORIGINAL_CONTEXT = 'test-1';
        const NEW_CONTEXT = 'test-2';

        service.context = ORIGINAL_CONTEXT;
        service.saveContext();
        service.context = NEW_CONTEXT;
        service.restoreContext();

        expect(service.context).toEqual(ORIGINAL_CONTEXT);
    });

    it('saveContext(), then restoreContext() should work with multiple consecutive save/restore', () => {
        const ORIGINAL_CONTEXT = 'test-1';
        const LATENT_CONTEXT = 'test-2';
        const FINAL_CONTEXT = 'test-3';

        service.context = ORIGINAL_CONTEXT;
        service.saveContext();
        service.context = LATENT_CONTEXT;
        service.saveContext();
        service.context = FINAL_CONTEXT;

        service.restoreContext();
        expect(service.context).toEqual(LATENT_CONTEXT);

        service.restoreContext();
        expect(service.context).toEqual(ORIGINAL_CONTEXT);
    });

    it('restoreContext() should set context to default value if no save operation has been performed', () => {
        const INITIAL_CONTEXT = 'test';
        const DEFAULT_CONTEXT = KeyboardService.DEFAULT_CONTEXT;

        service.context = INITIAL_CONTEXT;
        service.restoreContext();

        expect(service.context).toEqual(DEFAULT_CONTEXT);
    });
});
