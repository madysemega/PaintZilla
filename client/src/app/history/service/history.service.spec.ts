import { TestBed } from '@angular/core/testing';
import { IUserAction } from '@app/history/user-actions/user-action';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { HistoryService } from './history.service';

// tslint:disable:no-string-literal
// tslint:disable:no-any
describe('HistoryService', () => {
    let service: HistoryService;

    let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;

    const NB_USER_ACTIONS_TO_GENERATE = 5;
    let userActions: jasmine.SpyObj<IUserAction>[];

    let undoSpy: jasmine.Spy<any>;
    let redoSpy: jasmine.Spy<any>;

    beforeEach(() => {
        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);

        TestBed.configureTestingModule({
            imports: [HotkeyModule.forRoot()],
            providers: [{ provide: HotkeysService, useValue: hotkeysServiceStub }, { provide: KeyboardService }],
        });
        service = TestBed.inject(HistoryService);

        undoSpy = spyOn(service, 'undo').and.callThrough();
        redoSpy = spyOn(service, 'redo').and.callThrough();

        userActions = new Array<jasmine.SpyObj<IUserAction>>();
        for (let i = 0; i < NB_USER_ACTIONS_TO_GENERATE; ++i) {
            const userAction = jasmine.createSpyObj('IUserAction', ['apply']);
            userActions.push(userAction);
        }
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('undo should call all past user actions but the last if there are some', async () => {
        userActions.forEach((userAction) => service.register(userAction));
        userActions.forEach((userAction) => expect(userAction.apply).not.toHaveBeenCalled());
        await service.undo();
        userActions.slice(0, userActions.length - 1).forEach((userAction) => expect(userAction.apply).toHaveBeenCalled());
    });

    it('redo should call last undone user action if there is one', async () => {
        userActions.forEach((userAction) => service.register(userAction));
        userActions.forEach((userAction) => expect(userAction.apply).not.toHaveBeenCalled());
        await service.undo();
        service.redo();
        expect(userActions[userActions.length - 1].apply).toHaveBeenCalled();
    });

    it('redo should not call last undone user action if there is none', async () => {
        await service.undo();
        service.redo();
        expect(userActions[0].apply).not.toHaveBeenCalled();
    });

    it('do should register and apply a user action', () => {
        service.do(userActions[0]);
        expect(userActions[0].apply).toHaveBeenCalled();
        expect(service['past'][0]).toBe(userActions[0]);
    });

    it('undo should call all callbacks registered with onUndo if there are registered user actions', async () => {
        let callbackCalled = false;
        userActions.forEach((userAction) => service.register(userAction));
        service.onUndo(() => (callbackCalled = true));
        await service.undo();
        expect(callbackCalled).toBeTruthy();
    });

    it('undo should not call any callback registered with onUndo if there are no registered user actions', async () => {
        let callbackCalled = false;
        service.onUndo(() => (callbackCalled = true));
        await service.undo();
        expect(callbackCalled).toBeFalsy();
    });

    it('should be undoable if unlocked and user actions have been registered', () => {
        service.isLocked = false;
        userActions.forEach((userAction) => service.register(userAction));

        expect(service.canUndo()).toBeTrue();
    });

    it('should not be undoable if locked or no user action has been registered', () => {
        // unlocked & no action registered
        service.isLocked = false;
        expect(service.canUndo()).toBeFalse();

        // locked & no action registered
        service.isLocked = true;
        expect(service.canUndo()).toBeFalse();

        // locked & actions registered
        userActions.forEach((userAction) => service.register(userAction));
        service.isLocked = true;
        expect(service.canUndo()).toBeFalse();
    });

    it('should be redoable if unlocked  and user actions have been undone', async () => {
        service.isLocked = false;
        userActions.forEach((userAction) => service.register(userAction));
        await service.undo();

        expect(service.canRedo()).toBeTrue();
    });

    it('should not be redoable if locked or no user action has been undone', async () => {
        // unlocked & no action undone
        service.isLocked = false;
        expect(service.canRedo()).toBeFalse();

        // locked & no action undone
        service.isLocked = true;
        expect(service.canRedo()).toBeFalse();

        // locked & action undone
        userActions.forEach((userAction) => service.register(userAction));
        await service.undo();
        service.isLocked = true;
        expect(service.canRedo()).toBeFalse();
    });

    it('clear() should remove all past user actions', () => {
        service.isLocked = true;
        userActions.forEach((userAction) => service.register(userAction));
        service.clear();

        expect(service['past'].length).toEqual(0);
    });

    it('clear() should remove all future user actions', () => {
        service.isLocked = true;
        userActions.forEach((userAction) => service.register(userAction));
        service.clear();

        expect(service['future'].length).toEqual(0);
    });

    it('clear() should unlock history service', () => {
        service.isLocked = true;
        userActions.forEach((userAction) => service.register(userAction));
        service.clear();

        expect(service.isLocked).toBeFalse();
    });

    it('Ctrl+Z should call undo() when in editor', () => {
        const keyboardService = TestBed.inject(KeyboardService);
        keyboardService.context = 'editor';

        spyOn(keyboardService, 'registerAction').and.callFake((action) => {
            action.invoke();
        });

        service['registerUndoKeyboardShortcut']();

        expect(undoSpy).toHaveBeenCalled();
    });

    it('Ctrl+Shift+Z should call redo() when in editor', () => {
        const keyboardService = TestBed.inject(KeyboardService);
        keyboardService.context = 'editor';

        spyOn(keyboardService, 'registerAction').and.callFake((action) => {
            action.invoke();
        });

        service['registerRedoKeyboardShortcut']();

        expect(redoSpy).toHaveBeenCalled();
    });
});
