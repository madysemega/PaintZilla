import { TestBed } from '@angular/core/testing';
import { KeyboardAction } from './keyboard-action';
import { KeyboardService } from './keyboard.service';

// tslint:disable: no-any
describe('KeyboardService', () => {
    let service: KeyboardService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(KeyboardService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it("By default, context should be 'default'", () => {
        expect(service.context).toEqual('default');
    });

    it('should register actions properly', () => {
        const ACTION = {
            trigger: 'a',
            // tslint:disable-next-line: no-empty
            invoke: () => {},
            context: 'test',
        } as KeyboardAction;

        service.registerAction(ACTION);

        expect(true).toBeTrue();
    });
});
