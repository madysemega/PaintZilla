import { EventEmitter, Injectable } from '@angular/core';
import { Colour } from '@app/colour-picker/classes/colours.class';
import * as Constants from '@app/colour-picker/constants/colour.service.constants';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
@Injectable({
    providedIn: 'root',
})
export class ColourService {
    private previousColours: Colour[];
    private primaryColour: Colour;
    private secondaryColour: Colour;
    primaryColourSelected: boolean;
    showColourPicker: boolean;
    onColourPicker: boolean;
    showColourPickerChange: EventEmitter<boolean>;
    primaryColourChanged: EventEmitter<Colour>;
    secondaryColourChanged: EventEmitter<Colour>;
    colour: Colour;

    constructor(private colourPickerService: ColourPickerService) {
        this.primaryColour = Constants.DEFAULT_PRIMARY;
        this.secondaryColour = Constants.DEFAULT_SECONDARY;
        this.previousColours = Constants.INITIAL_COLORS;
        this.showColourPickerChange = new EventEmitter<boolean>(this.showColourPicker);
        this.primaryColourChanged = new EventEmitter<Colour>(true);
        this.secondaryColourChanged = new EventEmitter<Colour>(true);
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
        this.primaryColourChanged.emit(this.primaryColour);
    }

    updateSecondaryColour(): void {
        this.secondaryColour = this.colourPickerService.getCurrentColor().clone();
        this.updatePreviousColours(this.secondaryColour);
        this.secondaryColourChanged.emit(this.secondaryColour);
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
        this.colourPickerService.setCurrentColour(this.getPrimaryColour());
    }

    selectSecondaryColour(): void {
        this.primaryColourSelected = false;
        this.showColourPicker = true;
        this.showColourPickerChange.emit(this.showColourPicker);
        this.colourPickerService.setCurrentColour(this.getSecondaryColour());
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
        this.primaryColourChanged.emit(this.primaryColour);
        this.secondaryColourChanged.emit(this.secondaryColour);
    }
}
