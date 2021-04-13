import { Vec2 } from '@app/app/classes/vec2';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { FillStyleProperty } from '@app/shapes/properties/fill-style-property';
import { FontProperty } from '@app/shapes/properties/font-property';
import { TextAlignmentProperty } from '@app/shapes/properties/text-alignment-property';
import { TextCursorRenderer } from '@app/shapes/renderers/text-cursor-renderer';
import { TextRenderer } from '@app/shapes/renderers/text-renderer';
import { TextShape } from '@app/shapes/text-shape';
import { TextCursor } from './text-cursor';
import { TextEditorContext } from './text-editor-context';

export class TextEditor {
    private readonly DEFAULT_CURSOR_POSITION: number = 0;
    private readonly CURSOR_BLINK_DELAI_MS: number = 500;

    private cursorTimerHandle: number;

    constructor(private ctx: TextEditorContext) {
        this.initialize();
    }

    private shape: TextShape;
    private renderer: TextRenderer;

    private colourProperty: FillStyleProperty;
    private fontProperty: FontProperty;
    private textAlignmentProperty: TextAlignmentProperty;

    private showCursor: boolean;
    private cursor: TextCursor;
    private cursorRenderer: TextCursorRenderer;

    private initialize(): void {
        this.shape = new TextShape();
        this.initializeProperties();
        this.renderer = new TextRenderer(this.shape, [this.colourProperty, this.fontProperty, this.textAlignmentProperty]);

        this.cursor = new TextCursor(this.shape, this.DEFAULT_CURSOR_POSITION);
        this.cursorRenderer = new TextCursorRenderer(this.shape, [this.fontProperty], this.cursor);
    }

    private initializeProperties(): void {
        const DEFAULT_IS_BOLD = false;
        const DEFAULT_IS_ITALIC = false;

        this.colourProperty = new FillStyleProperty(this.ctx.colourService.getPrimaryColour());
        this.ctx.colourService.primaryColourChanged.subscribe((colour: Colour) => (this.colourProperty.colour = colour));

        this.fontProperty = new FontProperty(this.shape.fontSize, this.shape.fontName, DEFAULT_IS_BOLD, DEFAULT_IS_ITALIC);
        this.textAlignmentProperty = new TextAlignmentProperty(this.shape.textAlignment);
    }

    reset(position: Vec2 = { x: 0, y: 0 }): void {
        this.disableCursor();

        this.shape.text = TextShape.DEFAULT_TEXT;
        this.shape.position.x = position.x;
        this.shape.position.y = position.y;
    }

    setAlignment(value: CanvasTextAlign): void {
        this.textAlignmentProperty.value = value;
        this.shape.textAlignment = value;
    }

    getAlignment(): CanvasTextAlign {
        return this.shape.textAlignment;
    }

    setFontIsItalic(value: boolean): void {
        this.fontProperty.isItalic = value;
    }

    getFontIsItalic(): boolean {
        return this.fontProperty.isItalic;
    }

    setFontIsBold(value: boolean): void {
        this.fontProperty.isBold = value;
    }

    getFontIsBold(): boolean {
        return this.fontProperty.isBold;
    }

    setFontName(name: string): void {
        this.fontProperty.fontName = name;
        this.shape.fontName = name;
    }

    getFontName(): string {
        return this.shape.fontName;
    }

    setFontSize(size: number): void {
        this.fontProperty.fontSize = size;
        this.shape.fontSize = size;
    }

    getFontSize(): number {
        return this.shape.fontSize;
    }

    enableCursor(): void {
        this.cursorTimerHandle = window.setInterval(() => {
            this.showCursor = !this.showCursor;
            this.render();
        }, this.CURSOR_BLINK_DELAI_MS);
    }

    disableCursor(): void {
        window.clearInterval(this.cursorTimerHandle);
    }

    moveCursorRight(): void {
        this.showCursor = true;

        const canMoveRight = this.cursor.position < this.shape.text.length;
        if (canMoveRight) {
            ++this.cursor.position;
        }

        this.render();
    }

    moveCursorLeft(): void {
        this.showCursor = true;

        const canMoveLeft = this.cursor.position > 0;
        if (canMoveLeft) {
            --this.cursor.position;
        }

        this.render();
    }

    moveCursorUp(): void {
        this.showCursor = true;
        this.cursor.line = this.cursor.line - 1;

        this.render();
    }

    moveCursorDown(): void {
        this.showCursor = true;
        this.cursor.line = this.cursor.line + 1;

        this.render();
    }

    write(text: string): void {
        const prefix: string = this.shape.text.substring(0, this.cursor.position);
        const sufix: string = this.shape.text.substring(this.cursor.position);

        this.shape.text = `${prefix}${text}${sufix}`;

        this.moveCursorRight();
    }

    backspace(): void {
        const prefix: string = this.shape.text.substring(0, this.cursor.position - 1);
        const sufix: string = this.shape.text.substring(this.cursor.position);

        this.shape.text = `${prefix}${sufix}`;

        if (this.cursor.position > 0) {
            this.moveCursorLeft();
        } else {
            this.render();
        }
    }

    delete(): void {
        const prefix: string = this.shape.text.substring(0, this.cursor.position);
        const sufix: string = this.shape.text.substring(this.cursor.position + 1);

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
        return this.renderer.clone() as TextRenderer;
    }

    isEmpty(): boolean {
        return this.shape.text.length === 0;
    }
}
