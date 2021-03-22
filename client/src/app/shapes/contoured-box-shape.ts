import { Vec2 } from '@app/app/classes/vec2';
import { BoxShape } from './box-shape';
import { Shape } from './shape';

export class ContouredBoxShape extends BoxShape {
    constructor(public topLeft: Vec2, public bottomRight: Vec2, public contourWidth: number) {
        super(topLeft, bottomRight);
    }

    clone(): Shape {
        return new ContouredBoxShape({ x: this.topLeft.x, y: this.topLeft.y }, { x: this.bottomRight.x, y: this.bottomRight.y }, this.contourWidth);
    }
}
