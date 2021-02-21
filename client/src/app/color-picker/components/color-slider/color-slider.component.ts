import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import * as Constants from '@app/color-picker/constants/color-slider.constants';
import { ColorPickerService } from '@app/color-picker/services/color-picker/color-picker.service';
import { MouseButton } from '@app/tools/classes/mouse-button';
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
        const canvas = this.colorCanvas.nativeElement;
        canvas.width = Constants.CANVAS_WIDTH;
        canvas.height = Constants.CANVAS_HEIGHT;
        this.context = canvas.getContext('2d') as CanvasRenderingContext2D;

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

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (this.isMouseInside && event.button === MouseButton.Left) {
            this.isLeftMouseButtonDown = true;
            this.updateAlpha(event);
        }
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            this.isLeftMouseButtonDown = false;
        }
    }

    @HostListener('mouseenter')
    onMouseEnter(): void {
        this.isMouseInside = true;
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        this.isMouseInside = false;
    }

    private updateAlpha(event: MouseEvent): void {
        const mouseYPosition = event.clientY - this.colorCanvas.nativeElement.getBoundingClientRect().y;
        const alpha = Math.min(Constants.CANVAS_HEIGHT, Math.max(0, mouseYPosition)) / Constants.CANVAS_HEIGHT;
        this.ColorPickerService.alpha = alpha;
    }
    private draw(): void {
        this.context.clearRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
        const horizontalGradient = this.context.createLinearGradient(0, 0, 0, Constants.CANVAS_HEIGHT);
        const color = this.ColorPickerService.getColor().clone();
    }
}
