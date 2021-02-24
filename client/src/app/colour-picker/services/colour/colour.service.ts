import { EventEmitter, Injectable } from '@angular/core';
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
    primaryColourSelected: boolean;
    showColourPicker: boolean;
    showColourPickerChange: EventEmitter<Boolean>;
    colour: Colour;

    constructor(private colourPickerService: ColourPickerService) {
        this.primaryColour = Constants.DEFAULT_PRIMARY;
        this.secondaryColour = Constants.DEFAULT_SECONDARY;
        this.previousColours = Constants.INITIAL_COLORS;
        this.showColourPickerChange = new EventEmitter<boolean>(this.showColourPicker);
    }

    getPrimaryColour(): Colour {
        return this.primaryColour;
    }

    getSecondaryColour(): Colour {
        return this.secondaryColour;
    }

    updatePrimaryColour(): void {
        this.primaryColour = this.colourPickerService.getCurrentColor().clone();
        this.updatePreviousColours(this.primaryColour);
    }

    updateSecondaryColour(): void {
        this.secondaryColour = this.colourPickerService.getCurrentColor().clone();
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

    updateColour(): void {
        this.primaryColourSelected ? this.updatePrimaryColour() : this.updateSecondaryColour();
        this.showColourPicker = false;
        this.showColourPickerChange.emit(this.showColourPicker);
    }

    selectPrimaryColour(): void {
        this.primaryColourSelected = true;
        this.showColourPicker = true;
        this.showColourPickerChange.emit(this.showColourPicker);
        this.colour = this.getPrimaryColour();
    }

    selectSecondaryColour(): void {
        this.primaryColourSelected = false;
        this.showColourPicker = true;
        this.showColourPickerChange.emit(this.showColourPicker);
        this.colour = this.getSecondaryColour();
    }

    swapComponentColours(): void {
        this.swapColours();
        this.colour = this.primaryColourSelected ? this.getPrimaryColour() : this.getSecondaryColour();
    }

    private updatePreviousColours(colour: Colour): void {
        const colorToMatch = (color: Colour) => color.toStringHex() === colour.toStringHex();
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
