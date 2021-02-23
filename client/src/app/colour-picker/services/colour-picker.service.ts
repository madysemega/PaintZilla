import { Injectable } from '@angular/core';
import { Colour } from '@app/colour-picker/classes/colours.class';
import * as Constants from '@app/colour-picker/constants/colour-picker.service.constants';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ColourPickerService {
    private currentColour: Colour = new Colour();
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

    set hue(hue: number) {
        this.currentColour = Colour.hslToRgb(hue, this.saturationSubject.value, this.lightnessSubject.value);
        this.currentColour.setAlpha(this.alphaSubject.value);
        this.hueSubject.next(hue);
    }

    set saturation(saturation: number) {
        this.currentColour = Colour.hslToRgb(this.hueSubject.value, saturation, this.lightnessSubject.value);
        this.currentColour.setAlpha(this.alphaSubject.value);
        this.saturationSubject.next(saturation);
    }

    set lightness(lightness: number) {
        this.currentColour = Colour.hslToRgb(this.hueSubject.value, this.saturationSubject.value, lightness);
        this.currentColour.setAlpha(this.alphaSubject.value);
        this.lightnessSubject.next(lightness);
    }

    set alpha(alpha: number) {
        this.currentColour.setAlpha(alpha);
        this.alphaSubject.next(alpha);
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
