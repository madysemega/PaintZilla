import { TestBed } from '@angular/core/testing';
import { IUserAction } from '@app/history/user-actions/user-action';
import { HistoryService } from './history.service';

// tslint:disable:no-string-literal
describe('HistoryService', () => {
    let service: HistoryService;

    const NB_USER_ACTIONS_TO_GENERATE = 5;
    let userActions: jasmine.SpyObj<IUserAction>[];

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(HistoryService);

        userActions = new Array<jasmine.SpyObj<IUserAction>>();
        for (let i = 0; i < NB_USER_ACTIONS_TO_GENERATE; ++i) {
            const userAction = jasmine.createSpyObj('IUserAction', ['apply']);
            userActions.push(userAction);
        }
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('undo should call all past user actions but the last if there are some', () => {
        userActions.forEach((userAction) => service.register(userAction));
        userActions.forEach((userAction) => expect(userAction.apply).not.toHaveBeenCalled());
        service.undo();
        userActions.slice(0, userActions.length - 1).forEach((userAction) => expect(userAction.apply).toHaveBeenCalled());
    });

    it('redo should call last undone user action if there is one', () => {
        userActions.forEach((userAction) => service.register(userAction));
        userActions.forEach((userAction) => expect(userAction.apply).not.toHaveBeenCalled());
        service.undo();
        service.redo();
        expect(userActions[userActions.length - 1].apply).toHaveBeenCalled();
    });

    it('redo should not call last undone user action if there is none', () => {
        service.undo();
        service.redo();
        expect(userActions[0].apply).not.toHaveBeenCalled();
    });

    it('do should register and apply a user action', () => {
        service.do(userActions[0]);
        expect(userActions[0].apply).toHaveBeenCalled();
        expect(service['past'][0]).toBe(userActions[0]);
    });

    it('undo should call all callbacks registered with onUndo if there are registered user actions', () => {
        let callbackCalled = false;
        userActions.forEach((userAction) => service.register(userAction));
        service.onUndo(() => (callbackCalled = true));
        service.undo();
        expect(callbackCalled).toBeTruthy();
    });

    it('undo should not call all callbacks registered with onUndo if there are no registered user actions', () => {
        let callbackCalled = false;
        service.onUndo(() => (callbackCalled = true));
        service.undo();
        expect(callbackCalled).toBeFalsy();
    });
});
