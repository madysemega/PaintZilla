import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import * as Constants from '@app/color-picker/constants/color-slider.constants';
import { ColorPickerService } from '@app/color-picker/services/color-picker/color-picker.service';
import { combineLatest, Subscription } from 'rxjs';
@Component({
    selector: 'app-color-slider',
    templateUrl: './color-slider.component.html',
    styleUrls: ['./color-slider.component.scss'],
})
export class ColorSliderComponent implements AfterViewInit, OnDestroy {
    @ViewChild('colorSlider') colorCanvas: ElementRef<HTMLCanvasElement>;
    private context: CanvasRenderingContext2D;
    private isLeftMouseButtonDown = false;
    private isMouseInside = false;
    private sliderPosition = 0;
    private colorChangedSubscription: Subscription;

    constructor(private ColorPickerService: ColorPickerService) {}

    ngAfterViewInit(): void {
        this.colorCanvas.nativeElement.width = Constants.CANVAS_WIDTH;
        this.colorCanvas.nativeElement.height = Constants.CANVAS_HEIGHT;
        this.context = this.colorCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.colorChangedSubscription = combineLatest([
            this.ColorPickerService.hueChangedObservable,
            this.ColorPickerService.saturationChangedObservable,
            this.ColorPickerService.valueChangedObservable,
            this.ColorPickerService.alphachangedObservable,
        ]).subscribe(() => {
            this.sliderPosition = this.ColorPickerService.alpha * Constants.CANVAS_HEIGHT;
            this.draw();
        });
    }

    ngOnDestroy(): void {
        this.colorChangedSubscription.unsubscribe();
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.isLeftMouseButtonDown) {
            this.updateAlpha(event);
        }
    }

    private draw(): void {}
}
