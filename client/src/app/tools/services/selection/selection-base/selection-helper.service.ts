import { Injectable } from '@angular/core';
import { HandlerMemento } from '@app/app/classes/handler-memento';
import { Vec2 } from '@app/app/classes/vec2';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { EllipseService } from '@app/tools/services/tools/ellipse-service';
import { BehaviorSubject } from 'rxjs';
import { ResizingMode } from './resizing-mode';
import { GridMovementAnchor } from './selection-constants';
import { SelectionManipulatorService } from './selection-manipulator.service';

@Injectable({
    providedIn: 'root',
})
export abstract class SelectionHelperService {
    readonly OUTSIDE_DETECTION_OFFSET_PX: number = 15;
    isSelectionBeingManipulated: BehaviorSubject<boolean>;

    mementos: HandlerMemento[] = [];

    constructor(protected drawingService: DrawingService, protected colourService: ColourService, private ellipseService: EllipseService) {
        this.isSelectionBeingManipulated = new BehaviorSubject<boolean>(false);
    }

    getSquareAdjustedPerimeter(startPoint: Vec2, endPoint: Vec2): Vec2 {
        return this.ellipseService.getSquareAdjustedPerimeter(startPoint, endPoint);
    }

    drawPerimeter(ctx: CanvasRenderingContext2D, startPoint: Vec2, endPoint: Vec2): void {
        this.ellipseService.drawRectangle(ctx, startPoint, endPoint);
    }

    setIsSelectionBeingManipulated(isItBeingManipulated: boolean): void {
        this.isSelectionBeingManipulated.next(isItBeingManipulated);
    }

    isClickOutsideSelection(positions: Vec2[], isReversedX: boolean, isReversedY: boolean): boolean {
        const mousePosition: Vec2 = positions[0];
        const topLeft: Vec2 = positions[1];
        const bottomRight: Vec2 = positions[2];

        let xOutsideSelection: boolean;
        let yOutsideSelection: boolean;

        if (isReversedX) {
            xOutsideSelection =
                mousePosition.x > topLeft.x + this.OUTSIDE_DETECTION_OFFSET_PX || mousePosition.x < bottomRight.x - this.OUTSIDE_DETECTION_OFFSET_PX;
        } else {
            xOutsideSelection =
                mousePosition.x < topLeft.x - this.OUTSIDE_DETECTION_OFFSET_PX || mousePosition.x > bottomRight.x + this.OUTSIDE_DETECTION_OFFSET_PX;
        }

        if (isReversedY) {
            yOutsideSelection =
                mousePosition.y > topLeft.y + this.OUTSIDE_DETECTION_OFFSET_PX || mousePosition.y < bottomRight.y - this.OUTSIDE_DETECTION_OFFSET_PX;
        } else {
            yOutsideSelection =
                mousePosition.y < topLeft.y - this.OUTSIDE_DETECTION_OFFSET_PX || mousePosition.y > bottomRight.y + this.OUTSIDE_DETECTION_OFFSET_PX;
        }
        return xOutsideSelection || yOutsideSelection;
    }

    addInPlace(vect: Vec2, amount: Vec2): void {
        vect.x += amount.x;
        vect.y += amount.y;
    }

    sub(mousePos: Vec2, mouseDownLastPos: Vec2): Vec2 {
        const mouseMovement: Vec2 = { x: mousePos.x - mouseDownLastPos.x, y: mousePos.y - mouseDownLastPos.y };
        return mouseMovement;
    }

    moveAlongTheGrid(
        movement: Vec2,
        isMouseMovement: boolean,
        gridCellSize: number,
        anchor: GridMovementAnchor,
        topLeft: Vec2,
        bottomRight: Vec2,
        isReversed: boolean[]
    ): Vec2 {
        const position: Vec2 = this.getAnchorPosition(anchor, topLeft, bottomRight, isReversed);

        if (gridCellSize > 0 && isMouseMovement) {
            return this.computeMovementAlongGrid(position, movement, gridCellSize, Math.round);
        }
        if (gridCellSize > 0 && !isMouseMovement && Math.max(movement.x, movement.y) > 0) {
            // increase movement by keyboard
            return this.computeMovementAlongGrid(position, movement, gridCellSize, Math.ceil);
        }
        if (gridCellSize > 0 && !isMouseMovement && Math.min(movement.x, movement.y) < 0) {
            // decrease movement by keyboard
            return this.computeMovementAlongGrid(position, movement, gridCellSize, Math.floor);
        }
        return movement;
    }

