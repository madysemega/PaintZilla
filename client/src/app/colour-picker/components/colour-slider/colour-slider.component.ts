import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import * as Constants from '@app/colour-picker/constants/colour-slider.component.constants';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { SliderService } from '@app/colour-picker/services/slider/slider.service';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-colour-slider',
    templateUrl: './colour-slider.component.html',
    styleUrls: ['./colour-slider.component.scss'],
})
export class ColourSliderComponent implements AfterViewInit, OnDestroy {
    // references: The code for this component is based on this tutorial:
    // https://malcoded.com/posts/angular-color-picker/?fbclid=IwAR36r1I6KVkeGpI0Oe8nugWldmO1xhhSrXFg5aFnN_OEe0zBQww18UEtAVI
    @ViewChild('colourSlider') sliderCanvas: ElementRef<HTMLCanvasElement>;
    private isHovering: boolean = false;
    private isAdjustingColour: boolean = false;
    private hueSubscription: Subscription;
    constructor(private colourPickerService: ColourPickerService, private sliderService: SliderService) {}

    ngAfterViewInit(): void {
        this.sliderService.colorCanvas = this.sliderCanvas.nativeElement;
        this.sliderService.colorCanvas.width = Constants.SLIDER_WIDTH;
        this.sliderService.colorCanvas.height = Constants.SLIDER_HEIGHT;
        this.sliderService.colorCtx = this.sliderCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.hueSubscription = this.colourPickerService.hueObservable.subscribe((hue: number) => {
            this.sliderService.colorSliderPosition = (hue / Constants.MAX_HUE) * Constants.SLIDER_HEIGHT;
            this.sliderService.drawColorContext();
        });
    }

    ngOnDestroy(): void {
        this.hueSubscription.unsubscribe();
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
            this.isAdjustingColour = true;
            this.sliderService.updateColor(event);
        }
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.isAdjustingColour) {
            this.sliderService.updateColor(event);
        }
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(): void {
        if (this.isAdjustingColour) {
            this.isAdjustingColour = false;
        }
    }
}
