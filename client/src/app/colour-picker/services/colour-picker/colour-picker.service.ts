import { Injectable } from '@angular/core';
import { Colour } from '@app/colour-picker/classes/colours.class';
import * as Constants from '@app/colour-picker/constants/colour-picker.service.constants';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ColourPickerService {
    private currentColour: Colour = new Colour();
    private alphaSubject: BehaviorSubject<number> = new BehaviorSubject<number>(this.currentColour.getAlpha());
    private hueSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private saturationSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private valueSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    alphaObservable: Observable<number> = this.alphaSubject.asObservable();
    hueObservable: Observable<number> = this.hueSubject.asObservable();
    saturationObservable: Observable<number> = this.saturationSubject.asObservable();
    valueObservable: Observable<number> = this.valueSubject.asObservable();
    colourChangedSubscription: Subscription;
    constructor() {
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
        this.currentColour = Colour.hsvToRgb(hue, this.saturationSubject.value, this.valueSubject.value);
        this.currentColour.setAlpha(this.alphaSubject.value);
        this.hueSubject.next(hue);
    }

    set saturation(saturation: number) {
        this.currentColour = Colour.hsvToRgb(this.hueSubject.value, saturation, this.valueSubject.value);
        this.currentColour.setAlpha(this.alphaSubject.value);
        this.saturationSubject.next(saturation);
    }

    set value(value: number) {
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
        if (!this.currentColour.equals(colour)) {
            this.currentColour = colour.clone();
            const hsv = colour.rgbToHsv();
            this.hueSubject.next(hsv[Constants.HUE_INDEX]);
            this.saturationSubject.next(hsv[Constants.SATURATION_INDEX] / Constants.PERCENTAGE);
            this.valueSubject.next(hsv[Constants.VALUE_INDEX] / Constants.PERCENTAGE);
            this.alphaSubject.next(colour.getAlpha());
        }
    }
}
