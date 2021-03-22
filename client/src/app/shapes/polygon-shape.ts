import { Vec2 } from '@app/app/classes/vec2';
import { BoxShape } from './box-shape';
import { Shape } from './shape';
const MIN_NUMBER_SIDES = 3;
export class PolygonShape extends BoxShape {
    constructor(public topLeft: Vec2, public bottomRight: Vec2, public numberSides: number, public contourWidth: number) {
        super(topLeft, bottomRight);
        numberSides = MIN_NUMBER_SIDES;
    }

    clone(): Shape {
        return new PolygonShape(
            { x: this.topLeft.x, y: this.topLeft.y },
            { x: this.bottomRight.x, y: this.bottomRight.y },
            this.numberSides, this.contourWidth);
    }
}
