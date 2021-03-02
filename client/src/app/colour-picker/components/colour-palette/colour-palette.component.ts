import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import * as Constants from '@app/colour-picker/constants/colour-palette.component.constants';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { SliderService } from '@app/colour-picker/services/slider/slider.service';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-colour-palette',
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
        this.sliderService.paletteCtx = this.paletteCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.hueSubscription = this.colourPickerService.hueObservable.subscribe((hue: number) => {
            this.sliderService.drawPaletteContext();
        });
        this.saturationSubscription = this.colourPickerService.saturationObservable.subscribe((saturation: number) => {
            this.sliderService.paletteSliderPosition.x = saturation * Constants.SLIDER_WIDTH;
            this.sliderService.drawPaletteContext();
        });
        this.valueSubscription = this.colourPickerService.valueObservable.subscribe((value: number) => {
            this.sliderService.paletteSliderPosition.y = (1 - value) * Constants.SLIDER_HEIGHT;
            this.sliderService.drawPaletteContext();
        });
    }
    ngOnDestroy(): void {
        this.hueSubscription.unsubscribe();
        this.saturationSubscription.unsubscribe();
        this.valueSubscription.unsubscribe();
    }

    @HostListener('mouseenter', ['$event'])
    onMouseEnter(): void {
        this.isHovering = true;
    }

    @HostListener('mouseleave', ['$event'])
    onMouseLeave(): void {
        this.isHovering = false;
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (this.isHovering) {
            this.isAdjusting = true;
            this.sliderService.updatePalette(event);
        }
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.isAdjusting) {
            this.sliderService.updatePalette(event);
        }
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(): void {
        if (this.isAdjusting) {
            this.isAdjusting = false;
        }
    }
}
