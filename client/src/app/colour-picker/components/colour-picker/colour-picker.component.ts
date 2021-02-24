import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';

@Component({
    selector: 'app-colour-picker',
    templateUrl: './colour-picker.component.html',
    styleUrls: ['./colour-picker.component.scss'],
})
export class ColourPickerComponent {
    @Output() colorPreview = new EventEmitter<void>();
    constructor(private colourPickerService: ColourPickerService, private colourService: ColourService) {}

    confirmColor(): void {
        this.colorPreview.emit();
    }

    @HostListener('mouseenter')
    onMouseEnter(): void {
        this.colourService.onColourPicker = true;
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        this.colourService.onColourPicker = false;
    }

    get color(): Colour {
        return this.colourPickerService.getCurrentColor();
    }
}
