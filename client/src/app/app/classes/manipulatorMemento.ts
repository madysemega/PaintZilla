import { Vec2 } from './vec2';

export class ManipulatorMemento {
    public topLeft: Vec2;
    public bottomRight: Vec2;
    public diagonalSlope: number;
    public diagonalYIntercept: number;
    public mouseLastPos: Vec2 = { x: 0, y: 0 };
    public mouseDownLastPos: Vec2 = { x: 0, y: 0 };
    public isReversedX: boolean;
    public isReversedY: boolean;
}