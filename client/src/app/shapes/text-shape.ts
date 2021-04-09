import { Vec2 } from '@app/app/classes/vec2';
import { Shape } from './shape';

export class TextShape extends Shape {
    static readonly DEFAULT_TEXT: string = '';
    static readonly DEFAULT_POSITION: Vec2 = { x: 0, y: 0 };
    static readonly DEFAULT_FONT_SIZE: number = 12;
    static readonly DEFAULT_FONT_NAME: string = 'Arial';

    constructor(
        public text: string = TextShape.DEFAULT_TEXT,
        public position: Vec2 = TextShape.DEFAULT_POSITION,
        public fontSize: number = TextShape.DEFAULT_FONT_SIZE,
        public fontName: string = TextShape.DEFAULT_FONT_NAME,
        public textAlignment: CanvasTextAlign = 'left',
    ) {
        super();
    }

    splitTextInMultipleLines(): string[] {
        const result: string[] = [];
        let currentText = '';
        for (const character of this.text) {
            if (character === '\n') {
                result.push(currentText);
                currentText = '';
            } else {
                currentText += character;
            }
        }
        if (currentText !== '') {
            result.push(currentText);
        }
        return result;
    }

    clone(): Shape {
        return new TextShape(this.text, { x: this.position.x, y: this.position.y }, this.fontSize);
    }
}