    getAnchorPosition(anchor: GridMovementAnchor, topL: Vec2, bottomR: Vec2, isReversed: boolean[]): Vec2 {
        const width: number = Math.abs(topL.x - bottomR.x);
        const height: number = Math.abs(topL.y - bottomR.y);
        const X: number = 0;
        const Y: number = 1;

        let anchorPosition: Vec2 = { x: 0, y: 0 };

        switch (anchor) {
            case GridMovementAnchor.topL:
                anchorPosition = { x: topL.x, y: topL.y };
                if (isReversed[X]) {
                    anchorPosition.x = bottomR.x;
                }
                if (isReversed[Y]) {
                    anchorPosition.y = bottomR.y;
                }
                return anchorPosition

            case GridMovementAnchor.middleL:
                anchorPosition = { x: topL.x, y: topL.y + height / 2 };
                if (isReversed[X]) {
                    anchorPosition.x = bottomR.x;
                }
                return anchorPosition

            case GridMovementAnchor.bottomL:
                anchorPosition = { x: topL.x, y: topL.y + height };
                if (isReversed[X]) {
                    anchorPosition.x = bottomR.x;
                }
                if (isReversed[Y]) {
                    anchorPosition.y = topL.y;
                }
                return anchorPosition

            case GridMovementAnchor.bottomM:
                anchorPosition = { x: topL.x + width / 2, y: topL.y + height };
                if (isReversed[Y]) {
                    anchorPosition.y = topL.y;
                }
                return anchorPosition;

            case GridMovementAnchor.bottomR:
                anchorPosition = { x: topL.x + width, y: topL.y + height };
                if (isReversed[X]) {
                    anchorPosition.x = topL.x;
                }
                if (isReversed[Y]) {
                    anchorPosition.y = topL.y;
                }
                return anchorPosition

            case GridMovementAnchor.middleR:
                anchorPosition = { x: topL.x + width, y: topL.y + height / 2 };
                if (isReversed[X]) {
                    anchorPosition.x = topL.x;
                }
                return anchorPosition

            case GridMovementAnchor.topR:
                anchorPosition = { x: topL.x + width, y: topL.y };
                if (isReversed[X]) {
                    anchorPosition.x = topL.x;
                }
                if (isReversed[Y]) {
                    anchorPosition.y = bottomR.y;
                }
                return anchorPosition;

            case GridMovementAnchor.topM:
                anchorPosition ={ x: topL.x + width / 2, y: topL.y };
                if (isReversed[Y]) {
                    anchorPosition.y = bottomR.y;
                }
                return anchorPosition;

            case GridMovementAnchor.center:
                return { x: topL.x + width / 2, y: topL.y + height / 2 };
            default:
                return { x: topL.x, y: topL.y };
        }
    }

    computeMovementAlongGrid(position: Vec2, movement: Vec2, gridCellSize: number, roundingFunction: (n: number) => number): Vec2 {
        const newPos: Vec2 = { x: position.x, y: position.y };
        this.addInPlace(newPos, movement);
        newPos.x = roundingFunction(newPos.x / gridCellSize) * gridCellSize;
        newPos.y = roundingFunction(newPos.y / gridCellSize) * gridCellSize;
        return this.sub(newPos, position);
    }

    resetManipulatorProperties(manipulator: SelectionManipulatorService): void {
        manipulator.diagonalSlope = 0;
        manipulator.diagonalYIntercept = 0;
        manipulator.topLeft = { x: 0, y: 0 };
        manipulator.bottomRight = { x: 0, y: 0 };
        manipulator.mouseLastPos = { x: 0, y: 0 };
        manipulator.mouseDownLastPos = { x: 0, y: 0 };
        manipulator.resizingMode = ResizingMode.off;
        manipulator.mouseDown = false;
        manipulator.isShiftDown = false;
        manipulator.isReversedY = false;
        manipulator.isReversedX = false;
    }
}
