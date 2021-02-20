import { Injectable } from '@angular/core';
import { ColorConverter } from '@app/color-picker/classes/color-converter.class';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ColorPickerService {
    private currentColor: ColorConverter = new ColorConverter();
    private hueChangedSubject: BehaviorSubject<number> = new BehaviorSubject<number>(this.currentColor.getHSV()[0]);
    private saturationChangedSubject: BehaviorSubject<number> = new BehaviorSubject<number>(this.currentColor.getHSV()[1]);
    private valueChangedSubject: BehaviorSubject<number> = new BehaviorSubject<number>(this.currentColor.getHSV()[2]);
    private alphaChangedSubject: BehaviorSubject<number> = new BehaviorSubject<number>(this.currentColor.alpha);

    hueChangedObservable = this.hueChangedSubject.asObservable();
    saturationChangedObservable = this.saturationChangedSubject.asObservable();
    valueChangedObservable = this.valueChangedSubject.asObservable();
    alphachangedObservable = this.alphaChangedSubject.asObservable();

    getColor(): ColorConverter {
        return this.currentColor;
    }

    setColor(color: ColorConverter): void {
        
    }
}
