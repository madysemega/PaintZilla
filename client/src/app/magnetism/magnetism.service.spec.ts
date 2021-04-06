import { TestBed } from '@angular/core/testing';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { BehaviorSubject } from 'rxjs';
import { MagnetismService } from './magnetism.service';

// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('MagnetismService', () => {
    let service: MagnetismService;
    let keyboardServiceStub: jasmine.SpyObj<KeyboardService>;

    beforeEach(() => {
        keyboardServiceStub = jasmine.createSpyObj('KeyboardService', ['registerAction']);
        TestBed.configureTestingModule({
            providers: [
                { provide: KeyboardService, useValue: keyboardServiceStub },
            ],
        });
        service = TestBed.inject(MagnetismService);
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

    it("Pressing the 'm' key should toggle magnetism", () => {
        const toggleMagnetismSpy = spyOn(service, 'toggleMagnetism').and.stub();
        
        keyboardServiceStub.registerAction.and.callFake((action) => action.invoke());
        service['registerKeyboardShortcuts']();

        expect(toggleMagnetismSpy).toHaveBeenCalled();
    });
});
