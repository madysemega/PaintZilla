import { Injectable } from '@angular/core';
import * as OpacitySliderConstants from '@app/colour-picker/constants/opacity-slider.component.constants';
import { ColourPickerService } from './colour-picker.service';
@Injectable()
export class SliderService {
    opacityCtx: CanvasRenderingContext2D;
    opacityCanvas: HTMLCanvasElement;
    opacitySliderPosition: number = 0;
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
        const radius = 8;
        const cursor = new Path2D();
        cursor.arc(this.opacitySliderPosition, OpacitySliderConstants.SLIDER_HEIGHT / 2, radius, 0, 2 * Math.PI);
        const lineWidth = 2;
        this.opacityCtx.lineWidth = lineWidth;
        this.opacityCtx.strokeStyle = 'black';
        this.opacityCtx.stroke(cursor);
    }

    updateOpacity(event: MouseEvent): void {
        const position = event.clientX - this.opacityCanvas.getBoundingClientRect().x;
        const opacity = Math.min(OpacitySliderConstants.SLIDER_WIDTH, Math.max(0, position)) / OpacitySliderConstants.SLIDER_WIDTH;
        this.colourPickerService.alpha = opacity;
    }
}
