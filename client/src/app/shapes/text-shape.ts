import { Vec2 } from '@app/app/classes/vec2';
import { Shape } from './shape';

export class TextShape extends Shape {
    static readonly DEFAULT_TEXT: string = '';
    static readonly DEFAULT_POSITION: Vec2 = { x: 0, y: 0 };
    static readonly DEFAULT_FONT_SIZE: number = 12;

    constructor(
        public text: string = TextShape.DEFAULT_TEXT,
        public position: Vec2 = TextShape.DEFAULT_POSITION,
        public fontSize: number = TextShape.DEFAULT_FONT_SIZE,
    ) {
        super();
    }

    clone(): Shape {
        return new TextShape(this.text, this.position, this.fontSize);
    }
}
