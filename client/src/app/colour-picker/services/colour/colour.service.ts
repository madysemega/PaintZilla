import { EventEmitter, Injectable } from '@angular/core';
import { Colour } from '@app/colour-picker/classes/colours.class';
import * as Constants from '@app/colour-picker/constants/colour.service.constants';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
@Injectable({
    providedIn: 'root',
})
export class ColourService {
    private previousColours: Colour[] = Constants.INITIAL_COLORS;
    private primaryColour: Colour = Constants.DEFAULT_PRIMARY;
    private secondaryColour: Colour = Constants.DEFAULT_SECONDARY;
    primaryColourSelected: boolean;
    showColourPicker: boolean;
    onColourPicker: boolean;
    showColourPickerChange: EventEmitter<boolean> = new EventEmitter<boolean>(this.showColourPicker);
    primaryColourChanged: EventEmitter<Colour> = new EventEmitter<Colour>(true);
    secondaryColourChanged: EventEmitter<Colour> = new EventEmitter<Colour>(true);

    constructor(private colourPickerService: ColourPickerService) {}

    updatePrimaryColour(): void {
        this.primaryColour = this.colourPickerService.getCurrentColor().clone();
        this.updatePreviousColours(this.primaryColour);
        this.primaryColourChanged.emit(this.primaryColour);
    }

    updateSecondaryColour(): void {
        this.secondaryColour = this.colourPickerService.getCurrentColor().clone();
        this.updatePreviousColours(this.secondaryColour);
        this.secondaryColourChanged.emit(this.secondaryColour);
    }

    getPrimaryColour(): Colour {
        return this.primaryColour;
    }

    getSecondaryColour(): Colour {
        return this.secondaryColour;
    }

    setPrimaryColour(colour: Colour): void {
        this.primaryColour = colour.clone();
        this.primaryColourChanged.emit(this.primaryColour);
    }

    setSecondaryColour(colour: Colour): void {
        this.secondaryColour = colour.clone();
        this.secondaryColourChanged.emit(this.secondaryColour);
    }

    getPreviousColours(): Colour[] {
        return this.previousColours;
    }

    updateColour(): void {
        this.primaryColourSelected ? this.updatePrimaryColour() : this.updateSecondaryColour();
        this.showColourPicker = false;
        this.primaryColourChanged.emit(this.primaryColour);
        this.secondaryColourChanged.emit(this.secondaryColour);
        this.showColourPickerChange.emit(this.showColourPicker);
    }

    selectPrimaryColour(): void {
        this.primaryColourSelected = true;
        this.showColourPicker = true;
        this.showColourPickerChange.emit(this.showColourPicker);
        this.colourPickerService.setCurrentColour(this.primaryColour);
    }

    selectSecondaryColour(): void {
        this.primaryColourSelected = false;
        this.showColourPicker = true;
        this.showColourPickerChange.emit(this.showColourPicker);
        this.colourPickerService.setCurrentColour(this.secondaryColour);
    }

    swapComponentColours(): void {
        this.swapColours();
        this.colourPickerService.setCurrentColour(this.primaryColourSelected ? this.primaryColour : this.secondaryColour);
    }

    updatePreviousColours(colour: Colour): void {
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
        this.primaryColourChanged.emit(this.primaryColour);
        this.secondaryColourChanged.emit(this.secondaryColour);
    }
}
