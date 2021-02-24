import { Injectable } from '@angular/core';
import { Colour } from '@app/colour-picker/classes/colours.class';
import * as Constants from '@app/colour-picker/constants/colour.service.constants';
import { ColourPickerService } from '../colour-picker/colour-picker.service';
@Injectable({
    providedIn: 'root',
})
export class ColourService {
    private previousColours: Colour[];
    private primaryColour: Colour;
    private secondaryColour: Colour;
    constructor(private colourPickerService: ColourPickerService) {
        this.primaryColour = Constants.DEFAULT_PRIMARY;
        this.secondaryColour = Constants.DEFAULT_SECONDARY;
        this.previousColours = Constants.INITIAL_COLORS;
    }

    getPrimaryColour(): Colour {
        return this.primaryColour;
    }

    getSecondaryColour(): Colour {
        return this.secondaryColour;
    }

    updatePrimaryColour(): void {
        this.primaryColour = this.colourPickerService.getCurrentColor();
        this.updatePreviousColours(this.primaryColour);
    }

    updateSecondaryColour(): void {
        this.secondaryColour = this.colourPickerService.getCurrentColor();
        this.updatePreviousColours(this.secondaryColour);
    }

    setPrimaryColour(colour: Colour): void {
        this.primaryColour = colour.clone();
    }

    setSecondaryColour(colour: Colour): void {
        this.secondaryColour = colour.clone();
    }

    getPreviousColours(): Colour[] {
        return this.previousColours;
    }

    private updatePreviousColours(colour: Colour): void {
        const colorToMatch = (color: Colour) => color.toStringHex() === colour.toStringHex();
        console.log('From updatePreviousColours: ' + colour.toStringHex());
        const index = this.previousColours.findIndex(colorToMatch);
        if (index === Constants.NOT_FOUND) {
            this.previousColours.pop();
            this.previousColours.unshift(colour);
        } else {
            this.previousColours[index] = colour;
        }
    }

    swapColours(): void {
        const oldPrime = this.primaryColour;
        this.primaryColour = this.secondaryColour;
        this.secondaryColour = oldPrime;
    }
}
