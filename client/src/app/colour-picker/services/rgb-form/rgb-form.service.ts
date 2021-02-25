import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
@Injectable({
    providedIn: 'root',
})
export class RgbFormService {
    rgbForm: FormControl;
    constructor(private colourPickerService: ColourPickerService) {}

    updateRgbForm(hexColor: string): void {
        this.rgbForm.setValue(hexColor, { emitEvent: false });
    }

    updateColourComponents(): void {
        if (this.rgbForm.valid) {
            const colour = Colour.hexToRgb(this.rgbForm.value);
            colour.setAlpha(this.colourPickerService.getAlpha());
            this.colourPickerService.setCurrentColour(colour);
        }
    }
}
