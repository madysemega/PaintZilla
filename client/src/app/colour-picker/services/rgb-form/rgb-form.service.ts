import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Colour } from '@app/colour-picker/classes/colours.class';
import * as Constants from '@app/colour-picker/constants/rgb-form.constants';
import { ColourPickerService } from '../colour-picker/colour-picker.service';
@Injectable({
    providedIn: 'root',
})
export class RgbFormService {
    rgbFormControl: FormControl;
    constructor(private colourPickerService: ColourPickerService) {}

    updateRgbForm(hexColor: string): void {
        this.rgbFormControl.setValue(hexColor, { emitEvent: false });
    }

    updateColourComponents(): void {
        if (this.rgbFormControl.valid) {
            const colour = this.hexToRgb(this.rgbFormControl.value);
            colour.setAlpha(this.colourPickerService.getAlpha());
            this.colourPickerService.setCurrentColour(colour);
        }
    }

    hexToRgb(hexColor: string): Colour {
        const newColour = new Colour();
        newColour.setRed(parseInt(hexColor.substring(Constants.FIRST_HEX_INDEX, Constants.SECOND_HEX_INDEX), Constants.HEX_BASE));
        newColour.setGreen(parseInt(hexColor.substring(Constants.SECOND_HEX_INDEX, Constants.THIRD_HEX_INDEX), Constants.HEX_BASE));
        newColour.setRed(parseInt(hexColor.substring(Constants.THIRD_HEX_INDEX, Constants.FOURTH_HEX_INDEX), Constants.HEX_BASE));
        return newColour;
    }
}
