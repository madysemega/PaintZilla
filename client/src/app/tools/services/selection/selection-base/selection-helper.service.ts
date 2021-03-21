import { Injectable } from '@angular/core';
import { HandlerMemento } from '@app/app/classes/handler-memento';
import { Vec2 } from '@app/app/classes/vec2';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { EllipseService } from '@app/tools/services/tools/ellipse-service';
import { BehaviorSubject } from 'rxjs';
import { GridMovementAnchor } from './selection-constants';

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

    moveAlongTheGrid(movement: Vec2, isMouseMovement: boolean, gridCellSize: number, anchor: GridMovementAnchor, topLeft: Vec2, bottomRight: Vec2): Vec2 {

        const position: Vec2 = this.getAnchorPosition(anchor, topLeft, bottomRight);

        if (gridCellSize > 0 && isMouseMovement) {
            return this.computeMovementAlongGrid(position, movement, gridCellSize, Math.round);
        }
        if (gridCellSize > 0 && !isMouseMovement && Math.max(movement.x, movement.y) > 0) { //increase movement by keyboard
            return this.computeMovementAlongGrid(position, movement, gridCellSize, Math.ceil);
        }
        if (gridCellSize > 0 && !isMouseMovement && Math.min(movement.x, movement.y) < 0) { //decrease movement by keyboard
            return this.computeMovementAlongGrid(position, movement, gridCellSize, Math.floor);
        }
        return movement;
    }

    getAnchorPosition(anchor: GridMovementAnchor, topL: Vec2, bottomR: Vec2): Vec2 {
        const width: number = Math.abs(topL.x - bottomR.x);
        const height: number = Math.abs(topL.y - bottomR.y);

        switch (anchor) {
            case GridMovementAnchor.center:
                return { x: topL.x + width / 2, y: topL.y + height / 2 };
            default:
                return { x: topL.x + width / 2, y: topL.y + height / 2 };
        }
    }

    computeMovementAlongGrid(position: Vec2, movement: Vec2, gridCellSize: number, roundingFunction: (n: number) => number): Vec2 {
        let newPos: Vec2 = { x: position.x, y: position.y };
        this.addInPlace(newPos, movement);
        newPos.x = roundingFunction((newPos.x) / gridCellSize) * gridCellSize;
        newPos.y = roundingFunction((newPos.y) / gridCellSize) * gridCellSize;
        return this.sub(newPos, position);
    }
}
