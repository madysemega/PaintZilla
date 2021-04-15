import { Vec2 as Constants } from '@app/app/classes/vec2';

export const MOVEMENT_PX = 3;
export const TIME_BEFORE_START_MOV = 500;
export const TIME_BETWEEN_MOV = 100;
export const OUTSIDE_DETECTION_OFFSET_PX = 15;
export const NUMBER_OF_ARROW_TYPES = 4;
export const MOVEMENT_DOWN: Constants = { x: 0, y: MOVEMENT_PX };
export const MOVEMENT_UP: Constants = { x: 0, y: -MOVEMENT_PX };
export const MOVEMENT_LEFT: Constants = { x: -MOVEMENT_PX, y: 0 };
export const MOVEMENT_RIGHT: Constants = { x: MOVEMENT_PX, y: 0 };
export const MAGNETISM_OFF = 1;

