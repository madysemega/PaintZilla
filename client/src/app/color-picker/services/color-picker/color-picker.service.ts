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
        if (color.equals(this.currentColor)) {
            return;
        }
        this.currentColor = color;

        const [hue, saturation, value] = color.getHSV();
        this.hueChangedSubject.next(hue);
        this.saturationChangedSubject.next(saturation);
        this.valueChangedSubject.next(value);
        this.alphaChangedSubject.next(color.alpha);
    }

    getHex(): string {
        return this.currentColor.getHex();
    }

    get hue(): number {
        return this.hueChangedSubject.value;
    }

    set hue(hue: number) {
        this.currentColor = ColorConverter.getColorFromHSV(hue, this.saturationChangedSubject.value, this.valueChangedSubject.value);
        this.currentColor.alpha = this.alphaChangedSubject.value;
        this.hueChangedSubject.next(hue);
    }

    get saturation(): number {
        return this.saturationChangedSubject.value;
    }

    set saturation(saturation: number) {
        this.currentColor = ColorConverter.getColorFromHSV(this.hueChangedSubject.value, saturation, this.valueChangedSubject.value);
        this.currentColor.alpha = this.alphaChangedSubject.value;

        this.saturationChangedSubject.next(saturation);
    }

    get value(): number {
        return this.valueChangedSubject.value;
    }

    set value(value: number) {
        this.currentColor = ColorConverter.getColorFromHSV(this.hueChangedSubject.value, this.saturationChangedSubject.value, value);
        this.currentColor.alpha = this.alphaChangedSubject.value;

        this.valueChangedSubject.next(value);
    }

    get alpha(): number {
        return this.alphaChangedSubject.value;
    }

    set alpha(alpha: number) {
        this.currentColor.alpha = alpha;
        this.alphaChangedSubject.next(alpha);
    }
}
