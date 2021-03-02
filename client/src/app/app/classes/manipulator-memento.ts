import { Vec2 } from './vec2';

export class ManipulatorMemento {
    topLeft: Vec2;
    bottomRight: Vec2;
    diagonalSlope: number;
    diagonalYIntercept: number;
    mouseLastPos: Vec2 = { x: 0, y: 0 };
    mouseDownLastPos: Vec2 = { x: 0, y: 0 };
    isReversedX: boolean;
    isReversedY: boolean;
}
