import { TextShape } from '@app/shapes/text-shape';

export class TextCursor {
    constructor(private shape: TextShape, public position: number) {}

    get line(): number {
        let lineNumber = 0;

        for (let i = 0; i < this.position; ++i) {
            const character = this.shape.text[i];

            if (character === '\n') {
                ++lineNumber;
            }
        }

        return lineNumber;
    }

    set line(wantedLine: number) {
        const lines = this.shape.splitTextInMultipleLines();

        if(wantedLine < 0) {
            this.position = 0;
        } else if(wantedLine >= lines.length) {
            this.position = this.shape.text.length;
        } else {
            const positionInLine = this.positionInLine;
            switch (this.shape.textAlignment) {
                case 'left':
                    this.position = this.getAbsPositionFromLeft(wantedLine, positionInLine);
                    break;
                case 'center':
                    const offset = Math.floor(positionInLine - ((lines[this.line].length - lines[wantedLine].length) / 2));
                    this.position = this.getAbsPositionFromLeft(wantedLine, offset);
                    break;
                case 'right':
                    this.position = this.getAbsPositionFromRight(wantedLine, lines[this.line].length - positionInLine);
                    break;
            }
        }
    }

    get positionInLine(): number {
        let positionInCurrentLine = 0;
        for (let i = 0; i < this.position; ++i) {
            ++positionInCurrentLine;

            const character = this.shape.text[i];
            if (character === '\n') {
                positionInCurrentLine = 0;
            }
        }

        return positionInCurrentLine;
    }

    private getAbsPositionAtLineBeginning(line: number): number {
        const lines = this.shape.splitTextInMultipleLines();
        
        let currentPosition = 0;
        for (let i = 0; i < line; ++i) {
            currentPosition += lines[i].length + 1;
        }

        return currentPosition;
    }

    private getAbsPositionFromLeft(line: number, offset: number): number {
        const lines = this.shape.splitTextInMultipleLines();
        const lineBeginning = this.getAbsPositionAtLineBeginning(line);

        return lineBeginning + Math.min(offset, lines[line].length);
    }

    private getAbsPositionFromRight(line: number, offset: number): number {
        const lines = this.shape.splitTextInMultipleLines();
        const lineBeginning = this.getAbsPositionAtLineBeginning(line);

        return lineBeginning + Math.max(0, lines[line].length - offset);
    }

    clone(newShape: TextShape): TextCursor {
        return new TextCursor(newShape, this.position);
    }
}
