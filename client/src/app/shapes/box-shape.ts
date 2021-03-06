import { Vec2 } from '@app/app/classes/vec2';
import { Shape } from './shape';

export class BoxShape extends Shape {
    constructor(public topLeft: Vec2, public bottomRight: Vec2) {
        super();
    }

    get width(): number {
        return this.bottomRight.x - this.topLeft.x;
    }

    get height(): number {
        return this.bottomRight.y - this.topLeft.y;
    }

    clone(): Shape {
        return new BoxShape({ x: this.topLeft.x, y: this.topLeft.y }, { x: this.bottomRight.x, y: this.bottomRight.y });
    }
}
