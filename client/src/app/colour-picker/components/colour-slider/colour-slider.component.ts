import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker.service';
import { SliderService } from '@app/colour-picker/services/slider.service';
import * as Constants from '@app/colour-picker/constants/colour-slider.component.constants';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-colour-slider',
    templateUrl: './colour-slider.component.html',
    styleUrls: ['./colour-slider.component.scss'],
})
export class ColourSliderComponent implements AfterViewInit, OnDestroy {
    @ViewChild('colourSlider') sliderCanvas: ElementRef<HTMLCanvasElement>;
    private isHovering: boolean = false;
    private isAdjustingColour: boolean = false;
    private colorChangedSubscription: Subscription;
    constructor(private colourPickerService: ColourPickerService, private sliderService: SliderService) {}

    ngAfterViewInit(): void {
        this.sliderService.colorCanvas = this.sliderCanvas.nativeElement;
        this.sliderService.colorCanvas.width = Constants.SLIDER_WIDTH;
        this.sliderService.colorCanvas.height = Constants.SLIDER_HEIGHT;
        this.sliderService.colorCtx = this.sliderCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    ngOnDestroy(): void {}
}
