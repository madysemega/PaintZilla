import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as Constants from '@app/colour-picker/constants/colour-palette.component.constants';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker.service';
import { SliderService } from '@app/colour-picker/services/slider.service';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-color-palette',
    templateUrl: './colour-palette.component.html',
    styleUrls: ['./colour-palette.component.scss'],
})
export class ColourPaletteComponent implements AfterViewInit, OnDestroy {
    @ViewChild('paletteCanvas') paletteCanvas: ElementRef<HTMLCanvasElement>;
    private isHovering: boolean = false;
    private isAdjusting: boolean = false;
    private hueSubscription: Subscription;
    private saturationSubscription: Subscription;
    private valueSubscription: Subscription;
    constructor(private colourPickerService: ColourPickerService, private sliderService: SliderService) {}
    ngAfterViewInit(): void {
        this.sliderService.paletteCanvas = this.paletteCanvas.nativeElement;
        this.sliderService.paletteCanvas.width = Constants.SLIDER_WIDTH;
        this.sliderService.paletteCanvas.height = Constants.SLIDER_HEIGHT;
    }
    ngOnDestroy(): void {}
}
