import { Injectable } from '@angular/core';
import { Colour } from '@app/colour-picker/classes/colours.class';
import * as Constants from '@app/colour-picker/constants/colour-picker.service.constants';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ColourPickerService {
    private currentColour = new Colour();
    private alphaSubject: BehaviorSubject<number>;
    private hueSubject: BehaviorSubject<number>;
    private saturationSubject: BehaviorSubject<number>;
    private lightnessSubject: BehaviorSubject<number>;
    alphaObservable: Observable<number>;
    hueObservable: Observable<number>;
    saturationObservable: Observable<number>;
    lightnessObservable: Observable<number>;

    constructor() {
        const currentHslColor = this.currentColour.rgbToHsl();
        this.alphaSubject = new BehaviorSubject<number>(this.currentColour.getAlpha());
        this.hueSubject = new BehaviorSubject<number>(currentHslColor[Constants.HUE_INDEX]);
        this.saturationSubject = new BehaviorSubject<number>(currentHslColor[Constants.SATURATION_INDEX]);
        this.lightnessSubject = new BehaviorSubject<number>(currentHslColor[Constants.LIGHTNESS_INDEX]);
        this.alphaObservable = this.alphaSubject.asObservable();
        this.hueObservable = this.hueSubject.asObservable();
        this.saturationObservable = this.saturationSubject.asObservable();
        this.lightnessObservable = this.lightnessSubject.asObservable();
    }

    getHue(): number {
        return this.hueSubject.value;
    }

    getSaturation(): number {
        return this.saturationSubject.value;
    }

    getLightness(): number {
        return this.lightnessSubject.value;
    }

    getAlpha(): number {
        return this.alphaSubject.value;
    }

    getCurrentColor(): Colour {
        return this.currentColour;
    }

    setCurrentColour(colour: Colour): void {
        this.currentColour = colour;
        this.emitChanges(colour);
    }

    emitChanges(colour: Colour): void {
        const colourToHsl = colour.rgbToHsl();
        this.alphaSubject.next(colour.getAlpha());
        this.hueSubject.next(colourToHsl[Constants.HUE_INDEX]);
        this.saturationSubject.next(colourToHsl[Constants.SATURATION_INDEX]);
        this.lightnessSubject.next(colourToHsl[Constants.LIGHTNESS_INDEX]);
    }
}
