import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import * as PaletteConstants from '@app/colour-picker/constants/colour-palette.component.constants';
import * as ColourSliderConstants from '@app/colour-picker/constants/colour-slider.component.constants';
import * as OpacitySliderConstants from '@app/colour-picker/constants/opacity-slider.component.constants';
import { Colour } from '../classes/colours.class';
import { ColourPickerService } from './colour-picker.service';

@Injectable({
    providedIn: 'root',
})
export class SliderService {
    opacityCtx: CanvasRenderingContext2D;
    colorCtx: CanvasRenderingContext2D;
    paletteCtx: CanvasRenderingContext2D;
    opacityCanvas: HTMLCanvasElement;
    colorCanvas: HTMLCanvasElement;
    paletteCanvas: HTMLCanvasElement;
    opacitySliderPosition: number = 0;
    colorSliderPosition: number = 0;
    paletteSliderPosition: Vec2 = { x: 0, y: PaletteConstants.SLIDER_HEIGHT };

    constructor(private colourPickerService: ColourPickerService) {}

    drawOpacityContext(): void {
        this.opacityCtx.clearRect(0, 0, OpacitySliderConstants.SLIDER_WIDTH, OpacitySliderConstants.SLIDER_HEIGHT);
        const gradient = this.opacityCtx.createLinearGradient(0, 0, OpacitySliderConstants.SLIDER_WIDTH, 0);
        const color = this.colourPickerService.getCurrentColor().clone();
        color.setAlpha(0);
        gradient.addColorStop(0, color.toStringRBGA());
        gradient.addColorStop(1, color.toStringRBG());
        this.opacityCtx.fillStyle = gradient;
        this.opacityCtx.fillRect(0, 0, OpacitySliderConstants.SLIDER_WIDTH, OpacitySliderConstants.SLIDER_HEIGHT);
        this.drawOpacityCursor();
    }

    drawOpacityCursor(): void {
        const cursorRadius = OpacitySliderConstants.CURSOR_RADIUS;
        const cursor = new Path2D();
        cursor.arc(this.opacitySliderPosition, OpacitySliderConstants.SLIDER_HEIGHT / 2, cursorRadius, 0, 2 * Math.PI);
        this.opacityCtx.lineWidth = OpacitySliderConstants.CURSOR_LINEWIDTH;
        this.opacityCtx.strokeStyle = OpacitySliderConstants.CURSOR_STYLE;
        this.opacityCtx.stroke(cursor);
    }

    updateOpacity(event: MouseEvent): void {
        const position = event.clientX - this.opacityCanvas.getBoundingClientRect().x;
        const opacity = Math.min(OpacitySliderConstants.SLIDER_WIDTH, Math.max(0, position)) / OpacitySliderConstants.SLIDER_WIDTH;
        this.colourPickerService.alpha = opacity;
    }

    drawColorContext(): void {
        const gradient = this.colorCtx.createLinearGradient(0, 0, 0, ColourSliderConstants.SLIDER_HEIGHT);
        const numberOfStops = ColourSliderConstants.GRADIENTS.length;
        for (let i = 0; i < numberOfStops; i++) {
            gradient.addColorStop(i / numberOfStops, ColourSliderConstants.GRADIENTS[i]);
        }
        gradient.addColorStop(1, ColourSliderConstants.GRADIENTS[0]);
        this.colorCtx.fillStyle = gradient;
        this.colorCtx.fillRect(0, 0, ColourSliderConstants.SLIDER_WIDTH, ColourSliderConstants.SLIDER_HEIGHT);
        this.drawColorCursor();
    }

    drawColorCursor(): void {
        const cursorRadius = ColourSliderConstants.CURSOR_RADIUS;
        const cursor = new Path2D();
        cursor.arc(ColourSliderConstants.SLIDER_WIDTH / 2, this.colorSliderPosition, cursorRadius, 0, 2 * Math.PI);
        this.colorCtx.fillStyle = Colour.hslToRgb(
            this.colourPickerService.getHue(),
            ColourSliderConstants.MAX_SATURATION,
            ColourSliderConstants.HALF_LIGHTNESS,
        ).toStringRBG();
        this.colorCtx.fill(cursor);
        this.colorCtx.lineWidth = ColourSliderConstants.CURSOR_LINEWIDTH;
        this.colorCtx.strokeStyle = ColourSliderConstants.CURSOR_STYLE;
        this.colorCtx.stroke(cursor);
    }

    updateColor(event: MouseEvent): void {
        const position = event.clientY - this.colorCanvas.getBoundingClientRect().y;
        const hue =
            (Math.min(ColourSliderConstants.SLIDER_HEIGHT, Math.max(0, position)) / ColourSliderConstants.SLIDER_HEIGHT) *
            ColourSliderConstants.MAX_HUE;
        this.colourPickerService.hue = hue;
    }

    drawPaletteContext(): void {}

    drawPaletteCursor(): void {}

    updatePalette(event: MouseEvent): void {
        const xPosition = event.clientX - this.paletteCanvas.getBoundingClientRect().x;
        const yPosition = event.clientY - this.paletteCanvas.getBoundingClientRect().y;
        this.colourPickerService.saturation = Math.min(PaletteConstants.SLIDER_WIDTH, Math.max(0, xPosition)) / PaletteConstants.SLIDER_WIDTH;
        this.colourPickerService.lightness = Math.min(PaletteConstants.SLIDER_HEIGHT, Math.max(0, yPosition)) / PaletteConstants.SLIDER_HEIGHT;
    }
}
