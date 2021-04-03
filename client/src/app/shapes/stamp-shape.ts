import { Vec2 } from '@app/app/classes/vec2';
import { BoxShape } from './box-shape';
import { Shape } from './shape';

export class StampShape extends BoxShape {
    constructor(public topLeft: Vec2, public bottomRight: Vec2, public image: HTMLImageElement, public angle: number) {
        super(topLeft, bottomRight);
        image.src = './assets/icons/black-stamp.svg';
    }
    clone(): Shape {
        console.log(this.image);
        return new StampShape({ x: this.topLeft.x, y: this.topLeft.y }, { x: this.bottomRight.x, y: this.bottomRight.y }, this.image, this.angle);
    }
}
