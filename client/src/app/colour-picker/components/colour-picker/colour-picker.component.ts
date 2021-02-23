import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { combineLatest, Subscription } from 'rxjs';

@Component({
    selector: 'app-colour-picker',
    templateUrl: './colour-picker.component.html',
    styleUrls: ['./colour-picker.component.scss'],
})
export class ColourPickerComponent implements OnInit, OnDestroy {
    @Input()
    set colorModel(color: Colour) {
        this.colourPickerService.setCurrentColour(color);
    }
    @Input() colorPreviewToolTip = '';
    @Output() colorModelChange = new EventEmitter<Colour>();
    @Output() colorPreviewClicked = new EventEmitter<void>();
    private colourSubscription: Subscription;
    constructor(private colourPickerService: ColourPickerService) {}
    ngOnInit(): void {
        this.colourSubscription = combineLatest([
            this.colourPickerService.hueObservable,
            this.colourPickerService.saturationObservable,
            this.colourPickerService.valueObservable,
            this.colourPickerService.alphaObservable,
        ]).subscribe(() => {
            this.colorModelChange.emit(this.colourPickerService.getCurrentColor());
        });
    }

    ngOnDestroy(): void {
        this.colourSubscription.unsubscribe();
    }

    onColorPreviewClick(): void {
        this.colorPreviewClicked.emit();
    }

    get color(): Colour {
        return this.colourPickerService.getCurrentColor();
    }
}
