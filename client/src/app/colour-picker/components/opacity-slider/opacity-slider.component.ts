import * as Constants from '@app/colour-picker/constants/opacity-slider.component.constants';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker.service';

@Component({
    selector: 'app-opacity-slider',
    templateUrl: './opacity-slider.component.html',
    styleUrls: ['./opacity-slider.component.scss'],
})

export class OpacitySliderComponent implements AfterViewInit, OnDestroy {
    @ViewChild('opacitySlider') opacityCanvas: ElementRef<HTMLCanvasElement>;
    private ctx: CanvasRenderingContext2D;

    constructor(private colourPickerService: ColourPickerService){}

    ngAfterViewInit(): void {}

    ngOnDestroy(): void {}
}