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
    set colourModel(colour: Colour) {
        this.colourPickerService.setCurrentColour(colour);
    }
    @Output() colorModelChange = new EventEmitter<Colour>();
    @Output() colorPreview = new EventEmitter<void>();
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

    confirmColor(): void {
        this.colorPreview.emit();
    }

    get color(): Colour {
        return this.colourPickerService.getCurrentColor();
    }
}
