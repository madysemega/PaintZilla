import { Vec2 } from '@app/app/classes/vec2';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { FillStyleProperty } from '@app/shapes/properties/fill-style-property';
import { FontProperty } from '@app/shapes/properties/font-property';
import { TextCursorRenderer } from '@app/shapes/renderers/text-cursor-renderer';
import { TextRenderer } from '@app/shapes/renderers/text-renderer';
import { TextShape } from '@app/shapes/text-shape';
import { TextEditorContext } from './text-editor-context';

export class TextEditor {
    private readonly DEFAULT_CURSOR_POSITION: number = 0;
    private readonly CURSOR_BLINK_DELAI_MS: number = 500;

    private cursorTimerHandle: number;

    constructor(private ctx: TextEditorContext) {
        this.reset();
    }

    private shape: TextShape;
    private renderer: TextRenderer;

    private colourProperty: FillStyleProperty;
    private fontProperty: FontProperty;

    private showCursor: boolean;
    private cursorRenderer: TextCursorRenderer;

    initializeProperties(): void {
        this.colourProperty = new FillStyleProperty(this.ctx.colourService.getPrimaryColour());
        this.ctx.colourService.primaryColourChanged.subscribe((colour: Colour) => (this.colourProperty.colour = colour));

        this.fontProperty = new FontProperty(this.shape.fontSize);
    }

    reset(position: Vec2 = { x: 0, y: 0 }): void {
        this.disableCursor();

        this.shape = new TextShape('', position);
        this.initializeProperties();
        this.renderer = new TextRenderer(this.shape, [this.colourProperty, this.fontProperty]);

        this.cursorRenderer = new TextCursorRenderer(this.shape, [], this.DEFAULT_CURSOR_POSITION);

        this.enableCursor();
    }

    enableCursor(): void {
        this.cursorTimerHandle = setInterval(() => {
            this.showCursor = !this.showCursor;
            this.render();
        }, this.CURSOR_BLINK_DELAI_MS);
    }

    disableCursor(): void {
        clearInterval(this.cursorTimerHandle);
    }

    moveCursorRight(): void {
        this.showCursor = true;
        this.cursorRenderer.cursorPosition = (this.cursorRenderer.cursorPosition + 1) % (this.shape.text.length + 1);
        this.render();
    }

    moveCursorLeft(): void {
        this.showCursor = true;

        const isNegativeOverflow = this.cursorRenderer.cursorPosition - 1 < 0;
        this.cursorRenderer.cursorPosition =
            (isNegativeOverflow ? this.shape.text.length - 1 : this.cursorRenderer.cursorPosition - 1) % (this.shape.text.length + 1);

        this.render();
    }

    write(text: string): void {
        const prefix: string = this.shape.text.substring(0, this.cursorRenderer.cursorPosition);
        const sufix: string = this.shape.text.substring(this.cursorRenderer.cursorPosition);

        this.shape.text = `${prefix}${text}${sufix}`;

        this.moveCursorRight();
    }

    backspace(): void {
        const prefix: string = this.shape.text.substring(0, this.cursorRenderer.cursorPosition - 1);
        const sufix: string = this.shape.text.substring(this.cursorRenderer.cursorPosition);

        this.shape.text = `${prefix}${sufix}`;

        if (this.cursorRenderer.cursorPosition > 0) {
            this.moveCursorLeft();
        } else {
            this.render();
        }
    }

    delete(): void {
        const prefix: string = this.shape.text.substring(0, this.cursorRenderer.cursorPosition);
        const sufix: string = this.shape.text.substring(this.cursorRenderer.cursorPosition + 1);

        this.shape.text = `${prefix}${sufix}`;

        this.render();
    }

    render(): void {
        this.ctx.drawingService.clearCanvas(this.ctx.drawingService.previewCtx);
        this.renderer.render(this.ctx.drawingService.previewCtx);
        if (this.showCursor) {
            this.cursorRenderer.render(this.ctx.drawingService.previewCtx);
        }
    }

    getTextRenderer(): TextRenderer {
        return this.renderer.clone();
    }

    isEmpty(): boolean {
        return this.shape.text.length === 0;
    }
}
