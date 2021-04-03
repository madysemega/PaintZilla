import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/app/classes/vec2';
import { EllipseService } from '@app/tools/services/tools/ellipse-service';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { BehaviorSubject } from 'rxjs';
import { GridMovementAnchor } from './selection-constants';
import { SelectionHelperService } from './selection-helper.service';


// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-empty
// tslint:disable:max-line-length
// tslint:disable:max-file-line-count
describe('SelectionHelperService', () => {
    let service: SelectionHelperService;
    let ellipseServiceMock: jasmine.SpyObj<EllipseService>;

    let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;

    beforeEach(() => {
        ellipseServiceMock = jasmine.createSpyObj('EllipseService', ['getSquareAdjustedPerimeter', 'drawRectangle']);
        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);

        TestBed.configureTestingModule({
            imports: [HotkeyModule.forRoot()],
            providers: [
                { provide: EllipseService, useValue: ellipseServiceMock },
                { provide: HotkeysService, useValue: hotkeysServiceStub },
            ],
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

    it('moveAlongTheGrid should call computeMovementAlongGrid with Math.round in case of a MouseEvent', () => {
        const movement: Vec2 = { x: 9, y: 6 };
        const isMouseMovement = true;
        const gridCellSize = 5;
        const anchor: GridMovementAnchor = GridMovementAnchor.bottomL;
        const topLeft: Vec2 = { x: 4, y: 3 };
        const bottomRight: Vec2 = { x: 9, y: 6 };
        const isReversed: boolean[] = [false, false];
        const anchorPosition: Vec2 = { x: 5, y: 7 };
        spyOn<any>(service, 'getAnchorPosition').and.returnValue(anchorPosition);
        const computeMovementAlongGridSpy: jasmine.Spy<any> = spyOn<any>(service, 'computeMovementAlongGrid');
        service.moveAlongTheGrid(movement, isMouseMovement, gridCellSize, anchor, topLeft, bottomRight, isReversed);
        expect(computeMovementAlongGridSpy).toHaveBeenCalledWith(anchorPosition, movement, gridCellSize, Math.round);
    });

    it('moveAlongTheGrid should call computeMovementAlongGrid with Math.ceil if magnetisme is on with a keyboardEvent and increase movement ', () => {
        const movement: Vec2 = { x: 9, y: 0 };
        const isMouseMovement = false;
        const gridCellSize = 5;
        const anchor: GridMovementAnchor = GridMovementAnchor.bottomL;
        const topLeft: Vec2 = { x: 4, y: 3 };
        const bottomRight: Vec2 = { x: 9, y: 6 };
        const isReversed: boolean[] = [false, false];
        const anchorPosition: Vec2 = { x: 5, y: 7 };
        spyOn<any>(service, 'getAnchorPosition').and.returnValue(anchorPosition);
        const computeMovementAlongGridSpy: jasmine.Spy<any> = spyOn<any>(service, 'computeMovementAlongGrid');
        service.moveAlongTheGrid(movement, isMouseMovement, gridCellSize, anchor, topLeft, bottomRight, isReversed);
        expect(computeMovementAlongGridSpy).toHaveBeenCalledWith(anchorPosition, movement, gridCellSize, Math.ceil);
    });

    it('moveAlongTheGrid should call computeMovementAlongGrid with Math.floor if magnetisme is on with a keyboardEvent and decrease movement ', () => {
        const movement: Vec2 = { x: -9, y: 0 };
        const isMouseMovement = false;
        const gridCellSize = 5;
        const anchor: GridMovementAnchor = GridMovementAnchor.bottomL;
        const topLeft: Vec2 = { x: 4, y: 3 };
        const bottomRight: Vec2 = { x: 9, y: 6 };
        const isReversed: boolean[] = [false, false];
        const anchorPosition: Vec2 = { x: 5, y: 7 };
        spyOn<any>(service, 'getAnchorPosition').and.returnValue(anchorPosition);
        const computeMovementAlongGridSpy: jasmine.Spy<any> = spyOn<any>(service, 'computeMovementAlongGrid');
        service.moveAlongTheGrid(movement, isMouseMovement, gridCellSize, anchor, topLeft, bottomRight, isReversed);
        expect(computeMovementAlongGridSpy).toHaveBeenCalledWith(anchorPosition, movement, gridCellSize, Math.floor);
    });

    it('moveAlongTheGrid should not call computeMovementAlongGrid if magnetisme is off (<=> gridCellSize < 0) ', () => {
        const movement: Vec2 = { x: -9, y: 0 };
        const isMouseMovement = false;
        const gridCellSize = -1;
        const anchor: GridMovementAnchor = GridMovementAnchor.bottomL;
        const topLeft: Vec2 = { x: 4, y: 3 };
        const bottomRight: Vec2 = { x: 9, y: 6 };
        const isReversed: boolean[] = [false, false];
        const anchorPosition: Vec2 = { x: 5, y: 7 };
        spyOn<any>(service, 'getAnchorPosition').and.returnValue(anchorPosition);
        const computeMovementAlongGridSpy: jasmine.Spy<any> = spyOn<any>(service, 'computeMovementAlongGrid');
        service.moveAlongTheGrid(movement, isMouseMovement, gridCellSize, anchor, topLeft, bottomRight, isReversed);
        expect(computeMovementAlongGridSpy).not.toHaveBeenCalled();
    });

    it('getAnchorPosition should return the correct position according to the given anchor point topL', () => {
        const X = 0;
        const Y = 1;

        const anchor: GridMovementAnchor = GridMovementAnchor.topL;
        const topLeft: Vec2 = { x: 4, y: 3 };
        const bottomRight: Vec2 = { x: 9, y: 6 };
        const isReversed: boolean[] = [false, false];

        const actualTopLeft: Vec2 = { x: topLeft.x, y: topLeft.y };

        if (isReversed[X]) {
            actualTopLeft.x = bottomRight.x;
        }
        if (isReversed[Y]) {
            actualTopLeft.y = bottomRight.y;
        }

        expect(service.getAnchorPosition(anchor, topLeft, bottomRight, isReversed)).toEqual({ x: actualTopLeft.x, y: actualTopLeft.y });
    });

    it('getAnchorPosition should return the correct position according to the given anchor point middleL', () => {
        const anchor: GridMovementAnchor = GridMovementAnchor.middleL;
        const topLeft: Vec2 = { x: 4, y: 3 };
        const bottomRight: Vec2 = { x: 9, y: 6 };
        const isReversed: boolean[] = [false, false];

        // const width: number = Math.abs(topLeft.x - bottomRight.x);
        const height: number = Math.abs(topLeft.y - bottomRight.y);
        const X = 0;
        const Y = 1;

        const actualTopLeft: Vec2 = { x: topLeft.x, y: topLeft.y };

        if (isReversed[X]) {
            actualTopLeft.x = bottomRight.x;
        }
        if (isReversed[Y]) {
            actualTopLeft.y = bottomRight.y;
        }

        expect(service.getAnchorPosition(anchor, topLeft, bottomRight, isReversed)).toEqual({ x: actualTopLeft.x, y: actualTopLeft.y + height / 2 });
    });

    it('getAnchorPosition should return the correct position according to the given anchor point bottomL', () => {
        const anchor: GridMovementAnchor = GridMovementAnchor.bottomL;
        const topLeft: Vec2 = { x: 4, y: 3 };
        const bottomRight: Vec2 = { x: 9, y: 6 };
        const isReversed: boolean[] = [false, false];

        // const width: number = Math.abs(topLeft.x - bottomRight.x);
        const height: number = Math.abs(topLeft.y - bottomRight.y);
        const X = 0;
        const Y = 1;

        const actualTopLeft: Vec2 = { x: topLeft.x, y: topLeft.y };

        if (isReversed[X]) {
            actualTopLeft.x = bottomRight.x;
        }
        if (isReversed[Y]) {
            actualTopLeft.y = bottomRight.y;
        }

        expect(service.getAnchorPosition(anchor, topLeft, bottomRight, isReversed)).toEqual({ x: actualTopLeft.x, y: actualTopLeft.y + height });
    });

    it('getAnchorPosition should return the correct position according to the given anchor point bottomM', () => {
        const anchor: GridMovementAnchor = GridMovementAnchor.bottomM;
        const topLeft: Vec2 = { x: 4, y: 3 };
        const bottomRight: Vec2 = { x: 9, y: 6 };
        const isReversed: boolean[] = [false, false];

        const width: number = Math.abs(topLeft.x - bottomRight.x);
        const height: number = Math.abs(topLeft.y - bottomRight.y);
        const X = 0;
        const Y = 1;

        const actualTopLeft: Vec2 = { x: topLeft.x, y: topLeft.y };

        if (isReversed[X]) {
            actualTopLeft.x = bottomRight.x;
        }
        if (isReversed[Y]) {
            actualTopLeft.y = bottomRight.y;
        }

        expect(service.getAnchorPosition(anchor, topLeft, bottomRight, isReversed)).toEqual({
            x: actualTopLeft.x + width / 2,
            y: actualTopLeft.y + height,
        });
    });

    it('getAnchorPosition should return the correct position according to the given anchor point bottomR', () => {
        const anchor: GridMovementAnchor = GridMovementAnchor.bottomR;
        const topLeft: Vec2 = { x: 4, y: 3 };
        const bottomRight: Vec2 = { x: 9, y: 6 };
        const isReversed: boolean[] = [false, false];

        const width: number = Math.abs(topLeft.x - bottomRight.x);
        const height: number = Math.abs(topLeft.y - bottomRight.y);
        const X = 0;
        const Y = 1;

        const actualTopLeft: Vec2 = { x: topLeft.x, y: topLeft.y };

        if (isReversed[X]) {
            actualTopLeft.x = bottomRight.x;
        }
        if (isReversed[Y]) {
            actualTopLeft.y = bottomRight.y;
        }

        expect(service.getAnchorPosition(anchor, topLeft, bottomRight, isReversed)).toEqual({
            x: actualTopLeft.x + width,
            y: actualTopLeft.y + height,
        });
    });

    it('getAnchorPosition should return the correct position according to the given anchor point middleR', () => {
        const anchor: GridMovementAnchor = GridMovementAnchor.middleR;
        const topLeft: Vec2 = { x: 4, y: 3 };
        const bottomRight: Vec2 = { x: 9, y: 6 };
        const isReversed: boolean[] = [false, false];

        const width: number = Math.abs(topLeft.x - bottomRight.x);
        const height: number = Math.abs(topLeft.y - bottomRight.y);
        const X = 0;
        const Y = 1;

        const actualTopLeft: Vec2 = { x: topLeft.x, y: topLeft.y };

        if (isReversed[X]) {
            actualTopLeft.x = bottomRight.x;
        }
        if (isReversed[Y]) {
            actualTopLeft.y = bottomRight.y;
        }

        expect(service.getAnchorPosition(anchor, topLeft, bottomRight, isReversed)).toEqual({
            x: actualTopLeft.x + width,
            y: actualTopLeft.y + height / 2,
        });
    });

    it('getAnchorPosition should return the correct position according to the given anchor point topR', () => {
        const anchor: GridMovementAnchor = GridMovementAnchor.topR;
        const topLeft: Vec2 = { x: 4, y: 3 };
        const bottomRight: Vec2 = { x: 9, y: 6 };
        const isReversed: boolean[] = [false, false];

        const width: number = Math.abs(topLeft.x - bottomRight.x);
        const X = 0;
        const Y = 1;

        const actualTopLeft: Vec2 = { x: topLeft.x, y: topLeft.y };

        if (isReversed[X]) {
            actualTopLeft.x = bottomRight.x;
        }
        if (isReversed[Y]) {
            actualTopLeft.y = bottomRight.y;
        }

        expect(service.getAnchorPosition(anchor, topLeft, bottomRight, isReversed)).toEqual({ x: actualTopLeft.x + width, y: actualTopLeft.y });
    });

    it('getAnchorPosition should return the correct position according to the given anchor point topM', () => {
        const anchor: GridMovementAnchor = GridMovementAnchor.topM;
        const topLeft: Vec2 = { x: 4, y: 3 };
        const bottomRight: Vec2 = { x: 9, y: 6 };
        const isReversed: boolean[] = [false, false];

        const width: number = Math.abs(topLeft.x - bottomRight.x);

        const X = 0;
        const Y = 1;

        const actualTopLeft: Vec2 = { x: topLeft.x, y: topLeft.y };

        if (isReversed[X]) {
            actualTopLeft.x = bottomRight.x;
        }
        if (isReversed[Y]) {
            actualTopLeft.y = bottomRight.y;
        }

        expect(service.getAnchorPosition(anchor, topLeft, bottomRight, isReversed)).toEqual({ x: actualTopLeft.x + width / 2, y: actualTopLeft.y });
    });

    it('getAnchorPosition should return the correct position according to the given anchor point center', () => {
        const anchor: GridMovementAnchor = GridMovementAnchor.center;
        const topLeft: Vec2 = { x: 4, y: 3 };
        const bottomRight: Vec2 = { x: 9, y: 6 };
        const isReversed: boolean[] = [false, false];

        const width: number = Math.abs(topLeft.x - bottomRight.x);
        const height: number = Math.abs(topLeft.y - bottomRight.y);

        const X = 0;
        const Y = 1;

        const actualTopLeft: Vec2 = { x: topLeft.x, y: topLeft.y };

        if (isReversed[X]) {
            actualTopLeft.x = bottomRight.x;
        }
        if (isReversed[Y]) {
            actualTopLeft.y = bottomRight.y;
        }

        expect(service.getAnchorPosition(anchor, topLeft, bottomRight, isReversed)).toEqual({
            x: actualTopLeft.x + width / 2,
            y: actualTopLeft.y + height / 2,
        });
    });

    it('getAnchorPosition should return the correct position according to the given anchor point (inexisting)', () => {
        const inexistingAnchorPoint = 97;
        const topLeft: Vec2 = { x: 4, y: 3 };
        const bottomRight: Vec2 = { x: 9, y: 6 };
        const isReversed: boolean[] = [false, false];

        const X = 0;
        const Y = 1;

        const actualTopLeft: Vec2 = { x: topLeft.x, y: topLeft.y };

        if (isReversed[X]) {
            actualTopLeft.x = bottomRight.x;
        }
        if (isReversed[Y]) {
            actualTopLeft.y = bottomRight.y;
        }

        expect(service.getAnchorPosition(inexistingAnchorPoint, topLeft, bottomRight, isReversed)).toEqual({
            x: actualTopLeft.x,
            y: actualTopLeft.y,
        });
    });

    it('getAnchorPosition should return the correct position according to the given anchor point (inexisting) and if isReversedX', () => {
        const inexistingAnchorPoint = 97;
        const topLeft: Vec2 = { x: 4, y: 3 };
        const bottomRight: Vec2 = { x: 9, y: 6 };
        const isReversed: boolean[] = [true, false];

        const X = 0;
        const Y = 1;

        const actualTopLeft: Vec2 = { x: topLeft.x, y: topLeft.y };

        if (isReversed[X]) {
            actualTopLeft.x = bottomRight.x;
        }
        if (isReversed[Y]) {
            actualTopLeft.y = bottomRight.y;
        }

        expect(service.getAnchorPosition(inexistingAnchorPoint, topLeft, bottomRight, isReversed)).toEqual({
            x: actualTopLeft.x,
            y: actualTopLeft.y,
        });
    });

    it('getAnchorPosition should return the correct position according to the given anchor point (inexisting) and if isReversedY', () => {
        const inexistingAnchorPoint = 97;
        const topLeft: Vec2 = { x: 4, y: 3 };
        const bottomRight: Vec2 = { x: 9, y: 6 };
        const isReversed: boolean[] = [false, true];

        const X = 0;
        const Y = 1;

        const actualTopLeft: Vec2 = { x: topLeft.x, y: topLeft.y };

        if (isReversed[X]) {
            actualTopLeft.x = bottomRight.x;
        }
        if (isReversed[Y]) {
            actualTopLeft.y = bottomRight.y;
        }

        expect(service.getAnchorPosition(inexistingAnchorPoint, topLeft, bottomRight, isReversed)).toEqual({
            x: actualTopLeft.x,
            y: actualTopLeft.y,
        });
    });

    it('getAnchorPosition should return the correct position according to the given anchor point (inexisting) and if isReversedX and isReversedY', () => {
        const inexistingAnchorPoint = 97;
        const topLeft: Vec2 = { x: 4, y: 3 };
        const bottomRight: Vec2 = { x: 9, y: 6 };
        const isReversed: boolean[] = [true, true];

        const X = 0;
        const Y = 1;

        const actualTopLeft: Vec2 = { x: topLeft.x, y: topLeft.y };

        if (isReversed[X]) {
            actualTopLeft.x = bottomRight.x;
        }
        if (isReversed[Y]) {
            actualTopLeft.y = bottomRight.y;
        }

        expect(service.getAnchorPosition(inexistingAnchorPoint, topLeft, bottomRight, isReversed)).toEqual({
            x: actualTopLeft.x,
            y: actualTopLeft.y,
        });
    });

    it('computeMovementAlongGrid should return correct movement', () => {
        const position: Vec2 = { x: 4, y: 3 };
        const movement: Vec2 = { x: -9, y: 0 };
        const gridCellSize = -1;
        const roundingFunction: (n: number) => number = Math.ceil;

        const newPos: Vec2 = { x: position.x, y: position.y };
        newPos.x += movement.x;
        newPos.y += movement.y;
        newPos.x = roundingFunction(newPos.x / gridCellSize) * gridCellSize;
        newPos.y = roundingFunction(newPos.y / gridCellSize) * gridCellSize;
        const correctMovement: Vec2 = { x: newPos.x - position.x, y: newPos.y - position.y };

        expect(service.computeMovementAlongGrid(position, movement, gridCellSize, roundingFunction)).toEqual(correctMovement);
    });
});
