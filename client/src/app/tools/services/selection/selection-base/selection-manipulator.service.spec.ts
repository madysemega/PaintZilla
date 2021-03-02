import { TestBed } from '@angular/core/testing';
import { ResizingMode } from './resizing-mode';

import { SelectionManipulatorService } from './selection-manipulator.service';

describe('SelectionManipulatorService', () => {
    let service: SelectionManipulatorService;
    let mouseEvent: MouseEvent;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectionManipulatorService);


    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseUp should set resizingMode to off', () => {
        service.onMouseUp(mouseEvent);
        expect(service.resizingMode).toEqual(ResizingMode.off);
    });

});
