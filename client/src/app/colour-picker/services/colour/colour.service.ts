import { Injectable } from '@angular/core';
import { Colour } from '@app/colour-picker/classes/colours.class';
import * as Constants from '@app/colour-picker/constants/colour.service.constants';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class ColourService {
    private previousColours: Colour[];
    private primaryColourSubject: BehaviorSubject<Colour>;
    private secondaryColourSubject: BehaviorSubject<Colour>;
    primaryColourObservable: Observable<Colour>;
    secondaryColourObservable: Observable<Colour>;
    constructor() {
        this.primaryColourSubject = new BehaviorSubject<Colour>(Constants.DEFAULT_PRIMARY);
        this.secondaryColourSubject = new BehaviorSubject<Colour>(Constants.DEFAULT_SECONDARY);
        this.previousColours = Constants.INITIAL_COLORS;
        this.primaryColourObservable = this.primaryColourSubject.asObservable();
        this.secondaryColourObservable = this.secondaryColourSubject.asObservable();
    }

    getPrimaryColour(): Colour {
        return this.primaryColourSubject.value;
    }

    getSecondaryColour(): Colour {
        return this.secondaryColourSubject.value;
    }

    setPrimaryColour(colour: Colour): void {
        this.updatePreviousColours(colour);
        this.primaryColourSubject.next(colour);
    }

    setSecondaryColour(colour: Colour): void {
        this.updatePreviousColours(colour);
        this.secondaryColourSubject.next(colour);
    }

    getPreviousColours(): Colour[] {
        return this.previousColours;
    }

    private updatePreviousColours(colour: Colour): void {
        const alreadyInPreviousColours = (color: Colour) => color.toStringHex() === colour.toStringHex();
        const index = this.previousColours.findIndex(alreadyInPreviousColours);
        if (index === Constants.NOT_FOUND) {
            this.previousColours.pop();
            this.previousColours.unshift(colour);
        } else {
            this.previousColours[index] = colour;
        }
    }

    swapColours(): void {
        const oldPrime = this.primaryColourSubject.value;
        this.primaryColourSubject.next(this.secondaryColourSubject.value);
        this.secondaryColourSubject.next(oldPrime);
    }
}
