import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as Constants from '@app/color-picker/constants/color-slider.constants';
import { ColorPickerService } from '@app/color-picker/services/color-picker/color-picker.service';
@Component({
    selector: 'app-color-slider',
    templateUrl: './color-slider.component.html',
    styleUrls: ['./color-slider.component.scss'],
})
export class ColorSliderComponent implements AfterViewInit {
    @ViewChild('colorSlider') colorCanvas: ElementRef<HTMLCanvasElement>;
    context: CanvasRenderingContext2D;

    constructor(private ColorPickerService: ColorPickerService) {}

    ngAfterViewInit(): void {
        this.colorCanvas.nativeElement.width = Constants.CANVAS_WIDTH;
        this.colorCanvas.nativeElement.height = Constants.CANVAS_HEIGHT;
        this.context = this.colorCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }
}
