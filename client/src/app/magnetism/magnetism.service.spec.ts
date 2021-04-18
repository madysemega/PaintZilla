import { TestBed } from '@angular/core/testing';
import { HistoryService } from '@app/history/service/history.service';
import { IUserAction } from '@app/history/user-actions/user-action';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { BehaviorSubject } from 'rxjs';
import { MagnetismService } from './magnetism.service';

// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('MagnetismService', () => {
    let service: MagnetismService;
    let keyboardServiceStub: jasmine.SpyObj<KeyboardService>;
    let historyServiceStub: HistoryService;
    let userActions: jasmine.SpyObj<IUserAction>[];
    const NB_USER_ACTIONS_TO_GENERATE = 5;

    beforeEach(() => {
        keyboardServiceStub = jasmine.createSpyObj('KeyboardService', ['registerAction']);
        historyServiceStub = jasmine.createSpyObj('HistoryService', ['afterUndo']);
        TestBed.configureTestingModule({
            providers: [{ provide: KeyboardService, useValue: keyboardServiceStub }],
        });
        service = TestBed.inject(MagnetismService);
        historyServiceStub = TestBed.inject(HistoryService);
        userActions = new Array<jasmine.SpyObj<IUserAction>>();
        for (let i = 0; i < NB_USER_ACTIONS_TO_GENERATE; ++i) {
            const userAction = jasmine.createSpyObj('IUserAction', ['apply']);
            userActions.push(userAction);
        }
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('toggling magnetism twice should not change initial value', () => {
        service.isActivated = new BehaviorSubject(false);
        service.toggleMagnetism();
        service.toggleMagnetism();
        expect(service.isActivated.value).toEqual(false);
    });
    it('should call toggleGrid on afterUndo emit', async () => {
        let callbackCalled = false;
        userActions.forEach((userAction) => historyServiceStub.register(userAction));
        historyServiceStub.afterUndo(() => (callbackCalled = true));
        await historyServiceStub.undo();
        expect(callbackCalled).toBeTruthy();
    });

    it("Pressing the 'm' key should toggle magnetism", () => {
        const toggleMagnetismSpy = spyOn(service, 'toggleMagnetism').and.stub();

        keyboardServiceStub.registerAction.and.callFake((action) => action.invoke());
        service['registerKeyboardShortcuts']();

        expect(toggleMagnetismSpy).toHaveBeenCalled();
    });
});
