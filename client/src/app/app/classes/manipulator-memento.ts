import { Vec2 } from './vec2';

export class ManipulatorMemento {
    topLeft: Vec2 = { x: 0, y: 0 };
    bottomRight: Vec2 = { x: 0, y: 0 };
    diagonalSlope: number = 0;
    diagonalYIntercept: number = 0;
    mouseLastPos: Vec2 = { x: 0, y: 0 };
    mouseDownLastPos: Vec2 = { x: 0, y: 0 };
    isReversedX: boolean = false;
    isReversedY: boolean = false;
}
