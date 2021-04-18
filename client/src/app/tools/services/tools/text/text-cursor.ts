import { TextShape } from '@app/shapes/text-shape/text-shape';

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

    moveToLine(wantedLine: number, ctx: CanvasRenderingContext2D): void {
        const lines = this.shape.splitTextInMultipleLines();

        if (wantedLine < 0) {
            this.position = 0;
        } else if (wantedLine >= lines.length) {
            this.position = this.shape.text.length;
        } else {
            const positionInLine = this.positionInLine;
            switch (this.shape.textAlignment) {
                case 'left':
                    {
                        const pixelWiseOffset = ctx.measureText(lines[this.line].substring(0, positionInLine)).width;
                        this.position = this.getAbsPositionFromLeft(wantedLine, pixelWiseOffset, ctx);
                    }
                    break;
                case 'center':
                    {
                        const pixelWiseOffsetInCurrentLine = ctx.measureText(lines[this.line].substring(0, positionInLine)).width;
                        const currentLineLength = ctx.measureText(lines[this.line]).width;
                        const wantedLineLength = ctx.measureText(lines[wantedLine]).width;
                        const offset = pixelWiseOffsetInCurrentLine - (currentLineLength - wantedLineLength) / 2;
                        this.position = this.getAbsPositionFromLeft(wantedLine, offset, ctx);
                    }
                    break;
                case 'right':
                    {
                        const pixelWiseOffsetInCurrentLine = ctx.measureText(lines[this.line].substring(0, positionInLine)).width;
                        const currentLineLength = ctx.measureText(lines[this.line]).width;
                        this.position = this.getAbsPositionFromRight(wantedLine, currentLineLength - pixelWiseOffsetInCurrentLine, ctx);
                    }
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

    private pixelWiseOffsetToCharWiseOffset(pixelWiseOffset: number, text: string, ctx: CanvasRenderingContext2D): number {
        let charWiseOffset = 0;
        let pixelWiseAccumulator = 0;

        while (pixelWiseAccumulator < pixelWiseOffset) {
            pixelWiseAccumulator += ctx.measureText(text[charWiseOffset]).width;
            ++charWiseOffset;
        }

        return charWiseOffset;
    }

    private getAbsPositionFromLeft(line: number, offsetInPx: number, ctx: CanvasRenderingContext2D): number {
        const lines = this.shape.splitTextInMultipleLines();
        const lineWidthInPx = ctx.measureText(lines[line]).width;
        const lineBeginning = this.getAbsPositionAtLineBeginning(line);

        const charWiseOffset = this.pixelWiseOffsetToCharWiseOffset(Math.min(offsetInPx, lineWidthInPx), lines[line], ctx);

        return lineBeginning + charWiseOffset;
    }

    private getAbsPositionFromRight(line: number, offsetInPx: number, ctx: CanvasRenderingContext2D): number {
        const lines = this.shape.splitTextInMultipleLines();
        const lineWidthInPx = ctx.measureText(lines[line]).width;
        const lineBeginning = this.getAbsPositionAtLineBeginning(line);

        const charWiseOffset = this.pixelWiseOffsetToCharWiseOffset(Math.max(0, lineWidthInPx - offsetInPx), lines[line], ctx);

        return lineBeginning + charWiseOffset;
    }

    clone(newShape: TextShape): TextCursor {
        return new TextCursor(newShape, this.position);
    }
}
