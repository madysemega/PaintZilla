import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
@Injectable({
    providedIn: 'root',
})
export class RgbaFormService {
    rgbaFormGroup: FormGroup;
    constructor(private colourPickerService: ColourPickerService) {}

    updateRgbForm(colour: Colour): void {
        this.rgbaFormGroup.controls.redForm.setValue(Colour.toHex(parseInt(colour.getRed().toString())), { emitEvent: false });
        this.rgbaFormGroup.controls.redForm.markAsTouched();
        this.rgbaFormGroup.controls.greenForm.setValue(Colour.toHex(parseInt(colour.getGreen().toString())), { emitEvent: false });
        this.rgbaFormGroup.controls.greenForm.markAsTouched();
        this.rgbaFormGroup.controls.blueForm.setValue(Colour.toHex(parseInt(colour.getBlue().toString())), { eventEmit: false });
        this.rgbaFormGroup.controls.blueForm.markAsTouched();
        this.rgbaFormGroup.controls.alphaForm.setValue((colour.getAlpha() * 100).toString(), { eventEmit: false });
        this.rgbaFormGroup.controls.alphaForm.markAsTouched();
    }

    updateColourComponents(): void {
        if (this.rgbaFormGroup.valid) {
            const currentColourString =
                '' +
                this.rgbaFormGroup.controls.redForm.value +
                this.rgbaFormGroup.controls.greenForm.value +
                this.rgbaFormGroup.controls.blueForm.value;
            const currentColour = Colour.hexToRgb(currentColourString);
            currentColour.setAlpha(this.rgbaFormGroup.controls.alphaForm.value / 100);
            this.colourPickerService.setCurrentColour(currentColour);
        }
    }
}
