import { Vec2 } from '@app/app/classes/vec2';
import { Shape } from '@app/shapes/shape';
import { DEFAULT_TEXT } from '@app/tools/services/tools/text/text.constants';
import * as Constants from './text-shape.constants';

export class TextShape extends Shape {
    constructor(
        public text: string = DEFAULT_TEXT,
        public position: Vec2 = Constants.DEFAULT_POSITION,
        public fontSize: number = Constants.DEFAULT_FONT_SIZE,
        public fontName: string = Constants.DEFAULT_FONT_NAME,
        public textAlignment: CanvasTextAlign = 'left',
    ) {
        super();
    }

    getMaxLineWidth(ctx: CanvasRenderingContext2D): number {
        return Math.max.apply(
            Math,
            this.splitTextInMultipleLines().map((line) => ctx.measureText(line).width),
        );
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
        return new TextShape(this.text, { x: this.position.x, y: this.position.y }, this.fontSize, this.fontName, this.textAlignment);
    }
}
