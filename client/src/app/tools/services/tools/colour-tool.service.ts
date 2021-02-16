import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ColourToolService {
    private readonly DEFAULT_PRIMARY_COLOUR: string = '#000000FF';
    private readonly DEFAULT_SECONDARY_COLOUR: string = '#AAAAAAFF';

    private mPrimaryColour: string;
    private mSecondaryColour: string;

    get primaryColour(): string {
        return this.mPrimaryColour;
    }

    set primaryColour(colour: string) {
        this.mPrimaryColour = colour;
        this.onPrimaryColourChanged.emit(colour);
    }

    get secondaryColour(): string {
        return this.mSecondaryColour;
    }

    set secondaryColour(colour: string) {
        this.mSecondaryColour = colour;
        this.onSecondaryColourChanged.emit(colour);
    }
    
    onPrimaryColourChanged: EventEmitter<string>;
    onSecondaryColourChanged: EventEmitter<string>;

    colourList: string[] = [];

    constructor() {
        this.onPrimaryColourChanged = new EventEmitter();
        this.onSecondaryColourChanged = new EventEmitter();

        this.primaryColour = this.DEFAULT_PRIMARY_COLOUR;
        this.secondaryColour = this.DEFAULT_SECONDARY_COLOUR;
    }
}
