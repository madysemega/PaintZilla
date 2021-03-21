import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/app/classes/vec2';
import { EllipseService } from '@app/tools/services/tools/ellipse-service';
import { BehaviorSubject } from 'rxjs';

import { SelectionHelperService } from './selection-helper.service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-empty
// tslint:disable:max-line-length
describe('SelectionService', () => {
    let service: SelectionHelperService;
    let ellipseServiceMock: jasmine.SpyObj<EllipseService>;

    beforeEach(() => {
        ellipseServiceMock = jasmine.createSpyObj('EllipseService', ['getSquareAdjustedPerimeter', 'drawRectangle']);

        TestBed.configureTestingModule({
            providers: [{ provide: EllipseService, useValue: ellipseServiceMock }],
        });
        service = TestBed.inject(SelectionHelperService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getSquareAdjustedPerimeter should call getSquareAdjustedPerimeter from the ellipseRenderer', () => {
        const startPoint: Vec2 = { x: 5, y: 8 };
        const endPoint: Vec2 = { x: 4, y: 9 };
        service.getSquareAdjustedPerimeter(startPoint, endPoint);
        expect(ellipseServiceMock.getSquareAdjustedPerimeter).toHaveBeenCalled();
    });

    it('drawPerimeter should call drawRectangle from the ellipseRenderer', () => {
        const startPoint: Vec2 = { x: 5, y: 8 };
        const endPoint: Vec2 = { x: 4, y: 9 };
        const ctx: CanvasRenderingContext2D = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;
        service.drawPerimeter(ctx, startPoint, endPoint);
        expect(ellipseServiceMock.drawRectangle).toHaveBeenCalled();
    });

    it('setIsSelectionBeingManipulated should call next from BehaviorSubject', () => {
        const isSelectionBeingManipulated: BehaviorSubject<boolean> = new BehaviorSubject(true);
        service.isSelectionBeingManipulated = isSelectionBeingManipulated;
        const nextSpy = spyOn<any>(isSelectionBeingManipulated, 'next').and.callThrough();
        service.setIsSelectionBeingManipulated(true);
        expect(nextSpy).toHaveBeenCalled();
    });

    it('click should be detected as outside selection if isReversedX and mousePosition.x > topLeft.x + the detection offset', () => {
        const positions: Vec2[] = [
            { x: service.OUTSIDE_DETECTION_OFFSET_PX + 1, y: 0 },
            { x: 0, y: 0 },
            { x: 5, y: 6 },
        ];
        const output: boolean = service.isClickOutsideSelection(positions, true, false);
        expect(output).toEqual(true);
    });
    it('click should be detected as outside selection if not isReversedX and mousePosition.x > bottomRight.x + the detection offset', () => {
        const positions: Vec2[] = [
            { x: 10 + service.OUTSIDE_DETECTION_OFFSET_PX + 1, y: 0 },
            { x: 0, y: 0 },
            { x: 10, y: 6 },
        ];
        const output: boolean = service.isClickOutsideSelection(positions, false, false);
        expect(output).toEqual(true);
    });

    it('click should be detected as outside selection if not isReversedX and isReversedY and mousePosition.x > bottomRight.x + the detection offset', () => {
        const positions: Vec2[] = [
            { x: 10 + service.OUTSIDE_DETECTION_OFFSET_PX + 1, y: 0 },
            { x: 0, y: 0 },
            { x: 10, y: 6 },
        ];
        const output: boolean = service.isClickOutsideSelection(positions, false, true);
        expect(output).toEqual(true);
    });

    it('click should be detected as outside selection if isReversedY and mousePosition.y > topLeft.y + the detection offset', () => {
        const positions: Vec2[] = [
            { x: 0, y: service.OUTSIDE_DETECTION_OFFSET_PX + 1 },
            { x: 0, y: 0 },
            { x: 5, y: 6 },
        ];
        const output: boolean = service.isClickOutsideSelection(positions, false, true);
        expect(output).toEqual(true);
    });

    it('click should be detected as outside selection if not isReversedY and mousePosition.y > bottomRight.y + the detection offset', () => {
        const positions: Vec2[] = [
            { x: 0, y: 6 + service.OUTSIDE_DETECTION_OFFSET_PX + 1 },
            { x: 0, y: 0 },
            { x: 10, y: 6 },
        ];
        const output: boolean = service.isClickOutsideSelection(positions, false, true);
        expect(output).toEqual(true);
    });

    it('click should be detected as outside selection if not isReversedX and not isReversedY and mousePosition.y > bottomRight.y + the detection offset', () => {
        const positions: Vec2[] = [
            { x: 0, y: 6 + service.OUTSIDE_DETECTION_OFFSET_PX + 1 },
            { x: 0, y: 0 },
            { x: 10, y: 6 },
        ];
        const output: boolean = service.isClickOutsideSelection(positions, false, false);
        expect(output).toEqual(true);
    });

    it('click should be detected as outside selection if isReversedX and isReversedY and mousePosition.y > topLeft.y + the detection offset', () => {
        const positions: Vec2[] = [
            { x: 0, y: service.OUTSIDE_DETECTION_OFFSET_PX + 1 },
            { x: 0, y: 0 },
            { x: 10, y: 6 },
        ];
        const output: boolean = service.isClickOutsideSelection(positions, true, true);
        expect(output).toEqual(true);
    });

    it('add should not change the amount vector provided', () => {
        const vect: Vec2 = { x: 9, y: 6 };
        const amount: Vec2 = { x: 9, y: 6 };
        const amountCopy: Vec2 = { x: 9, y: 6 };
        service.addInPlace(vect, amount);
        expect(amount).toEqual(amountCopy);
    });

    it('convertToMovement should not change any of the provided vectors', () => {
        const mousePos: Vec2 = { x: 9, y: 6 };
        const mouseDownLastPos: Vec2 = { x: 4, y: 3 };
        const mousePosCopy: Vec2 = { x: 9, y: 6 };
        const mouseDownLastPosCopy: Vec2 = { x: 4, y: 3 };

        service.sub(mousePos, mouseDownLastPos);
        expect(mousePos).toEqual(mousePosCopy);
        expect(mouseDownLastPos).toEqual(mouseDownLastPosCopy);
    });
});
