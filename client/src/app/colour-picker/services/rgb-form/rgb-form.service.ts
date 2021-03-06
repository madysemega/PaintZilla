import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Colour } from '@app/colour-picker/classes/colours.class';
import * as Constants from '@app/colour-picker/constants/rgb-form.constants';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
@Injectable({
    providedIn: 'root',
})
export class RgbaFormService {
    rgbaFormGroup: FormGroup;
    isTyping: boolean = false;
    constructor(private colourPickerService: ColourPickerService) {}

    updateRgbForm(colour: Colour): void {
        if (!this.isTyping) {
            this.rgbaFormGroup.controls.redForm.setValue(Colour.toHex(parseInt(colour.getRed().toString(), Constants.RADIX)), { emitEvent: false });
            this.rgbaFormGroup.controls.redForm.markAsTouched();
            this.rgbaFormGroup.controls.greenForm.setValue(Colour.toHex(parseInt(colour.getGreen().toString(), Constants.RADIX)), {
                emitEvent: false,
            });
            this.rgbaFormGroup.controls.greenForm.markAsTouched();
            this.rgbaFormGroup.controls.blueForm.setValue(Colour.toHex(parseInt(colour.getBlue().toString(), Constants.RADIX)), { emitEvent: false });
            this.rgbaFormGroup.controls.blueForm.markAsTouched();
            this.rgbaFormGroup.controls.alphaForm.setValue((colour.getAlpha() * Constants.PERCENTAGE).toString(), { emitEvent: false });
            this.rgbaFormGroup.controls.alphaForm.markAsTouched();
        }
    }

    updateColourComponents(): void {
        if (this.rgbaFormGroup.valid) {
            const currentColourString = this.formString();
            const currentColour = Colour.hexToRgb(currentColourString);
            currentColour.setAlpha(this.rgbaFormGroup.controls.alphaForm.value / Constants.PERCENTAGE);
            this.colourPickerService.setCurrentColour(currentColour);
        }
    }

    private formString(): string {
        return (
            '' + this.rgbaFormGroup.controls.redForm.value + this.rgbaFormGroup.controls.greenForm.value + this.rgbaFormGroup.controls.blueForm.value
        );
    }
}
