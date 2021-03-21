import { Vec2 } from '@app/app/classes/vec2';

export enum Arrow {
    down = 0,
    up = 1,
    left = 2,
    right = 3,
}

export enum GridMovementAnchor {
    topL = 0,
    middleL = 1,
    bottomL = 2,
    bottomM = 3,
    bottomR = 4,
    middleR = 5,
    topR = 6,
    topM = 7,
    center = 8,
}

export const MOVEMENT_PX = 3;
export const TIME_BEFORE_START_MOV = 500;
export const TIME_BETWEEN_MOV = 100;
export const OUTSIDE_DETECTION_OFFSET_PX = 15;
export const NUMBER_OF_ARROW_TYPES = 4;
export const MOVEMENT_DOWN: Vec2 = { x: 0, y: MOVEMENT_PX };
export const MOVEMENT_UP: Vec2 = { x: 0, y: -MOVEMENT_PX };
export const MOVEMENT_LEFT: Vec2 = { x: -MOVEMENT_PX, y: 0 };
export const MOVEMENT_RIGHT: Vec2 = { x: MOVEMENT_PX, y: 0 };
