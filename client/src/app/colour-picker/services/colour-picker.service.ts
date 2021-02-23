import { Injectable } from '@angular/core';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { BehaviorSubject, Observable } from 'rxjs';

export const HUE_INDEX = 0;
export const SATURATION_INDEX = 1;
export const LIGHTNESS_INDEX = 2;

@Injectable()
export class ColourPickerService {
    private currentColour = new Colour();
    private alphaSubject: BehaviorSubject<number>;
    private hueSubject: BehaviorSubject<number>;
    private saturationSubject: BehaviorSubject<number>;
    private lightnessSubject: BehaviorSubject<number>;
    public alphaObservable: Observable<number>;
    public hueObservable: Observable<number>;
    public saturationObservable: Observable<number>;
    public lightnessObservable: Observable<number>;

    constructor() {
        const currentHslColor = this.currentColour.rgbToHsl();
        this.alphaSubject = new BehaviorSubject<number>(this.currentColour.getAlpha());
        this.hueSubject = new BehaviorSubject<number>(currentHslColor[HUE_INDEX]);
        this.saturationSubject = new BehaviorSubject<number>(currentHslColor[SATURATION_INDEX]);
        this.lightnessSubject = new BehaviorSubject<number>(currentHslColor[LIGHTNESS_INDEX]);
        this.alphaObservable = this.alphaSubject.asObservable();
        this.hueObservable = this.hueSubject.asObservable();
        this.saturationObservable = this.saturationSubject.asObservable();
        this.lightnessObservable = this.lightnessSubject.asObservable();
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
        this.hueSubject.next(colourToHsl[HUE_INDEX]);
        this.saturationSubject.next(colourToHsl[SATURATION_INDEX]);
        this.lightnessSubject.next(colourToHsl[LIGHTNESS_INDEX]);
    }
}
