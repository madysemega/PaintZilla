import { Vec2 } from '@app/app/classes/vec2';
import { BoxShape } from './box-shape';

export class StampShape extends BoxShape {
    constructor(public topLeft: Vec2, public bottomRight: Vec2, public image: HTMLImageElement) {
        super(topLeft, bottomRight);
    }
}
