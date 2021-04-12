import { Vec2 } from '@app/app/classes/vec2';
import { GridMovementAnchor } from './selection-constants';

export class GridMovement {
    movement: Vec2;
    isMouseMovement: boolean;
    gridCellSize: number;
    anchor: GridMovementAnchor;
    topLeft: Vec2;
    bottomRight: Vec2;
    isReversed: boolean[];
}
