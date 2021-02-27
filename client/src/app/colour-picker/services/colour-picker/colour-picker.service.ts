import { Injectable } from '@angular/core';
import { Colour } from '@app/colour-picker/classes/colours.class';
import * as Constants from '@app/colour-picker/constants/colour-picker.service.constants';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ColourPickerService {
    private currentColour: Colour = Colour.hsvToRgb(0, 0, 0);
    private alphaSubject: BehaviorSubject<number>;
    private hueSubject: BehaviorSubject<number>;
    private saturationSubject: BehaviorSubject<number>;
    private valueSubject: BehaviorSubject<number>;
    alphaObservable: Observable<number>;
    hueObservable: Observable<number>;
    saturationObservable: Observable<number>;
    valueObservable: Observable<number>;
    currentColourObservable: Observable<Colour>;
    colourChangedSubscription: Subscription;
    constructor() {
        const currentHslColor = this.currentColour.rgbToHsv();
        this.alphaSubject = new BehaviorSubject<number>(this.currentColour.getAlpha());
        this.hueSubject = new BehaviorSubject<number>(currentHslColor[Constants.HUE_INDEX]);
        this.saturationSubject = new BehaviorSubject<number>(currentHslColor[Constants.SATURATION_INDEX]);
        this.valueSubject = new BehaviorSubject<number>(currentHslColor[Constants.VALUE_INDEX]);
        this.alphaObservable = this.alphaSubject.asObservable();
        this.hueObservable = this.hueSubject.asObservable();
        this.saturationObservable = this.saturationSubject.asObservable();
        this.valueObservable = this.valueSubject.asObservable();
        this.colourChangedSubscription = combineLatest([
            this.alphaObservable,
            this.hueObservable,
            this.saturationObservable,
            this.valueObservable,
        ]).subscribe(() => {
            this.currentColour = Colour.hsvToRgb(this.hueSubject.value, this.saturationSubject.value, this.valueSubject.value);
            this.currentColour.setAlpha(this.alphaSubject.value);
        });
    }

    getHue(): number {
        return this.hueSubject.value;
    }

    getSaturation(): number {
        return this.saturationSubject.value;
    }

    getValue(): number {
        return this.valueSubject.value;
    }

    getAlpha(): number {
        return this.alphaSubject.value;
    }

    set hue(hue: number) {
        console.log('HUE: ' + hue);
        this.currentColour = Colour.hsvToRgb(hue, this.saturationSubject.value, this.valueSubject.value);
        this.currentColour.setAlpha(this.alphaSubject.value);
        this.hueSubject.next(hue);
    }

    set saturation(saturation: number) {
        console.log('SATURATION: ' + saturation);
        this.currentColour = Colour.hsvToRgb(this.hueSubject.value, saturation, this.valueSubject.value);
        this.currentColour.setAlpha(this.alphaSubject.value);
        this.saturationSubject.next(saturation);
    }

    set value(value: number) {
        console.log('VALUE: ' + value);
        this.currentColour = Colour.hsvToRgb(this.hueSubject.value, this.saturationSubject.value, value);
        this.currentColour.setAlpha(this.alphaSubject.value);
        this.valueSubject.next(value);
    }

    set alpha(alpha: number) {
        this.currentColour.setAlpha(alpha);
        this.alphaSubject.next(alpha);
    }

    getCurrentColor(): Colour {
        return this.currentColour;
    }

    setCurrentColour(colour: Colour): void {
        this.currentColour = colour.clone();
    }
}
