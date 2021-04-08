import { Vec2 } from '@app/app/classes/vec2';
import { BoxShape } from './box-shape';
import { Shape } from './shape';

export class StampShape extends BoxShape {
    constructor(public topLeft: Vec2, public bottomRight: Vec2, public image: HTMLImageElement, public angle: number, public src: string) {
        super(topLeft, bottomRight);
        image.src = src;
    }
    clone(): Shape {
        return new StampShape(
            { x: this.topLeft.x, y: this.topLeft.y },
            { x: this.bottomRight.x, y: this.bottomRight.y },
            this.image,
            this.angle,
            this.src,
        );
    }
}
