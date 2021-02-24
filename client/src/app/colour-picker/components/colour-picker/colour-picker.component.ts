import { Component, EventEmitter, Output } from '@angular/core';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';

@Component({
    selector: 'app-colour-picker',
    templateUrl: './colour-picker.component.html',
    styleUrls: ['./colour-picker.component.scss'],
})
export class ColourPickerComponent {
    @Output() colorPreview = new EventEmitter<void>();
    constructor(private colourPickerService: ColourPickerService) {}

    confirmColor(): void {
        this.colorPreview.emit();
    }

    get color(): Colour {
        return this.colourPickerService.getCurrentColor();
    }
}
