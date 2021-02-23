import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
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
    private isHovering: boolean = false;
    isAdjustingOpacity: boolean = false;
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
            this.sliderService.opacitySliderPosition = this.colourPickerService.getAlpha() * Constants.SLIDER_WIDTH;
            this.sliderService.drawOpacityContext();
        });
    }
    ngOnDestroy(): void {
        this.colourSubscription.unsubscribe();
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
            this.isAdjustingOpacity = true;
            this.sliderService.updateOpacity(event);
        }
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.isAdjustingOpacity) {
            this.sliderService.updateOpacity(event);
        }
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(): void {
        if (this.isAdjustingOpacity) {
            this.isAdjustingOpacity = false;
        }
    }
}
