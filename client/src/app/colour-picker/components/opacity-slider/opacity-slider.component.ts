import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as Constants from '@app/colour-picker/constants/opacity-slider.component.constants';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker.service';
import { SliderService } from '@app/colour-picker/services/slider.service';
import { combineLatest, Subscription } from 'rxjs';

@Component({
    selector: 'app-opacity-slider',
    templateUrl: './opacity-slider.component.html',
    styleUrls: ['./opacity-slider.component.scss'],
})
export class OpacitySliderComponent implements AfterViewInit, OnDestroy {
    @ViewChild('opacitySlider') opacityCanvas: ElementRef<HTMLCanvasElement>;
    private colourSubscription: Subscription;
    private position: number = 0;
    constructor(private colourPickerService: ColourPickerService, private sliderService: SliderService) {}

    ngAfterViewInit(): void {
        this.sliderService.opacityCanvas = this.opacityCanvas.nativeElement;
        this.opacityCanvas.nativeElement.width = Constants.SLIDER_WIDTH;
        this.opacityCanvas.nativeElement.height = Constants.SLIDER_HEIGHT;
        this.sliderService.opacityCtx = this.opacityCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.colourSubscription = combineLatest([
            this.colourPickerService.alphaObservable,
            this.colourPickerService.hueObservable,
            this.colourPickerService.saturationObservable,
            this.colourPickerService.lightnessObservable,
        ]).subscribe(() => {
            this.position = this.colourPickerService.getAlpha() * Constants.SLIDER_WIDTH;
            this.sliderService.drawOpacityContext();
        });
    }
    ngOnDestroy(): void {
        this.colourSubscription.unsubscribe();
    }
}
