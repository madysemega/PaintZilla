import { Injectable } from '@angular/core';
import { HandlerMemento } from '@app/app/classes/handler-memento';
import { Vec2 } from '@app/app/classes/vec2';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { GridMovement, GridMovementAnchor, ResizingMode } from '@app/tools/services/selection/selection-utils';
import { EllipseService } from '@app/tools/services/tools/ellipse-service';
import { BehaviorSubject } from 'rxjs';
import { OUTSIDE_DETECTION_OFFSET_PX } from '../selection-constants';
import { SelectionManipulatorService } from './selection-manipulator.service';

@Injectable({
    providedIn: 'root',
})
export abstract class SelectionHelperService {
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

        const rightLimit = isReversedX ? topLeft.x : bottomRight.x;
        const leftLimit = isReversedX ? bottomRight.x : topLeft.x;
        const upLimit = isReversedY ? bottomRight.y : topLeft.y;
        const downLimit = isReversedY ? topLeft.y : bottomRight.y;

        xOutsideSelection =
            mousePosition.x < leftLimit - OUTSIDE_DETECTION_OFFSET_PX|| mousePosition.x > rightLimit + OUTSIDE_DETECTION_OFFSET_PX;

        yOutsideSelection =
            mousePosition.y < upLimit - OUTSIDE_DETECTION_OFFSET_PX || mousePosition.y > downLimit + OUTSIDE_DETECTION_OFFSET_PX;

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

    moveAlongTheGrid(gridMovement: GridMovement): Vec2 {
        const movement: Vec2 = gridMovement.movement;
        const isMouseMovement: boolean = gridMovement.isMouseMovement;
        const gridCellSize: number = gridMovement.gridCellSize;
        const anchor: GridMovementAnchor = gridMovement.anchor;
        const topLeft: Vec2 = gridMovement.topLeft;
        const bottomRight: Vec2 = gridMovement.bottomRight;
        const isReversed: boolean[] = gridMovement.isReversed;

        const positions: Vec2[] = [topLeft, bottomRight];
        const position: Vec2 = this.getAnchorPosition(anchor, positions, isReversed);

        const movementData: Vec2[] = [position, movement];

        if (gridCellSize > 0 && isMouseMovement) {
            return this.computeMovementAlongGrid(movementData, gridCellSize, Math.round);
        }
        if (gridCellSize > 0 && !isMouseMovement && Math.max(movement.x, movement.y) > 0) {
            // increase movement by keyboard
            return this.computeMovementAlongGrid(movementData, gridCellSize, Math.ceil);
        }
        if (gridCellSize > 0 && !isMouseMovement && Math.min(movement.x, movement.y) < 0) {
            // decrease movement by keyboard
            return this.computeMovementAlongGrid(movementData, gridCellSize, Math.floor);
        }
        return movement;
    }

    getAnchorPosition(anchor: GridMovementAnchor, positions: Vec2[], isReversed: boolean[]): Vec2 {
        const topL = positions[0];
        const bottomR = positions[1];
        const width: number = Math.abs(topL.x - bottomR.x);
        const height: number = Math.abs(topL.y - bottomR.y);
        const X = 0;
        const Y = 1;

        const actualTopLeft: Vec2 = { x: topL.x, y: topL.y };

        if (isReversed[X]) {
            actualTopLeft.x = bottomR.x;
        }
        if (isReversed[Y]) {
            actualTopLeft.y = bottomR.y;
        }

        switch (anchor) {
            case GridMovementAnchor.topL:
                return { x: actualTopLeft.x, y: actualTopLeft.y };

            case GridMovementAnchor.middleL:
                return { x: actualTopLeft.x, y: actualTopLeft.y + height / 2 };

            case GridMovementAnchor.bottomL:
                return { x: actualTopLeft.x, y: actualTopLeft.y + height };

            case GridMovementAnchor.bottomM:
                return { x: actualTopLeft.x + width / 2, y: actualTopLeft.y + height };

            case GridMovementAnchor.bottomR:
                return { x: actualTopLeft.x + width, y: actualTopLeft.y + height };

            case GridMovementAnchor.middleR:
                return { x: actualTopLeft.x + width, y: actualTopLeft.y + height / 2 };

            case GridMovementAnchor.topR:
                return { x: actualTopLeft.x + width, y: actualTopLeft.y };

            case GridMovementAnchor.topM:
                return { x: actualTopLeft.x + width / 2, y: actualTopLeft.y };

            case GridMovementAnchor.center:
                return { x: actualTopLeft.x + width / 2, y: actualTopLeft.y + height / 2 };
            default:
                return { x: actualTopLeft.x, y: actualTopLeft.y };
        }
    }

    computeMovementAlongGrid(movementData: Vec2[], gridCellSize: number, roundingFunction: (n: number) => number): Vec2 {
        const position = movementData[0];
        const movement = movementData[1];
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
